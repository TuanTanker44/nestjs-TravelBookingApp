import { PartialType } from '@nestjs/swagger';
import { CreateBookingRoomDto } from './create-booking_room.dto';

export class UpdateBookingRoomDto extends PartialType(CreateBookingRoomDto) {
  quantity?: number;

  pricePerNight?: number;

  numberOfNights?: number;
}
