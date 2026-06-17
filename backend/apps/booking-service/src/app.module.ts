import { Module } from '@nestjs/common';
import { RoomReservationModule } from './room_reservation/room_reservation.module';
import { PaymentIntegrationModule } from './payment-integration/payment-integration.module';
import { BookingRoomModule } from './booking_room/booking_room.module';
import { BookingModule } from './booking/booking.module';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { join } from 'path';
import { config } from 'dotenv';

config({ path: join(process.cwd(), 'apps/booking-service/.env') });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3308', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME ?? 'booking_db',
      autoLoadEntities: true,
      synchronize: false,
    }),
    RoomReservationModule,
    BookingModule,
    BookingRoomModule,
    PaymentIntegrationModule,
  ],
})
export class BookingServiceModule {}
