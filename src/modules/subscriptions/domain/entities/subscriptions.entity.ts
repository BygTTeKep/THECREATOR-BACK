import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

/**
 * подписки пользователей
 */
@Entity('subscriptions')
export class SubscriptionsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ unique: true, nullable: true })
  stripe_id: number;

  @Column({ default: 'active' })
  status: string;

  @CreateDateColumn()
  started_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  current_period_end: Date;

  @Column({ type: 'timestamp', nullable: true })
  canceled_at: Date | null;

  @Column({ type: 'integer', nullable: false })
  subscription_plan_id: number;
}
