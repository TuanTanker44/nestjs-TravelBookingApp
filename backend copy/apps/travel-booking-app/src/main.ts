import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.APPLICATION_PORT ?? 3000);
}
void bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
