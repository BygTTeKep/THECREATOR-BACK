import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { EventTypeStatisticEnum } from '../enums/EventType.enum';

@Entity('analytics_events')
export class AnalyticsEventsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  event_type: EventTypeStatisticEnum;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column()
  page_url: string;

  @CreateDateColumn()
  created_at: Date;

  @Column({ type: 'jsonb' })
  metadata: Record<any, any>;

  @Column({ type: 'varchar', length: 45 })
  ip: string;

  @Column({ type: 'text' })
  user_agent: string;

  @Column({ type: 'uuid' })
  session_id: string;
}
