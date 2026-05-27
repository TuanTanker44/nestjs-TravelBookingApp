import { PartialType } from '@nestjs/swagger';
import { CreateRoomAmenityDto } from './create-room_amenity.dto';

export class UpdateRoomAmenityDto extends PartialType(CreateRoomAmenityDto) {}
