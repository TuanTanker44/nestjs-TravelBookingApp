import { NestFactory } from '@nestjs/core';
import { InventoryServiceModule } from './inventory-service.module';

async function bootstrap() {
  const app = await NestFactory.create(InventoryServiceModule);
  await app.listen(process.env.PORT ?? 3002);
}
void bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
