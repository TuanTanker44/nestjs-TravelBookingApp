import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('room_amenities')
export class RoomAmenity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  roomId!: string;

  @Index()
  @Column({ type: 'decimal', precision: 10, scale: 0 })
  amenityId!: number;
}
