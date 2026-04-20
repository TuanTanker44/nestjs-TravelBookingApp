import { PartialType } from '@nestjs/swagger';
import { CreateLocationDto } from './create-location.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {
  @IsOptional()
  @IsString()
  status?: 'ACTIVE' | 'INACTIVE';

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
