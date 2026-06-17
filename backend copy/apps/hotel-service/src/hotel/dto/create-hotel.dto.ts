import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHotelDto {
  @ApiProperty({ required: true })
  @IsString()
  name!: string;

  @ApiProperty({ required: false })
  @IsString()
  description?: string;

  @ApiProperty({ required: true })
  @IsString()
  address!: string;

  @ApiProperty({ required: true })
  @IsString()
  city!: string;

  @ApiProperty({ required: true })
  @IsString()
  country!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price_min?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price_max?: number;
}
