import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { RoomSortField, SortOrder } from '../enums/sort.enum';
import { RoomType } from '../enums/room-type.enum';

export class SearchAvailableRoomDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsString()
  city!: string;

  @IsString()
  checkIn!: string;

  @IsString()
  checkOut!: string;

  @IsNumber()
  adults!: number;

  @IsOptional()
  @IsNumber()
  children?: number;

  @IsOptional()
  rooms?: number;

  @IsOptional()
  roomType?: RoomType;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  minRating?: number;

  @IsOptional()
  @IsArray()
  facilities?: string[];

  sortBy?: RoomSortField;

  order?: SortOrder;

  page: number = 1;

  limit: number = 20;
}
