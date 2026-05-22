import { IsOptional, IsString } from 'class-validator';

export class SearchHotelDto {
  @IsOptional()
  @IsString()
  keyword?: string;
}
