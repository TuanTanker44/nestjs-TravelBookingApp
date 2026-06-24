import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaymentIntegration } from './entities/payment-integration.entity';

import { CreatePaymentIntegrationDto } from './dto/create-payment-integration.dto';
import { UpdatePaymentIntegrationDto } from './dto/update-payment-integration.dto';

import { PaymentStatus } from './enums/payment-status.enum';

import { RedisService } from '../redis/redis.service';

@Injectable()
export class PaymentIntegrationService {
  constructor(
    @InjectRepository(PaymentIntegration)
    private paymentRepository: Repository<PaymentIntegration>,
    private readonly redis: RedisService,
  ) {}

  /**
   * tạo payment session
   */
  async create(createDto: CreatePaymentIntegrationDto) {
    const { bookingId, provider, amount, currency } = createDto;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const payment = this.paymentRepository.create({
      bookingId,

      provider,

      amount,

      currency,

      status: PaymentStatus.PENDING,
    });

    return await this.paymentRepository.save(payment);
  }

  /**
   * lấy tất cả payment
   */
  async findAll() {
    const key = 'payment:list';

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as PaymentIntegration[];
    }

    const payments = await this.paymentRepository.find();

    await this.redis.set(key, JSON.stringify(payments), 3600);

    return payments;
  }

  /**
   * lấy payment detail
   */
  async findOne(id: string) {
    const key = `payment:${id}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as PaymentIntegration;
    }

    const payment = await this.paymentRepository.findOne({
      where: {
        id,
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    await this.redis.set(key, JSON.stringify(payment), 3600);

    return payment;
  }

  /**
   * payment theo booking
   */
  async findByBookingId(bookingId: string) {
    const key = `payment:booking:${bookingId}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as PaymentIntegration[];
    }

    const payments = await this.paymentRepository.find({
      where: {
        bookingId,
      },
    });

    await this.redis.set(key, JSON.stringify(payments), 3600);

    return payments;
  }

  /**
   * update callback từ gateway
   *
   * Stripe/VNPay gọi API này
   */
  async handleCallback(
    transactionId: string,
    status: PaymentStatus,
    gatewayResponse?: Record<string, any>,
  ) {
    const payment = await this.paymentRepository.findOne({
      where: {
        transactionId,
      },
    });

    if (!payment) {
      throw new NotFoundException('Transaction not found');
    }

    if (payment.status === PaymentStatus.SUCCESS) {
      throw new BadRequestException('Payment already completed');
    }

    payment.status = status;

    payment.gatewayResponse = gatewayResponse;

    if (status === PaymentStatus.SUCCESS) {
      payment.paidAt = new Date();
    }

    return await this.paymentRepository.save(payment);
  }

  /**
   * attach transaction id
   * sau khi gọi gateway
   */
  async updateTransaction(
    id: string,
    UpdatePaymentIntegrationDto: UpdatePaymentIntegrationDto,
  ) {
    const payment = await this.findOne(id);

    payment.transactionId = UpdatePaymentIntegrationDto.transactionId;

    payment.paymentUrl = UpdatePaymentIntegrationDto.paymentUrl;

    payment.status = PaymentStatus.PROCESSING;

    const updatedPayment = await this.paymentRepository.save(payment);

    await this.invalidatePaymentCache();

    return updatedPayment;
  }

  /**
   * cancel payment
   */
  async cancel(id: string) {
    const payment = await this.findOne(id);

    if (payment.status === PaymentStatus.SUCCESS) {
      throw new BadRequestException('Cannot cancel successful payment');
    }

    payment.status = PaymentStatus.CANCELLED;

    const updatedPayment = await this.paymentRepository.save(payment);

    await this.invalidatePaymentCache();

    return updatedPayment;
  }

  /**
   * refund
   */
  async refund(id: string) {
    const payment = await this.findOne(id);

    if (payment.status !== PaymentStatus.SUCCESS) {
      throw new BadRequestException('Only successful payment can be refunded');
    }

    payment.status = PaymentStatus.REFUNDED;

    const updatedPayment = await this.paymentRepository.save(payment);

    await this.invalidatePaymentCache();

    return updatedPayment;
  }

  async remove(id: string) {
    const payment = await this.findOne(id);

    await this.paymentRepository.remove(payment);

    await this.invalidatePaymentCache();

    return {
      message: 'Payment deleted successfully',
    };
  }

  private async invalidatePaymentCache() {
    await this.redis.delPattern('payment:*');
  }
}
