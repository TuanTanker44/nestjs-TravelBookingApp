import { IsEmail, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateHotelDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsEmail()
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

  @ApiProperty({ required: true })
  @IsNumber()
  latitude!: number;

  @ApiProperty({ required: true })
  @IsNumber()
  longitude!: number;

  @ApiProperty({ required: false })
  @IsNumber()
  price_min?: number;

  @ApiProperty({ required: false })
  @IsNumber()
  price_max?: number;
}
