import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { DatabaseModule } from '../../../../lib/database/database.module';
import { Hotel } from './entities/hotel.entity';
import { LocationModule } from '../location/location.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel]), DatabaseModule, LocationModule],
  controllers: [HotelController],
  providers: [HotelService],
  exports: [HotelService],
})
export class HotelModule {}
