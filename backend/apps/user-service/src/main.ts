import { NestFactory } from '@nestjs/core';
import { UserServiceModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);
  await app.listen(process.env.PORT ?? 3011);
  console.log(`User Service is running on port ${process.env.PORT ?? 3011}`);
}
bootstrap();
