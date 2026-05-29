import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
  VersionColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('room_inventory')
@Unique('uk_room_date', ['roomId', 'inventoryDate'])
@Index('idx_search', ['inventoryDate', 'availableRooms', 'isClosed'])
export class RoomInventory {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column({
    type: 'varchar',
    length: 36,
  })
  roomId!: string;

  @Column({
    type: 'date',
  })
  inventoryDate!: string;

  @Column({
    type: 'int',
  })
  totalRooms!: number;

  @Column({
    type: 'int',
    default: 0,
  })
  reservedRooms!: number;

  @Column({
    type: 'int',
  })
  availableRooms!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  price!: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  isClosed!: boolean;

  @VersionColumn({
    type: 'int',
    default: 0,
  })
  version!: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt!: Date;
}
