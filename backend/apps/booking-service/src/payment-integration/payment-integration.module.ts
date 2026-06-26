import { Module } from '@nestjs/common';
import { PaymentIntegrationService } from './payment-integration.service';
import { PaymentIntegrationController } from './payment-integration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentIntegration } from './entities/payment-integration.entity';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentIntegration]), RedisModule],
  controllers: [PaymentIntegrationController],
  providers: [PaymentIntegrationService],
})
export class PaymentIntegrationModule {}
