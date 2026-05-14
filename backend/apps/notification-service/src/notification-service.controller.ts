import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { NotificationServiceService } from './notification-service.service';

@Controller()
export class NotificationServiceController {
  constructor(private readonly notificationServiceService: NotificationServiceService) {}

  @Get()
  getHello() {
    return {
      message: 'Notification service is running',
    };
  }

  @Get('notifications')
  listNotifications() {
    return this.notificationServiceService.listNotifications();
  }

  @Get('notifications/:index')
  getNotification(@Param('index') index: string) {
    return this.notificationServiceService.findNotification(Number(index));
  }

  @Post('notifications/booking-confirmation')
  sendBookingConfirmationEmail(
    @Body()
    body: {
      email: string;
      customerName: string;
      bookingId: string;
      hotelName: string;
      checkIn: string;
      checkOut: string;
      invoiceNumber: string;
    },
  ) {
    return this.notificationServiceService.sendBookingConfirmationEmail(body);
  }

  @Post('notifications/booking-failure')
  sendBookingFailureEmail(
    @Body()
    body: {
      email: string;
      customerName: string;
      bookingId: string;
      reason: string;
    },
  ) {
    return this.notificationServiceService.sendBookingFailureEmail(body);
  }

  @Post('notifications/booking-expired')
  sendBookingExpiredEmail(
    @Body()
    body: {
      email: string;
      customerName: string;
      bookingId: string;
    },
  ) {
    return this.notificationServiceService.sendBookingExpiredEmail(body);
  }

  @Post('notifications/payment-receipt')
  sendPaymentReceiptEmail(
    @Body()
    body: {
      email: string;
      customerName: string;
      paymentId: string;
      amount: number;
      currency: string;
    },
  ) {
    return this.notificationServiceService.sendPaymentReceiptEmail(body);
  }
}
