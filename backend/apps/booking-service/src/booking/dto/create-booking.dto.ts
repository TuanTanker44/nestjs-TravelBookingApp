import {
  IsDateString,
  IsString,
  IsUUID,
  ValidateNested,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingRoom } from '../../booking_room/entities/booking_room.entity';

export class CreateBookingDto {
  @IsString()
  @IsUUID()
  userId!: string;

  @ValidateNested({ each: true })
  @Type(() => BookingRoom)
  bookingRooms!: BookingRoom[];

  @IsDateString()
  checkInDate!: string;

  @IsDateString()
  checkOutDate!: string;

  @IsNumber()
  totalAmount!: number;
}
