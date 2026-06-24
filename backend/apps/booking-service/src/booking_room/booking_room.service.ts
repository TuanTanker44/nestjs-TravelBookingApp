import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBookingRoomDto } from './dto/create-booking_room.dto';
import { UpdateBookingRoomDto } from './dto/update-booking_room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingRoom } from './entities/booking_room.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class BookingRoomService {
  constructor(
    @InjectRepository(BookingRoom)
    private bookingRoomRepository: Repository<BookingRoom>,
    private readonly redis: RedisService,
  ) {}

  async create(createBookingRoomDto: CreateBookingRoomDto) {
    const { bookingId, roomId, quantity, pricePerNight, numberOfNights } =
      createBookingRoomDto;

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    if (numberOfNights <= 0) {
      throw new BadRequestException('Number of nights must be greater than 0');
    }

    const subtotal = quantity * Number(pricePerNight) * numberOfNights;

    const bookingRoom = this.bookingRoomRepository.create({
      bookingId,
      roomId,
      quantity,
      pricePerNight,
      numberOfNights,
      subtotal,
    });

    return await this.bookingRoomRepository.save(bookingRoom);
  }

  async findAll() {
    const key = 'booking-room:list';

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as BookingRoom[];
    }

    const bookingRooms = await this.bookingRoomRepository.find({
      relations: ['booking'],
    });

    await this.redis.set(key, JSON.stringify(bookingRooms), 3600);

    return bookingRooms;
  }

  async findOne(id: string) {
    const key = `booking-room:${id}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as BookingRoom;
    }

    const bookingRoom = await this.bookingRoomRepository.findOne({
      where: { id },
      relations: ['booking'],
    });

    if (!bookingRoom) {
      throw new NotFoundException(`Booking room ${id} not found`);
    }

    await this.redis.set(key, JSON.stringify(bookingRoom), 3600);

    return bookingRoom;
  }

  async findByBookingId(bookingId: string) {
    const key = `booking-room:booking:${bookingId}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as BookingRoom[];
    }

    const bookingRooms = await this.bookingRoomRepository.find({
      where: {
        bookingId,
      },
    });

    await this.redis.set(key, JSON.stringify(bookingRooms), 3600);

    return bookingRooms;
  }

  async update(id: string, updateBookingRoomDto: UpdateBookingRoomDto) {
    const bookingRoom = await this.findOne(id);

    Object.assign(bookingRoom, updateBookingRoomDto);

    // recalculate subtotal
    bookingRoom.subtotal =
      bookingRoom.quantity *
      Number(bookingRoom.pricePerNight) *
      bookingRoom.numberOfNights;

    const updatedBookingRoom =
      await this.bookingRoomRepository.save(bookingRoom);

    await this.invalidateBookingRoomCache();

    return updatedBookingRoom;
  }

  async remove(id: string) {
    const bookingRoom = await this.findOne(id);

    await this.bookingRoomRepository.remove(bookingRoom);

    await this.invalidateBookingRoomCache();

    return {
      message: 'Booking room deleted successfully',
    };
  }

  private async invalidateBookingRoomCache() {
    await this.redis.delPattern('booking-room:*');
  }
}
