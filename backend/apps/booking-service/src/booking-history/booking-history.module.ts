import { Module } from '@nestjs/common';
import { BookingHistoryService } from './booking-history.service';
import { BookingHistoryController } from './booking-history.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingHistory } from './entities/booking-history.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([BookingHistory]), RedisModule],
  controllers: [BookingHistoryController],
  providers: [BookingHistoryService],
})
export class BookingHistoryModule {}
