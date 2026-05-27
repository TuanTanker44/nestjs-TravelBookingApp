import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomAmenity } from './entities/room_amentity.entity';
import { RoomAmenityService } from './room_amenity.service';
import { RoomAmenityController } from './room_amenity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoomAmenity])],
  controllers: [RoomAmenityController],
  providers: [RoomAmenityService],
  exports: [RoomAmenityService],
})
export class RoomAmenityModule {}
