import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { UserStatus } from '../enums/userStatus.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column({ default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ default: 0 })
  total_months: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true, type: 'smallint' })
  current_tier_id?: number | null;
}
