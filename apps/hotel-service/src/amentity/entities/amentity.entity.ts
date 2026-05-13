import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('amenities')
export class Amenity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  code!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  createdAt?: Date;

  @Column({ nullable: true })
  updatedAt?: Date;
}
