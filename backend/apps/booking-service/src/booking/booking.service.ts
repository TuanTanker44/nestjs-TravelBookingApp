import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Booking } from './entities/booking.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingPaymentStatus } from './enums/payment-status.enum';
import { BookingStatus } from './enums/status.enum';
import { Cron } from '@nestjs/schedule/dist/decorators/cron.decorator';
import { BookingRoom } from '../booking_room/entities/booking_room.entity';
import { RedisService } from '../redis/redis.service';

interface IBookingService {
  createBooking(dto: CreateBookingDto): Promise<Booking>;
  changeBookingStatus(id: string, status: BookingStatus): Promise<string>;
  changePaymentStatus(
    id: string,
    paymentStatus: BookingPaymentStatus,
  ): Promise<string>;
  confirmBooking(id: string): Promise<string>;
  cancelBooking(id: string): Promise<string>;
  expireBooking(id: string): Promise<string>;
  getBookingById(id: string): Promise<Booking>;
  updateBooking(id: string, dto: UpdateBookingDto): Promise<string>;
  deleteBooking(id: string): Promise<string>;
  checkIn(id: string): Promise<string>;
  checkOutPending(id: string): Promise<string>;
  checkOut(id: string): Promise<string>;
}

@Injectable()
export class BookingService implements IBookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly redis: RedisService,
  ) {}

  async createBooking(dto: CreateBookingDto): Promise<Booking> {
    if (!dto.checkInDate || !dto.checkOutDate) {
      throw new BadRequestException(
        'Check-in and check-out dates are required',
      );
    }
    const checkIn = new Date(dto.checkInDate);
    const checkOut = new Date(dto.checkOutDate);
    if (checkIn >= checkOut) {
      throw new BadRequestException(
        'Check-out date must be after check-in date',
      );
    }
    if (checkIn < new Date()) {
      throw new BadRequestException('Check-in date cannot be in the past');
    }
    const totalAmount = this.calculateTotalAmount(
      dto.bookingRooms,
      checkIn,
      checkOut,
    );
    const booking = await this.bookingRepository.save({
      userId: dto.userId,
      bookingRooms: dto.bookingRooms,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalAmount,
    });

    return booking;
  }

  async changeBookingStatus(
    id: string,
    status: BookingStatus,
  ): Promise<string> {
    const booking = await this.getBookingById(id);
    if (
      booking.status === BookingStatus.PENDING &&
      (status === BookingStatus.CONFIRMED || status === BookingStatus.CANCELLED)
    ) {
      await this.bookingRepository.update(booking.id, { status });
      await this.invalidateBookingCache();
      return `Booking ${booking.id} status updated to ${status}`;
    }
    if (
      booking.status === BookingStatus.CONFIRMED &&
      (status === BookingStatus.COMPLETED || status === BookingStatus.CANCELLED)
    ) {
      await this.bookingRepository.update(booking.id, { status });
      await this.invalidateBookingCache();
      return `Booking ${booking.id} status updated to ${status}`;
    }
    if (
      booking.status === BookingStatus.CANCELLED &&
      status === BookingStatus.COMPLETED
    ) {
      throw new BadRequestException(
        'Cannot change status for a completed or cancelled booking',
      );
    }
    throw new BadRequestException('Invalid booking status transition');
  }

  async changePaymentStatus(
    id: string,
    paymentStatus: BookingPaymentStatus,
  ): Promise<string> {
    const booking = await this.getBookingById(id);
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException(
        'Payment status can only be changed for pending bookings',
      );
    }
    if (
      booking.paymentStatus !== BookingPaymentStatus.PAID &&
      paymentStatus === BookingPaymentStatus.REFUNDED
    ) {
      throw new BadRequestException('Only paid bookings can be refunded');
    }
    if (paymentStatus === BookingPaymentStatus.PAID) {
      booking.status = BookingStatus.CONFIRMED;
    } else if (paymentStatus === BookingPaymentStatus.REFUNDED) {
      booking.status = BookingStatus.CANCELLED;
    }
    await this.bookingRepository.update(booking.id, {
      paymentStatus,
      status: booking.status,
    });
    await this.invalidateBookingCache();
    return `Booking ${booking.id} payment status updated to ${paymentStatus}`;
  }

  async confirmBooking(id: string): Promise<string> {
    const booking = await this.getBookingById(id);
    if (booking.status !== BookingStatus.PENDING) {
      throw new BadRequestException('Only pending bookings can be confirmed');
    }
    await this.bookingRepository.update(booking.id, {
      status: BookingStatus.CONFIRMED,
    });
    return `Booking ${booking.id} has been confirmed`;
  }

  @Cron('0 0 * * *')
  async expireBooking(id: string): Promise<string> {
    const booking = await this.getBookingById(id);
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed bookings can be completed');
    }
    if (booking.status === BookingStatus.CONFIRMED) {
      const checkOutDate = new Date(booking.checkOutDate);
      if (checkOutDate > new Date()) {
        throw new BadRequestException(
          'Cannot complete booking before check-out date',
        );
      }
    }
    await this.bookingRepository.update(booking.id, {
      status: BookingStatus.COMPLETED,
    });
    return `Booking ${booking.id} has been completed`;
  }

  async cancelBooking(id: string): Promise<string> {
    const booking = await this.getBookingById(id);
    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed booking');
    }
    await this.bookingRepository.update(booking.id, {
      status: BookingStatus.CANCELLED,
    });
    return `Booking ${booking.id} has been cancelled`;
  }

  async getBookingById(id: string): Promise<Booking> {
    const key = `booking:${id}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Booking;
    }

    const booking = await this.bookingRepository.findOneBy({ id });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    await this.redis.set(key, JSON.stringify(booking), 3600);

    return booking;
  }

  async updateBooking(id: string, dto: UpdateBookingDto): Promise<string> {
    if (!dto.checkInDate || !dto.checkOutDate) {
      throw new BadRequestException(
        'Check-in and check-out dates are required',
      );
    }
    const checkIn = new Date(dto.checkInDate);
    const checkOut = new Date(dto.checkOutDate);
    if (checkIn >= checkOut) {
      throw new BadRequestException(
        'Check-out date must be after check-in date',
      );
    }
    if (checkIn < new Date()) {
      throw new BadRequestException('Check-in date cannot be in the past');
    }
    const booking = await this.getBookingById(id);
    if (
      booking.status === BookingStatus.COMPLETED ||
      booking.status === BookingStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'Cannot update a completed or cancelled booking',
      );
    }
    await this.bookingRepository.update(booking.id, {
      userId: dto.userId,
      bookingRooms: dto.bookingRooms,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      totalAmount: dto.totalAmount,
    });
    await this.invalidateBookingCache();
    return `Booking ${booking.id} has been updated`;
  }

  async deleteBooking(id: string): Promise<string> {
    const booking = await this.getBookingById(id);
    await this.bookingRepository.update(booking.id, {
      status: BookingStatus.CANCELLED,
    });
    await this.invalidateBookingCache();
    return `Booking ${booking.id} has been deleted`;
  }

  async checkIn(id: string): Promise<string> {
    const booking = await this.getBookingById(id);
    if (booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException(
        'Only confirmed bookings can be checked in',
      );
    }
    const checkInDate = new Date(booking.checkInDate);
    if (checkInDate > new Date()) {
      throw new BadRequestException(
        'Cannot check in before the scheduled check-in date',
      );
    }
    await this.bookingRepository.update(booking.id, {
      status: BookingStatus.CHECKED_IN,
    });
    return `Booking ${booking.id} has been checked in`;
  }

  async checkOutPending(id: string): Promise<string> {
    const booking = await this.getBookingById(id);
    if (booking.status !== BookingStatus.CHECKED_IN) {
      throw new BadRequestException(
        'Only checked-in bookings can have their checkout pending',
      );
    }
    await this.bookingRepository.update(booking.id, {
      status: BookingStatus.CHECKED_OUT,
    });
    return `Booking ${booking.id} has been checked out`;
  }

  async checkOut(id: string): Promise<string> {
    const booking = await this.getBookingById(id);
    if (booking.status !== BookingStatus.CHECKED_OUT) {
      throw new BadRequestException(
        'Only checked-out bookings can be completed',
      );
    }
    await this.bookingRepository.update(booking.id, {
      status: BookingStatus.COMPLETED,
    });
    return `Booking ${booking.id} has been completed`;
  }

  private calculateNights(checkIn: Date, checkOut: Date): number {
    const diff = checkOut.getTime() - checkIn.getTime();

    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  private calculateTotalAmount(
    rooms: BookingRoom[],
    checkIn: Date,
    checkOut: Date,
  ): number {
    const nights = this.calculateNights(checkIn, checkOut);

    return rooms.reduce(
      (total, room) => total + room.pricePerNight * room.quantity * nights,
      0,
    );
  }

  private async invalidateBookingCache() {
    await this.redis.delPattern('booking:*');
  }
}
