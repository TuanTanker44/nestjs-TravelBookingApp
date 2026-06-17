import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmentityService } from './amenity.service';
import { AmentityController } from './amenity.controller';
import { Amenity } from './entities/amenity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Amenity])],
  controllers: [AmentityController],
  providers: [AmentityService],
})
export class AmentityModule {}
