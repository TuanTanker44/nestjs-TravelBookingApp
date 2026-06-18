import { PartialType } from '@nestjs/swagger';
import { CreatePaymentIntegrationDto } from './create-payment-integration.dto';
import { PaymentStatus } from '../enums/payment-status.enum';

export class UpdatePaymentIntegrationDto extends PartialType(
  CreatePaymentIntegrationDto,
) {
  status?: PaymentStatus;

  transactionId?: string;

  paymentUrl?: string;
}
