// PaymentIntegration thường là bảng trung gian lưu thông tin giao tiếp giữa Booking Service và Payment Provider (VNPay, Stripe, PayPal...).

import { Column } from 'typeorm/decorator/columns/Column.js';
import { PrimaryGeneratedColumn } from 'typeorm/decorator/columns/PrimaryGeneratedColumn.js';
import { Entity } from 'typeorm/decorator/entity/Entity.js';
import { PaymentProvider } from '../enums/payment-provider.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { CreateDateColumn, Index, UpdateDateColumn } from 'typeorm';

// Nó không phải là bảng Payment chính, mà lưu transaction bên ngoài
@Index(['bookingId'])
@Index(['transactionId'])
@Index(['status'])
@Entity('payment_integrations')
export class PaymentIntegration {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * Booking liên quan
   */
  @Column()
  bookingId!: string;

  /**
   * Provider:
   * STRIPE
   * VNPAY
   * PAYPAL
   */
  @Column({
    type: 'enum',
    enum: PaymentProvider,
  })
  provider!: PaymentProvider;

  /**
   * ID giao dịch bên gateway
   */
  @Column({
    nullable: true,
  })
  transactionId?: string;

  /**
   * Số tiền thanh toán
   */
  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  amount!: number;

  /**
   * Currency
   * USD, VND...
   */
  @Column({
    length: 10,
  })
  currency!: string;

  /**
   * trạng thái payment
   */
  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  status!: PaymentStatus;

  /**
   * URL redirect tới payment page
   */
  @Column({
    nullable: true,
  })
  paymentUrl?: string;

  /**
   * response từ gateway
   */
  @Column({
    type: 'json',
    nullable: true,
  })
  gatewayResponse?: Record<string, any>;

  /**
   * thời gian thanh toán thành công
   */
  @Column({
    nullable: true,
  })
  paidAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
