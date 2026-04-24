import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HotelModule } from './hotel/hotel.module';
import { DatabaseModule } from './database/database.module';
import { LocationModule } from './location/location.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    HotelModule,
    LocationModule,
    RoomModule,
  ],
})
export class AppModule {}
