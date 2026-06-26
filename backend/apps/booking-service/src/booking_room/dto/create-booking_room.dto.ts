import { IsInt, IsString, IsUUID, Min } from 'class-validator';

export class CreateBookingRoomDto {
  @IsString()
  @IsUUID()
  bookingId!: string;

  @IsString()
  @IsUUID()
  roomId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;

  @IsInt()
  @Min(0)
  pricePerNight!: number;

  @IsInt()
  @Min(1)
  numberOfNights!: number;
}
