import { Module } from '@nestjs/common';
import { join } from 'path';
import { config } from 'dotenv';

import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomInventoryModule } from './room_inventory/room_inventory.module';
import { RedisModule } from './redis/redis.module';

config({ path: join(process.cwd(), 'apps/inventory-service/.env') });

@Module({
  imports: [
    RedisModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3308', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME ?? 'inventory_db',
      autoLoadEntities: true,
      synchronize: false,
    }),
    RoomInventoryModule,
  ],
})
export class InventoryServiceModule {}
