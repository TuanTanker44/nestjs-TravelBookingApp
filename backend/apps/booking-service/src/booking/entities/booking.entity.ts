import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { BookingStatus } from '../enums/status.enum';
import { BookingPaymentStatus } from '../enums/payment-status.enum';
import { BookingRoom } from '../../booking_room/entities/booking_room.entity';

@Entity('bookings')
export class Booking {
  @Index('UNIQUE_BOOKING_ID', {
    unique: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  @Index()
  userId!: string;

  @Column()
  @Index()
  hotelId!: string;

  @Column({ type: 'date' })
  @Index()
  checkInDate!: Date;

  @Column({ type: 'date' })
  @Index()
  checkOutDate!: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount!: number;

  @Index()
  @Column({
    type: 'enum',
    enum: BookingStatus,
  })
  status!: BookingStatus;

  @Index()
  @Column({
    type: 'enum',
    enum: BookingPaymentStatus,
  })
  paymentStatus!: BookingPaymentStatus;

  @CreateDateColumn()
  @Index()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => BookingRoom, (bookingRoom) => bookingRoom.booking, {
    cascade: true,
  })
  bookingRooms!: BookingRoom[];
}
