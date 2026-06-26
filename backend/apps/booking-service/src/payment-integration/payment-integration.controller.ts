import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';

import { PaymentIntegrationService } from './payment-integration.service';

import { CreatePaymentIntegrationDto } from './dto/create-payment-integration.dto';
import { UpdatePaymentIntegrationDto } from './dto/update-payment-integration.dto';

import { PaymentStatus } from './enums/payment-status.enum';

@Controller('payments')
export class PaymentIntegrationController {
  constructor(private readonly paymentService: PaymentIntegrationService) {}

  /**
   * Create payment request
   *
   * POST /payments
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body()
    createDto: CreatePaymentIntegrationDto,
  ) {
    return this.paymentService.create(createDto);
  }

  /**
   * Get all payments
   *
   * GET /payments
   */
  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  /**
   * Get payment detail
   *
   * GET /payments/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  /**
   * Get payments by booking
   *
   * GET /payments/booking/:bookingId
   */
  @Get('booking/:bookingId')
  findByBookingId(
    @Param('bookingId')
    bookingId: string,
  ) {
    return this.paymentService.findByBookingId(bookingId);
  }

  /**
   * Gateway callback
   *
   * Stripe/VNPay gọi endpoint này
   *
   * POST /payments/callback
   */
  @Post('callback')
  callback(
    @Body()
    body: {
      transactionId: string;

      status: PaymentStatus;

      gatewayResponse?: Record<string, unknown>;
    },
  ) {
    return this.paymentService.handleCallback(
      body.transactionId,
      body.status,
      body.gatewayResponse,
    );
  }

  /**
   * Save transaction id after create checkout session
   *
   * PATCH /payments/:id/transaction
   */
  @Patch(':id/transaction')
  updateTransaction(
    @Param('id')
    id: string,

    UpdatePaymentIntegrationDto: UpdatePaymentIntegrationDto,
  ) {
    return this.paymentService.updateTransaction(
      id,
      UpdatePaymentIntegrationDto,
    );
  }

  /**
   * Confirm payment manually
   *
   * PATCH /payments/:id/confirm
   */
  @Patch(':id/confirm')
  confirm(
    @Param('id')
    id: string,
  ) {
    return this.paymentService.handleCallback(id, PaymentStatus.SUCCESS);
  }

  /**
   * Cancel payment
   *
   * PATCH /payments/:id/cancel
   */
  @Patch(':id/cancel')
  cancel(
    @Param('id')
    id: string,
  ) {
    return this.paymentService.cancel(id);
  }

  /**
   * Refund payment
   *
   * PATCH /payments/:id/refund
   */
  @Patch(':id/refund')
  refund(
    @Param('id')
    id: string,
  ) {
    return this.paymentService.refund(id);
  }

  /**
   * Delete payment
   *
   * DELETE /payments/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('id')
    id: string,
  ) {
    return this.paymentService.remove(id);
  }
}
