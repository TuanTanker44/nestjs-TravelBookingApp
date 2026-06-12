import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BookingStatus } from '../enums/status.enum';
import { BookingPaymentStatus } from '../enums/payment-status.enum';
import { BookingRoom } from '../../booking_room/entities/booking_room.entity';

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @Column()
  hotelId!: string;

  @Column({ type: 'date' })
  checkInDate!: Date;

  @Column({ type: 'date' })
  checkOutDate!: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount!: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
  })
  status!: BookingStatus;

  @Column({
    type: 'enum',
    enum: BookingPaymentStatus,
  })
  paymentStatus!: BookingPaymentStatus;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;

  @OneToMany(() => BookingRoom, (bookingRoom) => bookingRoom.booking, {
    cascade: true,
  })
  bookingRooms!: BookingRoom[];
}
