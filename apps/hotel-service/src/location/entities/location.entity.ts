import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('locations')
export class Location {
  @PrimaryColumn('varchar', { length: 36 })
  hotel_id!: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  status!: 'ACTIVE' | 'INACTIVE';

  @Column({ type: 'double', nullable: false })
  latitude!: number;

  @Column({ type: 'double', nullable: false })
  longitude!: number;
}
