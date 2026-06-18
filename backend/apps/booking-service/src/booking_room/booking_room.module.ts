import { Module } from '@nestjs/common';
import { BookingRoomService } from './booking_room.service';
import { BookingRoomController } from './booking_room.controller';
import { BookingRoom } from './entities/booking_room.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([BookingRoom]), RedisModule],
  controllers: [BookingRoomController],
  providers: [BookingRoomService],
})
export class BookingRoomModule {}
