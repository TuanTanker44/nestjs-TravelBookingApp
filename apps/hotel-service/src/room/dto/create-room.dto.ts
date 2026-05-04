import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @IsUUID()
  hotelId!: string;

  @IsString()
  name?: string;

  @IsString()
  type!: 'single' | 'double' | 'group';

  @IsNumber()
  price!: number;

  @IsNumber()
  capacity!: number;

  @IsString()
  status!: 'available' | 'unavailable' | 'maintenance';

  @IsString()
  description?: string;
}
