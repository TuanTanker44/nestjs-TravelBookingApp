import { PartialType } from '@nestjs/swagger';
import { CreateAmentityDto } from './create-amentity.dto';

export class UpdateAmentityDto extends PartialType(CreateAmentityDto) {}
