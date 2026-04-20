import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { DatabaseModule } from '../database/database.module';
import { Hotel } from './entities/hotel.entity';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel]), DatabaseModule, LocationModule],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
