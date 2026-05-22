import { PartialType } from '@nestjs/swagger';
import { CreateAmentityDto } from './create-amenity.dto';

export class UpdateAmentityDto extends PartialType(CreateAmentityDto) {}
