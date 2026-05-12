import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { RoomStatus } from '../enums/room_status.enum';
import { RoomType } from '../enums/room_type.enum';

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // liên kết hotel-service (chỉ lưu id, không join DB khác)
  @Index()
  @Column({ type: 'uuid' })
  hotelId!: string;

  @Column({ type: 'varchar', length: 100 })
  name?: string; // "Deluxe Double Room"

  @Column({ type: 'varchar', length: 50 })
  type!: RoomType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'int' })
  capacity!: number; // số người tối đa

  @Column({
    type: 'varchar',
    length: 20,
    default: RoomStatus.AVAILABLE,
  })
  status!: RoomStatus;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
