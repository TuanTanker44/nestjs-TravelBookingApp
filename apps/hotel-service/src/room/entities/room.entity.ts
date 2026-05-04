import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum RoomStatus {
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
  MAINTENANCE = 'maintenance',
}

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
  type!: 'single' | 'double' | 'group';

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ type: 'int' })
  capacity!: number; // số người tối đa

  @Column({
    type: 'enum',
    enum: RoomStatus,
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
