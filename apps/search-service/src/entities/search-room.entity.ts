import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('search_rooms')
export class SearchRoom {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  roomId!: string;

  @Index()
  @Column({ type: 'uuid' })
  hotelId!: string;

  @Index()
  @Column({ type: 'varchar', length: 255 })
  hotelName!: string;

  @Index()
  @Column({ type: 'varchar', length: 100 })
  city!: string;

  @Column({ type: 'varchar', length: 100 })
  roomName?: string;

  @Index()
  @Column({ type: 'varchar', length: 50 })
  roomType!: string;

  @Index()
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price!: number;

  @Column({ type: 'int' })
  capacity!: number;

  @Index()
  @Column({ type: 'varchar', length: 20 })
  status!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  // denormalized
  @Column({
    type: 'json',
    nullable: true,
  })
  amenities!: string[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
