import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('delivery_country')
export class DeliveryCountryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  delivery_id: number;
  @Column()
  country_id: number;
}
