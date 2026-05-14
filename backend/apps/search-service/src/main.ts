import { NestFactory } from '@nestjs/core';
import { SearchServiceModule } from './search-service.module';

async function bootstrap() {
  const app = await NestFactory.create(SearchServiceModule);
  await app.listen(process.env.PORT ?? 3005);
  console.log(
    'Search service is running on port ' + (process.env.PORT ?? 3005),
  );
}
void bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
