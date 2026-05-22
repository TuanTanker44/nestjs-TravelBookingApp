import { IsOptional, IsString } from 'class-validator';

export class SearchRoomDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  amenities?: string;
}
