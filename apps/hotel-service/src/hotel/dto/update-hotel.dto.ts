import { PartialType } from '@nestjs/mapped-types';
import { CreateHotelDto } from './create-hotel.dto';
import { IsString } from 'class-validator';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateHotelDto extends PartialType(CreateHotelDto) {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsNumber()
  price_min?: number;

  @IsOptional()
  @IsNumber()
  price_max?: number;
}
