import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { Room } from './entities/room.entity';
import { HotelModule } from '../hotel/hotel.module';
import { RoomAmenityModule } from '../room_amenity/room_amenity.module';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), HotelModule, RoomAmenityModule],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
