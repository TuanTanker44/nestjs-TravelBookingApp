import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingStatus } from './enums/status.enum';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingPaymentStatus } from './enums/payment-status.enum';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @Post()
  async createBooking(@Body() dto: CreateBookingDto) {
    return this.bookingService.createBooking(dto);
  }

  @Patch(':id/status')
  async changeBookingStatus(
    @Param('id') id: string,
    @Body('status') status: BookingStatus,
  ) {
    return this.bookingService.changeBookingStatus(id, status);
  }

  @Patch(':id/payment-status')
  async changePaymentStatus(
    @Param('id') id: string,
    @Body('paymentStatus') paymentStatus: BookingPaymentStatus,
  ) {
    return this.bookingService.changePaymentStatus(id, paymentStatus);
  }

  @Post(':id/confirm')
  async confirmBooking(@Param('id') id: string) {
    return this.bookingService.confirmBooking(id);
  }

  @Post(':id/cancel')
  async cancelBooking(@Param('id') id: string) {
    return this.bookingService.cancelBooking(id);
  }

  @Post(':id/expire')
  async expireBooking(@Param('id') id: string) {
    return this.bookingService.expireBooking(id);
  }

  @Get(':id')
  async getBooking(@Param('id') id: string) {
    return this.bookingService.getBookingById(id);
  }

  @Patch(':id')
  async updateBooking(@Param('id') id: string, @Body() dto: CreateBookingDto) {
    return this.bookingService.updateBooking(id, dto);
  }

  @Delete(':id')
  async deleteBooking(@Param('id') id: string) {
    return this.bookingService.deleteBooking(id);
  }

  @Post(':id/check-in')
  async checkIn(@Param('id') id: string) {
    return this.bookingService.checkIn(id);
  }

  @Post(':id/check-out-pending')
  async checkOutPending(@Param('id') id: string) {
    return this.bookingService.checkOutPending(id);
  }

  @Post(':id/check-out')
  async checkOut(@Param('id') id: string) {
    return this.bookingService.checkOut(id);
  }
}
