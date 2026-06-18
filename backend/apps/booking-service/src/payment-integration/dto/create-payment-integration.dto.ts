import { IsNumber, IsString, IsUUID } from 'class-validator';
import { PaymentProvider } from '../enums/payment-provider.enum';

export class CreatePaymentIntegrationDto {
  @IsString()
  @IsUUID()
  bookingId!: string;

  provider!: PaymentProvider;

  @IsNumber()
  amount!: number;

  @IsString()
  currency!: string;
}
