import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

import { Type } from 'class-transformer';

export function ToNumber(): PropertyDecorator {
  return Type(() => Number);
}

export class SearchHotelDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  @Min(0)
  @Max(5)
  minRating?: number;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  minReviewCount?: number;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @ToNumber()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  sortBy?: 'price' | 'rating';

  @IsOptional()
  @IsString()
  order?: 'ASC' | 'DESC';

  page?: number;
  limit?: number;
}
