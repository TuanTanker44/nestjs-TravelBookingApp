import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  async get(key: string) {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttl?: number) {
    if (ttl) {
      return this.redis.set(key, value, 'EX', ttl);
    }

    return this.redis.set(key, value);
  }

  async del(key: string) {
    return this.redis.del(key);
  }

  async delPattern(pattern: string) {
    let cursor = '0';
    const keys: string[] = [];

    do {
      const [nextCursor, matchedKeys] = await this.redis.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100,
      );

      cursor = nextCursor;
      keys.push(...matchedKeys);
    } while (cursor !== '0');

    if (!keys.length) {
      return 0;
    }

    return this.redis.del(...keys);
  }
}