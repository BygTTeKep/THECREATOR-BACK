import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('countries')
export class CountriesEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @Column({ unique: true })
  code: string;
}
