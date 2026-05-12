import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('room_inventory')
export class RoomInventory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  roomId!: string;

  @Column({ type: 'date' })
  date!: Date;

  @Column()
  totalStock!: number;

  @Column()
  availableStock!: number;

  @Column()
  reservedStock!: number;

  @Column()
  soldStock!: number;

  @Column({ default: false })
  stopSell!: boolean;
}