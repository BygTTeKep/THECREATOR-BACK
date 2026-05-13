import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('products')
export class ProductsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'int' })
  drop_id: number;

  @Column({ nullable: false, length: 255 })
  name: string;

  @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  base_cost: number;

  @CreateDateColumn({ nullable: false })
  created_at: Date;

  @Column({ nullable: false, type: 'jsonb' })
  metadata: Record<string, any>;
}
