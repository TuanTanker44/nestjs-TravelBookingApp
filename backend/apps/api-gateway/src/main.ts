import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3010',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`API Gateway is running on port ${process.env.PORT ?? 3000}`);
}

void bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
