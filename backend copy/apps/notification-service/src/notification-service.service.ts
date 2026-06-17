import { Injectable, NotFoundException } from '@nestjs/common';

export type NotificationType =
  | 'BOOKING_CONFIRMATION'
  | 'BOOKING_FAILURE'
  | 'BOOKING_EXPIRED'
  | 'PAYMENT_RECEIPT';

export interface NotificationPayload {
  email: string;
  subject: string;
  message: string;
  type: NotificationType;
  sentAt: string;
}

@Injectable()
export class NotificationServiceService {
  private readonly notifications: NotificationPayload[] = [];

  sendEmail(payload: Omit<NotificationPayload, 'sentAt'>): NotificationPayload {
    const notification: NotificationPayload = {
      ...payload,
      sentAt: new Date().toISOString(),
    };

    this.notifications.push(notification);

    return notification;
  }

  sendBookingConfirmationEmail(input: {
    email: string;
    customerName: string;
    bookingId: string;
    hotelName: string;
    checkIn: string;
    checkOut: string;
    invoiceNumber: string;
  }): NotificationPayload {
    return this.sendEmail({
      email: input.email,
      type: 'BOOKING_CONFIRMATION',
      subject: `Booking confirmed: ${input.bookingId}`,
      message: [
        `Hello ${input.customerName},`,
        `Your booking at ${input.hotelName} is confirmed.`,
        `Check-in: ${input.checkIn}`,
        `Check-out: ${input.checkOut}`,
        `Invoice: ${input.invoiceNumber}`,
      ].join(' '),
    });
  }

  sendBookingFailureEmail(input: {
    email: string;
    customerName: string;
    bookingId: string;
    reason: string;
  }): NotificationPayload {
    return this.sendEmail({
      email: input.email,
      type: 'BOOKING_FAILURE',
      subject: `Payment failed for booking ${input.bookingId}`,
      message: `Hello ${input.customerName}, your booking payment failed. Reason: ${input.reason}`,
    });
  }

  sendBookingExpiredEmail(input: {
    email: string;
    customerName: string;
    bookingId: string;
  }): NotificationPayload {
    return this.sendEmail({
      email: input.email,
      type: 'BOOKING_EXPIRED',
      subject: `Booking expired: ${input.bookingId}`,
      message: `Hello ${input.customerName}, your booking ${input.bookingId} has expired because payment was not completed in time.`,
    });
  }

  sendPaymentReceiptEmail(input: {
    email: string;
    customerName: string;
    paymentId: string;
    amount: number;
    currency: string;
  }): NotificationPayload {
    return this.sendEmail({
      email: input.email,
      type: 'PAYMENT_RECEIPT',
      subject: `Payment receipt ${input.paymentId}`,
      message: `Hello ${input.customerName}, your payment of ${input.amount} ${input.currency} was successful.`,
    });
  }

  listNotifications(): NotificationPayload[] {
    return [...this.notifications];
  }

  findNotification(index: number): NotificationPayload {
    const notification = this.notifications[index];

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return notification;
  }
}
