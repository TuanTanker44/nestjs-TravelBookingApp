import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

import { Type } from 'class-transformer';

export function ToNumber(): PropertyDecorator {
  return Type(() => Number);
}

export class QuickSearchDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumber()
  @ToNumber()
  @Min(1)
  @Max(100)
  page?: number = 1;

  @IsOptional()
  @IsNumber()
  @ToNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
