import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

/**
 * таблица для храния продуктов
 * с размерами и ценами
 */
@Entity('product_variants')
export class ProductVariantsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, type: 'uuid' })
  product_id: string;

  @Column({ nullable: false, length: 5 })
  size: string;

  @Column({ nullable: false, length: 255 })
  sku: string;

  @Column({ nullable: false, type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ nullable: false, type: 'int' })
  stock: number;
}
