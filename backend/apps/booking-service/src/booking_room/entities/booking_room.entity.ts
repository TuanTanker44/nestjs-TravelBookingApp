import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Booking } from '../../booking/entities/booking.entity';

@Index(['bookingId'])
@Index(['roomId'])
@Entity('booking_rooms')
export class BookingRoom {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  bookingId!: string;

  @ManyToOne(() => Booking, (booking) => booking.bookingRooms)
  @JoinColumn({ name: 'bookingId' })
  booking!: Booking;

  @Column()
  roomId!: string;

  @Column()
  quantity!: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  pricePerNight!: number;

  @Column()
  numberOfNights!: number;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
  })
  subtotal!: number;
}
