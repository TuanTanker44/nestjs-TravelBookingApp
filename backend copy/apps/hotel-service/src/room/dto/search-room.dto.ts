import { IsOptional } from 'class-validator/types/decorator/common/IsOptional';
import { RoomStatus } from '../enums/room_status.enum';
import { RoomType } from '../enums/room_type.enum';
import { IsArray, IsDate, IsNumber, IsString } from 'class-validator';

export class SearchRoomDto {
  @IsOptional()
  @IsString()
  hotelId?: string;

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  type?: RoomType;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  priceLevel?: string;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsArray()
  amenities?: string[];

  @IsOptional()
  @IsString()
  status?: RoomStatus;

  @IsOptional()
  @IsDate()
  checkIn?: Date;

  @IsOptional()
  @IsDate()
  checkOut?: Date;

  @IsOptional()
  @IsNumber()
  page: number = 1;

  @IsOptional()
  @IsNumber()
  limit: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';
}
