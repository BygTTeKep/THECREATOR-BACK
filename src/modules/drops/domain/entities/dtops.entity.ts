import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum DropsTypeEnum {
  standart = 'standart',
  preorder = 'preorder',
}

@Entity('drops')
export class DropsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  description: string;

  @Column({ nullable: true, type: 'timestamp' })
  starts_at: Date;
  @Column({ nullable: true, type: 'timestamp' })
  ends_at: Date;
  @Column({ default: false })
  is_active: boolean;
  @Column({ type: 'smallint', nullable: false })
  tier: number;
  @Column({ default: true })
  is_visible: boolean;

  @Column({ default: DropsTypeEnum.standart, type: 'varchar' })
  drop_type: DropsTypeEnum;
}
