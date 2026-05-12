import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

export type BookingStatus =
  | 'CREATED'
  | 'PENDING_PAYMENT'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'PAYMENT_FAILED'
  | 'EXPIRED';

export interface BookingCustomer {
  fullName: string;
  email: string;
  phoneNumber: string;
  nationalId: string;
}

export interface BookingRoomSelection {
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomType: string;
  amenities: string[];
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
}

export interface TemporaryBookingInput {
  searchSessionId: string;
  room: BookingRoomSelection;
  customer: BookingCustomer;
}

export interface BookingRecord extends TemporaryBookingInput {
  id: string;
  status: BookingStatus;
  inventoryReserved: boolean;
  paymentSessionId?: string;
  invoiceNumber?: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  confirmedAt?: string;
  cancelledAt?: string;
  failureReason?: string;
}

export interface BookingEventResult {
  booking: BookingRecord;
  message: string;
}

let bookingSequence = 0;

const createBookingId = () => `booking-${++bookingSequence}`;

@Injectable()
export class BookingServiceService {
  private readonly bookings = new Map<string, BookingRecord>();

  createTemporaryBooking(input: TemporaryBookingInput): BookingRecord {
    const checkIn = new Date(input.room.checkIn);
    const checkOut = new Date(input.room.checkOut);

    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      throw new BadRequestException('checkIn and checkOut must be valid dates');
    }

    if (checkIn >= checkOut) {
      throw new BadRequestException('checkOut must be after checkIn');
    }

    const now = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    const booking: BookingRecord = {
      id: createBookingId(),
      ...input,
      status: 'PENDING_PAYMENT',
      inventoryReserved: true,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    this.bookings.set(booking.id, booking);

    return booking;
  }

  getBooking(id: string): BookingRecord {
    const booking = this.bookings.get(id);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  listBookings(customerEmail?: string): BookingRecord[] {
    return [...this.bookings.values()].filter((booking) => {
      if (!customerEmail) {
        return true;
      }

      return booking.customer.email === customerEmail;
    });
  }

  attachPaymentSession(
    bookingId: string,
    paymentSessionId: string,
  ): BookingRecord {
    const booking = this.getBooking(bookingId);

    booking.paymentSessionId = paymentSessionId;
    booking.updatedAt = new Date().toISOString();

    return booking;
  }

  confirmBooking(
    bookingId: string,
    invoiceNumber?: string,
  ): BookingEventResult {
    const booking = this.getBooking(bookingId);

    booking.status = 'CONFIRMED';
    booking.inventoryReserved = false;
    booking.invoiceNumber = invoiceNumber ?? `INV-${booking.id.toUpperCase()}`;
    booking.confirmedAt = new Date().toISOString();
    booking.updatedAt = booking.confirmedAt;

    return {
      booking,
      message: 'Booking confirmed and invoice generated',
    };
  }

  failPayment(bookingId: string, failureReason: string): BookingEventResult {
    const booking = this.getBooking(bookingId);

    booking.status = 'PAYMENT_FAILED';
    booking.inventoryReserved = false;
    booking.failureReason = failureReason;
    booking.updatedAt = new Date().toISOString();

    return {
      booking,
      message: 'Payment failed and inventory released',
    };
  }

  cancelBooking(bookingId: string, reason: string): BookingEventResult {
    const booking = this.getBooking(bookingId);

    booking.status = 'CANCELLED';
    booking.inventoryReserved = false;
    booking.failureReason = reason;
    booking.cancelledAt = new Date().toISOString();
    booking.updatedAt = booking.cancelledAt;

    return {
      booking,
      message: 'Booking cancelled and inventory released',
    };
  }

  expirePendingBooking(bookingId: string): BookingEventResult {
    const booking = this.getBooking(bookingId);

    if (booking.status !== 'PENDING_PAYMENT') {
      throw new BadRequestException('Only pending bookings can expire');
    }

    booking.status = 'EXPIRED';
    booking.inventoryReserved = false;
    booking.updatedAt = new Date().toISOString();

    return {
      booking,
      message: 'Booking expired and inventory released',
    };
  }
}
