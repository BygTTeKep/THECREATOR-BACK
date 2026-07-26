import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatusEnum } from '../enums/ordersStatus.enum';
import { OrdersTypeEnum } from '../enums/ordersType.enum';
import { PaymentTypeEnum } from '../../../../core/enums/paymentType.enum';

@Entity('orders')
export class OrdersEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column({ type: 'varchar', length: 255 })
  status: OrderStatusEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total_amount: number;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'int' })
  drop_id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  payment_id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tracking_number: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  delivery_method: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  delivery_type: string;

  @Column({ type: 'varchar', default: OrdersTypeEnum.standart })
  order_type: OrdersTypeEnum;

  @Column({ type: 'varchar', nullable: false })
  payment_type: PaymentTypeEnum;
}
