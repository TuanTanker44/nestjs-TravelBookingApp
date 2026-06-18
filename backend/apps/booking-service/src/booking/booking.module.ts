import { Module } from '@nestjs/common';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { Booking } from './entities/booking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Booking]),
    RedisModule,
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
