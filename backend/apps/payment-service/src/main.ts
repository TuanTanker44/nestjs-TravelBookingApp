import { NestFactory } from '@nestjs/core';
import { PaymentServiceModule } from './payment-service.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentServiceModule);
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Payment service is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
