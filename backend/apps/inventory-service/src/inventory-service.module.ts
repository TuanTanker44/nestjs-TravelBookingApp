import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';

import { DatabaseModule } from '../../../libs/db/database.module';

import configuration from './config/configuration.config';
import { validationSchema } from './config/validation.schema';
import { RoomInventoryModule } from './room_inventory/room_inventory.module';
import { InventoryServiceController } from './inventory-service.controller';
import { InventoryServiceService } from './inventory-service.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: join(process.cwd(), 'apps/inventory-service/.env'),
      load: [configuration],
      validationSchema,
    }),
    DatabaseModule,
    RoomInventoryModule,
  ],
  controllers: [InventoryServiceController],
  providers: [InventoryServiceService],
})
export class InventoryServiceModule {}
