import { NestFactory } from '@nestjs/core';
import { InventoryServiceModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(InventoryServiceModule);
  await app.listen(process.env.PORT ?? 3005);
  console.log(
    `Inventory Service is running on port ${process.env.PORT ?? 3005}`,
  );
}
void bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
