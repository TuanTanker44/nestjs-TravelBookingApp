import { Module } from '@nestjs/common';
import { SearchServiceController } from './search-service.controller';
import { SearchServiceService } from './search-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';
import { config } from 'dotenv';
import { RedisModule } from './redis/redis.module';

config({ path: join(process.cwd(), 'apps/search-service/.env') });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '3308', 10),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME ?? 'search_db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    HttpModule,
    RedisModule,
  ],
  controllers: [SearchServiceController],
  providers: [SearchServiceService],
})
export class SearchServiceModule {}
