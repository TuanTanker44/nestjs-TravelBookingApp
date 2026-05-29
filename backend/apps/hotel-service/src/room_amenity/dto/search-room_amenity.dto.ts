import { IsOptional, IsArray, IsString } from 'class-validator';

export class SearchRoomAmenityDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  amenity_codes?: string[];
}
