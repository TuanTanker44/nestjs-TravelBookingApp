import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { BookingHistoryService } from './booking-history.service';

import { CreateBookingHistoryDto } from './dto/create-booking-history.dto';

@Controller('booking-history')
export class BookingHistoryController {
  constructor(private readonly bookingHistoryService: BookingHistoryService) {}

  /**
   * Create history record
   *
   * POST /booking-history
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body()
    createDto: CreateBookingHistoryDto,
  ) {
    return this.bookingHistoryService.create(createDto);
  }

  /**
   * Get all history
   *
   * GET /booking-history
   */
  @Get()
  findAll() {
    return this.bookingHistoryService.findAll();
  }

  /**
   * Get booking timeline
   *
   * GET /booking-history/booking/:bookingId
   */
  @Get('booking/:bookingId')
  findByBookingId(
    @Param('bookingId')
    bookingId: string,
  ) {
    return this.bookingHistoryService.findByBookingId(bookingId);
  }

  /**
   * Get user booking history
   *
   * GET /booking-history/user/:userId
   */
  @Get('user/:userId')
  findByUserId(
    @Param('userId')
    userId: string,
  ) {
    return this.bookingHistoryService.findByUserId(userId);
  }

  /**
   * Get latest booking status
   *
   * GET /booking-history/booking/:bookingId/latest
   *
   */
  @Get('booking/:bookingId/latest')
  getLatestStatus(
    @Param('bookingId')
    bookingId: string,
  ) {
    return this.bookingHistoryService.getLatestStatus(bookingId);
  }

  /**
   * Delete history
   *
   * DELETE /booking-history/:id
   *
   * Only admin/system
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id')
    id: string,
  ) {
    return this.bookingHistoryService.remove(id);
  }
}
