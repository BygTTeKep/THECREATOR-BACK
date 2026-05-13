import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tiers')
export class TiersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column()
  min_months: number;

  @Column()
  priority: number;
}
