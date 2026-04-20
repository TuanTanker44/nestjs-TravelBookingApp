import { Module } from '@nestjs/common';
import { LocationService } from './location.service';
import { LocationController } from './location.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { DatabaseModule } from '../database/database.module';
import { Location } from './entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Location]), DatabaseModule],
  controllers: [LocationController],
  providers: [LocationService],
  exports: [LocationService],
})
export class LocationModule {}
