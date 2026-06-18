import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { RoomReservation } from './entities/room_reservation.entity';
import { CreateRoomReservationDto } from './dto/create-room_reservation.dto';
import { UpdateRoomReservationDto } from './dto/update-room_reservation.dto';

import { ReservationStatus } from './enums/status.enum';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class RoomReservationService {
  constructor(
    @InjectRepository(RoomReservation)
    private reservationRepository: Repository<RoomReservation>,
    private readonly redis: RedisService,
  ) {}

  async create(createDto: CreateRoomReservationDto) {
    const { bookingId, roomTypeId, quantity } = createDto;

    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    // giữ phòng trong 15 phút
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    const reservation = this.reservationRepository.create({
      bookingId,
      roomTypeId,
      quantity,

      status: ReservationStatus.HOLDING,

      expiresAt,
    });

    return await this.reservationRepository.save(reservation);
  }

  async findAll() {
    const key = 'room-reservation:list';

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    const reservations = await this.reservationRepository.find();

    await this.redis.set(key, JSON.stringify(reservations), 3600);

    return reservations;
  }

  async findOne(id: string) {
    const key = `room-reservation:${id}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    const reservation = await this.reservationRepository.findOne({
      where: {
        id,
      },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found');
    }

    await this.redis.set(key, JSON.stringify(reservation), 3600);

    return reservation;
  }

  async findByBookingId(bookingId: string) {
    const key = `room-reservation:booking:${bookingId}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached);
    }

    const reservations = await this.reservationRepository.find({
      where: {
        bookingId,
      },
    });

    await this.redis.set(key, JSON.stringify(reservations), 3600);

    return reservations;
  }

  async confirm(id: string) {
    const reservation = await this.findOne(id);

    if (reservation.status !== ReservationStatus.HOLDING) {
      throw new BadRequestException('Reservation cannot be confirmed');
    }

    reservation.status = ReservationStatus.CONFIRMED;

    return await this.reservationRepository.save(reservation);
  }

  async expire(id: string) {
    const reservation = await this.findOne(id);

    reservation.status = ReservationStatus.EXPIRED;

    return await this.reservationRepository.save(reservation);
  }

  async update(id: string, updateDto: UpdateRoomReservationDto) {
    const reservation = await this.findOne(id);

    Object.assign(reservation, updateDto);

    const updatedReservation =
      await this.reservationRepository.save(reservation);

    await this.invalidateReservationCache();

    return updatedReservation;
  }

  async remove(id: string) {
    const reservation = await this.findOne(id);

    await this.reservationRepository.remove(reservation);

    await this.invalidateReservationCache();

    return {
      message: 'Reservation deleted successfully',
    };
  }

  /**
   * dùng cho cron job
   * tìm các reservation hết hạn
   */
  async expireOverdueReservations() {
    const reservations = await this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.status = :status', {
        status: ReservationStatus.HOLDING,
      })
      .andWhere('reservation.expiresAt < NOW()')
      .getMany();

    for (const reservation of reservations) {
      reservation.status = ReservationStatus.EXPIRED;
    }

    return await this.reservationRepository.save(reservations);
  }

  private async invalidateReservationCache() {
    await this.redis.delPattern('room-reservation:*');
  }
}
