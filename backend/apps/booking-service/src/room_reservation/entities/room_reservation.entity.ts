import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ReservationStatus } from '../enums/status.enum';

@Index(['bookingId'])
@Index(['roomTypeId'])
@Index(['status'])
@Entity('room_reservations')
export class RoomReservation {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  bookingId!: string;

  @Column()
  roomTypeId!: string;

  @Column()
  quantity!: number;

  @Column({
    type: 'enum',
    enum: ReservationStatus,
  })
  status!: ReservationStatus;

  @Column()
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;
}
