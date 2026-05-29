import { IsDate, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateRoomInventoryDto {
  @IsString()
  @IsUUID()
  roomId!: string;

  @IsDate()
  startDate!: Date;

  @IsDate()
  endDate!: Date;

  @IsNumber()
  totalStock!: number;
}