import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.HOTEL_SERVICE_PORT ?? 3001);
  console.log(
    'Hotel service is running on port ' +
      (process.env.HOTEL_SERVICE_PORT ?? 3001),
  );
}
void bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
