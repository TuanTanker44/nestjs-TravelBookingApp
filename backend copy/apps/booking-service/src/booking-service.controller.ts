import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import * as bookingServiceService from './booking-service.service';
import { BookingServiceService } from './booking-service.service';

@Controller()
export class BookingServiceController {
  constructor(private readonly bookingServiceService: BookingServiceService) {}

  @Get()
  getHello() {
    return {
      message: 'Booking service is running',
    };
  }

  @Post('bookings/temporary')
  createTemporaryBooking(
    @Body() body: bookingServiceService.TemporaryBookingInput,
  ) {
    return this.bookingServiceService.createTemporaryBooking(body);
  }

  @Get('bookings/:id')
  getBooking(@Param('id') id: string) {
    return this.bookingServiceService.getBooking(id);
  }

  @Get('bookings')
  listBookings(@Query('customerEmail') customerEmail?: string) {
    return this.bookingServiceService.listBookings(customerEmail);
  }

  @Post('bookings/:id/confirm')
  confirmBooking(
    @Param('id') id: string,
    @Body() body: { invoiceNumber?: string },
  ) {
    return this.bookingServiceService.confirmBooking(id, body.invoiceNumber);
  }

  @Post('bookings/:id/payment-failed')
  failPayment(
    @Param('id') id: string,
    @Body() body: { failureReason: string },
  ) {
    return this.bookingServiceService.failPayment(id, body.failureReason);
  }

  @Post('bookings/:id/cancel')
  cancelBooking(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.bookingServiceService.cancelBooking(id, body.reason);
  }
}
