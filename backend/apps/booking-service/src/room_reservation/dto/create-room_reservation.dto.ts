import { IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateRoomReservationDto {
  @IsString()
  @IsUUID()
  bookingId!: string;

  @IsString()
  @IsUUID()
  roomTypeId!: string;

  @IsNumber()
  @Min(1)
  quantity!: number;
}
