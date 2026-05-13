import { Module } from '@nestjs/common';
import { SearchServiceController } from './search-service.controller';
import { SearchServiceService } from './search-service.service';
import { TypeOrmModule } from '@nestjs/typeorm';

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
  ],
  controllers: [SearchServiceController],
  providers: [SearchServiceService],
})
export class SearchServiceModule {}
