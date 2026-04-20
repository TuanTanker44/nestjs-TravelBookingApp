import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsNumber, IsUUID } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({ required: true })
  @IsUUID()
  hotel_id!: string;

  @ApiProperty({ required: true })
  @IsNumber()
  latitude!: number;

  @ApiProperty({ required: true })
  @IsNumber()
  longitude!: number;
}
