import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomAmentityService } from './room_amentity.service';
import { CreateRoomAmentityDto } from './dto/create-room_amentity.dto';
import { UpdateRoomAmentityDto } from './dto/update-room_amentity.dto';
import { RoomAmenity } from './entities/room_amentity.entity';

@Controller('room-amentity')
export class RoomAmentityController {
  constructor(private readonly roomAmentityService: RoomAmentityService) {}

  @Post()
  create(
    @Body() createRoomAmentityDto: CreateRoomAmentityDto,
  ): Promise<RoomAmenity> {
    return this.roomAmentityService.create(createRoomAmentityDto);
  }

  @Get()
  findAll(): Promise<RoomAmenity[]> {
    return this.roomAmentityService.findAll();
  }

  @Get('by-room/:roomId')
  findByRoomId(@Param('roomId') roomId: string): Promise<RoomAmenity[]> {
    return this.roomAmentityService.findByRoomId(roomId);
  }

  @Get('by-amenity/:amenityId')
  findByAmenityId(
    @Param('amenityId') amenityId: string,
  ): Promise<RoomAmenity[]> {
    return this.roomAmentityService.findByAmenityId(+amenityId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<RoomAmenity> {
    return this.roomAmentityService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomAmentityDto: UpdateRoomAmentityDto,
  ): Promise<RoomAmenity> {
    return this.roomAmentityService.update(id, updateRoomAmentityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.roomAmentityService.remove(id);
  }
}
