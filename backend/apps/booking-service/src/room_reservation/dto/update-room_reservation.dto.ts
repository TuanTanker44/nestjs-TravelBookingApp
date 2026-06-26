import { PartialType } from '@nestjs/swagger';
import { CreateRoomReservationDto } from './create-room_reservation.dto';
import { ReservationStatus } from '../enums/status.enum';

export class UpdateRoomReservationDto extends PartialType(
  CreateRoomReservationDto,
) {
  status?: ReservationStatus;

  quantity?: number;
}
