import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DropLineEnum } from '../enums/dropLine.enum';
import { DropsTypeEnum } from '../enums/dropType.enum';

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

  // Линия дропа имеется ввиду постоянная линейка
  // или лимитированая линейка
  @Column({ type: 'varchar', nullable: false })
  drop_line: DropLineEnum;
}
