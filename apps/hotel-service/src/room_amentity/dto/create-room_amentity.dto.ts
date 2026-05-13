import { IsUUID, IsNotEmpty, IsNumber, Min } from 'class-validator';

export class CreateRoomAmentityDto {
  @IsUUID()
  @IsNotEmpty()
  roomId!: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  amenityId!: number;
}
