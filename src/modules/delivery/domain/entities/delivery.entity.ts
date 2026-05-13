import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('delivery')
export class DeliveryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;
}
