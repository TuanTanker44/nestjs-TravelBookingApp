import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { BookingStatus } from '../enums/booking-status.enum';

@Entity('booking_histories')
@Index(['bookingId'])
@Index(['userId'])
export class BookingHistory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  /**
   * booking hiện tại
   */
  @Column()
  bookingId!: string;

  /**
   * user tạo booking
   */
  @Column()
  userId!: string;

  /**
   * trạng thái trước khi đổi
   */
  @Column({
    type: 'enum',
    enum: BookingStatus,
    nullable: true,
  })
  oldStatus?: BookingStatus;

  /**
   * trạng thái sau khi đổi
   */
  @Column({
    type: 'enum',
    enum: BookingStatus,
  })
  newStatus!: BookingStatus;

  /**
   * lý do thay đổi
   *
   * ví dụ:
   * - User cancelled
   * - Payment success
   * - Auto expired
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  reason?: string;

  /**
   * service/user nào tạo record
   *
   * BOOKING_SERVICE
   * PAYMENT_SERVICE
   * USER
   */
  @Column({
    nullable: true,
  })
  createdBy?: string;

  /**
   * metadata mở rộng
   *
   * lưu:
   * paymentId
   * transactionId
   * requestId
   */
  @Column({
    type: 'json',
    nullable: true,
  })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;
}
