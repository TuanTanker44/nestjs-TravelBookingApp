import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomAmenity } from './entities/room_amentity.entity';
import { RoomAmentityService } from './room_amenity.service';
import { RoomAmentityController } from './room_amenity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RoomAmenity])],
  controllers: [RoomAmentityController],
  providers: [RoomAmentityService],
  exports: [RoomAmentityService],
})
export class RoomAmentityModule {}
