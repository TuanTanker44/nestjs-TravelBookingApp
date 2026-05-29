import { PartialType } from '@nestjs/swagger';
import { CreateRoomDto } from './create-room.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: 'single' | 'double' | 'group';

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsString()
  status?: 'available' | 'unavailable' | 'maintenance';

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString({ each: true })
  images?: string[];
}
