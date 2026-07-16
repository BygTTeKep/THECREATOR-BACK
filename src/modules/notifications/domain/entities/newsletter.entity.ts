import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('newsletter')
export class NewsLetterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ type: 'boolean', default: true })
  enable: boolean;

  @Column({ nullable: true })
  user_id?: string;

  @Column({ nullable: false })
  user_session_id: string;

  @CreateDateColumn()
  created_at: Date;
}
