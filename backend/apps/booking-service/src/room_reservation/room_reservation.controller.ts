import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { RoomReservationService } from './room_reservation.service';

import { CreateRoomReservationDto } from './dto/create-room_reservation.dto';
import { UpdateRoomReservationDto } from './dto/update-room_reservation.dto';

@Controller('room-reservations')
export class RoomReservationController {
  constructor(
    private readonly roomReservationService: RoomReservationService,
  ) {}

  /**
   * Create reservation
   *
   * POST /room-reservations
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body()
    createDto: CreateRoomReservationDto,
  ) {
    return this.roomReservationService.create(createDto);
  }

  /**
   * Get all reservations
   *
   * GET /room-reservations
   */
  @Get()
  findAll() {
    return this.roomReservationService.findAll();
  }

  /**
   * Get reservation by booking
   *
   * GET /room-reservations/booking/:bookingId
   */
  @Get('booking/:bookingId')
  findByBookingId(
    @Param('bookingId')
    bookingId: string,
  ) {
    return this.roomReservationService.findByBookingId(bookingId);
  }

  /**
   * Get one reservation
   *
   * GET /room-reservations/:id
   */
  @Get(':id')
  findOne(
    @Param('id')
    id: string,
  ) {
    return this.roomReservationService.findOne(id);
  }

  /**
   * Confirm reservation
   *
   * Payment success
   *
   * PATCH /room-reservations/:id/confirm
   */
  @Patch(':id/confirm')
  confirm(
    @Param('id')
    id: string,
  ) {
    return this.roomReservationService.confirm(id);
  }

  /**
   * Expire reservation
   *
   * Cron job / cancel payment
   *
   * PATCH /room-reservations/:id/expire
   */
  @Patch(':id/expire')
  expire(
    @Param('id')
    id: string,
  ) {
    return this.roomReservationService.expire(id);
  }

  /**
   * Update reservation
   *
   * PATCH /room-reservations/:id
   */
  @Patch(':id')
  update(
    @Param('id')
    id: string,

    @Body()
    updateDto: UpdateRoomReservationDto,
  ) {
    return this.roomReservationService.update(id, updateDto);
  }

  /**
   * Delete reservation
   *
   * DELETE /room-reservations/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id')
    id: string,
  ) {
    return this.roomReservationService.remove(id);
  }
}
