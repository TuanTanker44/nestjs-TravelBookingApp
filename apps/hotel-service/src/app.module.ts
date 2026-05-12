import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { join } from 'path';

import { HotelModule } from './hotel/hotel.module';
import { RoomModule } from './room/room.module';

config({ path: join(process.cwd(), 'apps/hotel-service/.env') });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3308', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME ?? 'hotel_db',
      autoLoadEntities: true,
      synchronize: false,
    }),
    HotelModule,
    RoomModule,
  ],
})
export class AppModule {}
