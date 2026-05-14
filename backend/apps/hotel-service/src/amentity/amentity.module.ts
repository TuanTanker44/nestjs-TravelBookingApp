import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmentityService } from './amentity.service';
import { AmentityController } from './amentity.controller';
import { Amenity } from './entities/amentity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Amenity])],
  controllers: [AmentityController],
  providers: [AmentityService],
})
export class AmentityModule {}
