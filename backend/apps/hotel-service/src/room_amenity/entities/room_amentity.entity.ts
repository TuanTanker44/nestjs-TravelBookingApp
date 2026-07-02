import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('room_amenity')
export class RoomAmenity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ type: 'uuid' })
  roomId!: string;

  @Index()
  @Column({ type: 'int' })
  amenityId!: number;
}
