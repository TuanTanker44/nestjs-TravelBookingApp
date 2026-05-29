import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoomAmenityService } from './room_amenity.service';
import { CreateRoomAmenityDto } from './dto/create-room_amenity.dto';
import { UpdateRoomAmenityDto } from './dto/update-room_amenity.dto';
import { RoomAmenity } from './entities/room_amentity.entity';
import { SearchRoomAmenityDto } from './dto/search-room_amenity.dto';

@Controller('room-amenity')
export class RoomAmenityController {
  constructor(private readonly roomAmenityService: RoomAmenityService) {}

  @Post()
  create(
    @Body() createRoomAmenityDto: CreateRoomAmenityDto,
  ): Promise<RoomAmenity> {
    return this.roomAmenityService.create(createRoomAmenityDto);
  }

  @Get()
  findAll(): Promise<RoomAmenity[]> {
    return this.roomAmenityService.findAll();
  }

  @Get('room/')
  findByAmenity(@Query() dto: SearchRoomAmenityDto): Promise<RoomAmenity[]> {
    const amenityCodes: string[] = dto.amenity_codes ?? [];
    return this.roomAmenityService.searchRoomAmenities(amenityCodes);
  }
  @Get('room/:roomId')
  findByRoomId(@Param('roomId') roomId: string): Promise<RoomAmenity[]> {
    return this.roomAmenityService.findByRoomId(roomId);
  }

  @Get('amenity/:amenityId')
  findByAmenityId(
    @Param('amenityId') amenityId: string,
  ): Promise<RoomAmenity[]> {
    return this.roomAmenityService.findByAmenityId(+amenityId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<RoomAmenity> {
    return this.roomAmenityService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRoomAmenityDto: UpdateRoomAmenityDto,
  ): Promise<RoomAmenity> {
    return this.roomAmenityService.update(id, updateRoomAmenityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.roomAmenityService.remove(id);
  }
}
