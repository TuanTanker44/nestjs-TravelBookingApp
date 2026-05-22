import { PartialType } from '@nestjs/swagger';
import { CreateRoomAmentityDto } from './create-room_amentity.dto';

export class UpdateRoomAmentityDto extends PartialType(CreateRoomAmentityDto) {}
