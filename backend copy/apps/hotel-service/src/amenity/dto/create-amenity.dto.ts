import { IsString } from 'class-validator';

export class CreateAmentityDto {
  @IsString()
  code!: string;

  @IsString()
  name!: string;
}
