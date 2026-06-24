import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Auth service is running on port ${process.env.PORT ?? 3000}`);
}
bootstrap();
