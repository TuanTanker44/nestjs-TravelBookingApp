import { NestFactory } from '@nestjs/core';
import { BookingServiceModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(BookingServiceModule);
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Booking Service is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
