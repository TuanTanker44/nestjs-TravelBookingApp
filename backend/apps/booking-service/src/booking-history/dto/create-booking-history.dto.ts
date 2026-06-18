import { IsString, IsUUID } from 'class-validator';
import { BookingStatus } from '../enums/booking-status.enum';

export class CreateBookingHistoryDto {
  @IsString()
  @IsUUID()
  bookingId!: string;

  @IsString()
  @IsUUID()
  userId!: string;

  @IsString()
  oldStatus?: BookingStatus;

  @IsString()
  newStatus!: BookingStatus;

  @IsString()
  reason?: string;

  @IsString()
  createdBy?: string;

  @IsString()
  metadata?: Record<string, any>;
}
