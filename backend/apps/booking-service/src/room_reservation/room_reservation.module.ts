import { Module } from '@nestjs/common';
import { RoomReservationService } from './room_reservation.service';
import { RoomReservationController } from './room_reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomReservation } from './entities/room_reservation.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([RoomReservation]), RedisModule],
  controllers: [RoomReservationController],
  providers: [RoomReservationService],
})
export class RoomReservationModule {}
