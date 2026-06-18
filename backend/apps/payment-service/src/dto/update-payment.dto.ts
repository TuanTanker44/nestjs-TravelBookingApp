import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './create-payment.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {
  transactionId?: string;

  paymentUrl?: string;

  metadata?: Record<string, any>;
}
