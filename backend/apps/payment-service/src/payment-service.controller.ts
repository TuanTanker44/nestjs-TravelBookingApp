import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { PaymentServiceService } from './payment-service.service';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentServiceController {
  constructor(private readonly paymentService: PaymentServiceService) {}

  /**
   * tạo payment
   * booking-service gọi endpoint này
   */
  @Post()
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  /**
   * lấy tất cả payment
   */
  @Get()
  findAll() {
    return this.paymentService.findAll();
  }

  /**
   * lấy payment theo bookingId
   *
   * GET /payments/booking/:bookingId
   */
  @Get('booking/:bookingId')
  findByBooking(@Param('bookingId') bookingId: string) {
    return this.paymentService.findByBookingId(bookingId);
  }

  /**
   * detail payment
   *
   * GET /payments/:id
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentService.getPayment(id);
  }

  /**
   * bắt đầu thanh toán
   *
   * PENDING -> PROCESSING
   */
  @Post(':id/process')
  process(@Param('id') id: string) {
    return this.paymentService.process(id);
  }

  /**
   * confirm payment
   *
   * PROCESSING -> SUCCESS
   *
   * dùng cho:
   * - mock gateway
   * - webhook
   */
  @Post(':id/confirm')
  confirm(
    @Param('id') id: string,

    @Body()
    body: {
      transactionId?: string;
      metadata?: Record<string, unknown>;
    },
  ) {
    return this.paymentService.confirm(id, body.transactionId, body.metadata);
  }

  /**
   * payment fail
   */
  @Post(':id/fail')
  fail(
    @Param('id') id: string,

    @Body()
    body: {
      reason?: string;
    },
  ) {
    return this.paymentService.fail(id, body.reason);
  }

  /**
   * cancel payment
   */
  @Post(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.paymentService.cancel(id);
  }

  /**
   * refund
   *
   * SUCCESS -> REFUNDED
   */
  @Post(':id/refund')
  refund(
    @Param('id') id: string,

    @Body()
    body: {
      reason?: string;
    },
  ) {
    return this.paymentService.refund(id, body.reason);
  }

  /**
   * update payment
   */
  @Patch(':id')
  update(
    @Param('id') id: string,

    @Body()
    updatePaymentDto: UpdatePaymentDto,
  ) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  /**
   * delete payment
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }
}
