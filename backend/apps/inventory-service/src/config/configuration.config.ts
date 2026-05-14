import appConfig from './app.config';
import databaseConfig from './database.config';
import redisConfig from './redis.config';
import rabbitmqConfig from './rabbitmq.config';
import cacheConfig from './cache.config';
import monitoringConfig from './monitoring.config';

export default () => ({
  ...appConfig(),
  ...databaseConfig(),
  ...redisConfig(),
  ...rabbitmqConfig(),
  ...cacheConfig(),
  ...monitoringConfig(),
});
