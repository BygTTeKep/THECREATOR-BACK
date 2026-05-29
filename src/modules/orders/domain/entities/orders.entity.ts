import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderStatusEnum } from '../enums/ordersStatus.enum';

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

  @Column({ type: 'varchar', length: 255, nullable: true })
  delivery_method: string;
}
