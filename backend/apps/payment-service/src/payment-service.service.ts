import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Payment } from './entities/payment.entity';

import { CreatePaymentDto } from './dto/create-payment.dto';

import { UpdatePaymentDto } from './dto/update-payment.dto';

import { PaymentStatus } from './enums/status.enum';

import { RedisService } from './redis/redis.service';

@Injectable()
export class PaymentServiceService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    private readonly redis: RedisService,
  ) {}

  /**
   * tạo payment
   *
   * booking-service gọi
   */
  async create(createDto: CreatePaymentDto) {
    const { bookingId, userId, amount, currency, provider } = createDto;

    if (amount <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }

    const payment = this.paymentRepository.create({
      bookingId,

      userId,

      amount,

      currency,

      provider,

      status: PaymentStatus.PENDING,
    });

    const createdPayment = await this.paymentRepository.save(payment);

    await this.invalidatePaymentCache();

    return createdPayment;
  }

  /**
   * lấy tất cả payment
   */
  async findAll() {
    const key = 'payment:list';

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Payment[];
    }

    const payments = await this.paymentRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });

    await this.redis.set(key, JSON.stringify(payments), 3600);

    return payments;
  }

  /**
   * lấy payment detail
   */
  async findOne(id: string): Promise<Payment> {
    const key = `payment:${id}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Payment;
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

  async getPayment(id: string) {
    return this.findOne(id);
  }

  /**
   * lấy payment theo booking
   */
  async findByBookingId(bookingId: string) {
    const key = `payment:booking:${bookingId}`;

    const cached = await this.redis.get(key);

    if (cached) {
      return JSON.parse(cached) as Payment[];
    }

    const payments = await this.paymentRepository.find({
      where: {
        bookingId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    await this.redis.set(key, JSON.stringify(payments), 3600);

    return payments;
  }

  /**
   * bắt đầu thanh toán
   *
   * PENDING -> PROCESSING
   */
  async process(id: string) {
    const payment = await this.findOne(id);

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment cannot be processed');
    }

    payment.status = PaymentStatus.PROCESSING;

    const updatedPayment = await this.paymentRepository.save(payment);

    await this.invalidatePaymentCache();

    return updatedPayment;
  }

  /**
   * mock payment success
   *
   * hoặc dùng cho webhook
   *
   * PROCESSING -> SUCCESS
   */
  async confirm(
    id: string,
    transactionId?: string,
    metadata?: Record<string, unknown>,
  ): Promise<Payment> {
    const payment = await this.findOne(id);

    if (payment.status !== PaymentStatus.PROCESSING) {
      throw new BadRequestException('Invalid payment status');
    }

    payment.status = PaymentStatus.SUCCESS;

    payment.transactionId = transactionId;

    payment.metadata = metadata;

    payment.paidAt = new Date();

    const updatedPayment = await this.paymentRepository.save(payment);

    await this.invalidatePaymentCache();

    return updatedPayment;
  }

  /**
   * payment failed
   */
  async fail(id: string, reason?: string) {
    const payment = await this.findOne(id);

    if (payment.status === PaymentStatus.SUCCESS) {
      throw new BadRequestException('Cannot fail successful payment');
    }

    payment.status = PaymentStatus.FAILED;

    payment.metadata = {
      reason,
    };

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
      throw new BadRequestException('Cannot cancel paid payment');
    }

    payment.status = PaymentStatus.CANCELLED;

    const updatedPayment = await this.paymentRepository.save(payment);

    await this.invalidatePaymentCache();

    return updatedPayment;
  }

  /**
   * refund
   *
   * SUCCESS -> REFUNDED
   */
  async refund(id: string, reason?: string) {
    const payment = await this.findOne(id);

    if (payment.status !== PaymentStatus.SUCCESS) {
      throw new BadRequestException('Only successful payment can refund');
    }

    payment.status = PaymentStatus.REFUNDED;

    payment.metadata = {
      reason,
    };

    const updatedPayment = await this.paymentRepository.save(payment);

    await this.invalidatePaymentCache();

    return updatedPayment;
  }

  /**
   * update metadata/url
   */
  async update(id: string, dto: UpdatePaymentDto) {
    const payment = await this.findOne(id);

    Object.assign(payment, dto);

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
