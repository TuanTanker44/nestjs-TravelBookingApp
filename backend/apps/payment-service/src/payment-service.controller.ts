import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { PaymentServiceService } from './payment-service.service';

@Controller()
export class PaymentServiceController {
  constructor(private readonly paymentServiceService: PaymentServiceService) {}

  @Get()
  getHello() {
    return {
      message: 'Payment service is running',
    };
  }

  @Post('payments/session')
  createPaymentSession(
    @Body()
    body: {
      bookingId: string;
      amount: number;
      currency: string;
      customerEmail: string;
      returnUrl: string;
    },
  ) {
    return this.paymentServiceService.createPaymentSession(body);
  }

  @Get('payments/:id')
  getPayment(@Param('id') id: string) {
    return this.paymentServiceService.getPayment(id);
  }

  @Post('payments/:id/confirm')
  confirmPayment(
    @Param('id') id: string,
    @Body() body: { transactionId: string },
  ) {
    return this.paymentServiceService.confirmPayment(id, body.transactionId);
  }

  @Post('payments/:id/fail')
  failPayment(
    @Param('id') id: string,
    @Body() body: { failureReason: string },
  ) {
    return this.paymentServiceService.failPayment(id, body.failureReason);
  }

  @Post('payments/:id/refund')
  refundPayment(
    @Param('id') id: string,
    @Body() body: { reason: string },
  ) {
    return this.paymentServiceService.refundPayment(id, body.reason);
  }
}
