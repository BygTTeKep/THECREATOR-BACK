import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subscription_plans')
export class SubscriptionPlanEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  // цена в рублях
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
