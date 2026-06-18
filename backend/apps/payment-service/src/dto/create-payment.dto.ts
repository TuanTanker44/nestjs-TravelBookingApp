import { IsNumber, IsString, IsUUID } from 'class-validator';
import { PaymentProvider } from '../enums/provider.enum';

export class CreatePaymentDto {
  @IsString()
  @IsUUID()
  bookingId!: string;

  @IsString()
  @IsUUID()
  userId!: string;

  @IsNumber()
  amount!: number;

  @IsString()
  currency!: string;

  @IsString()
  provider!: PaymentProvider;
}
