import { Column, CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class WhitelistEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'uuid', nullable: false })
  user_id: string;

  @Column({ type: 'integer', nullable: false })
  product_id: number;

  @Column({ type: 'integer', nullable: false })
  drop_id: number;

  @CreateDateColumn()
  created_at: Date;
}
