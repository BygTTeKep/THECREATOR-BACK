import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('product_files')
export class ProductFilesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  product_id: string;
  @Column({ type: 'varchar', length: 255, nullable: false })
  file_url: string;

  @Column({ type: 'int', default: 0 })
  priority: number;
}
