import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RoomInventoryController } from './room_inventory.controller';
import { RoomInventoryService } from './room_inventory.service';
import { RoomInventory } from './entities/room_inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RoomInventory])],
  controllers: [RoomInventoryController],
  providers: [RoomInventoryService],
  exports: [RoomInventoryService],
})
export class RoomInventoryModule {}