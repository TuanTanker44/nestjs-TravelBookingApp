// payment.entity.ts

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { PaymentStatus } from '../enums/status.enum';
import { PaymentProvider } from '../enums/provider.enum';

@Entity('payments')
@Index(['bookingId'])
@Index(['transactionId'])
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  bookingId!: string;

  @Column()
  userId!: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  amount!: number;

  @Column({
    length: 10,
    default: 'USD',
  })
  currency!: string;

  @Column({
    type: 'enum',
    enum: PaymentProvider,
  })
  provider!: PaymentProvider;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  status!: PaymentStatus;

  // id từ Stripe/VNPay
  @Column({
    nullable: true,
  })
  transactionId?: string;

  @Column({
    nullable: true,
  })
  paymentUrl?: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  metadata?: Record<string, any>;

  @Column({
    nullable: true,
  })
  paidAt?: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
