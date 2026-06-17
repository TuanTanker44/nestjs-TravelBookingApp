import { Global, Module } from '@nestjs/common';
import { config } from 'dotenv';
import { join } from 'path';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

config({ path: join(process.cwd(), 'apps/user-service/.env') });

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
        });
      },
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}