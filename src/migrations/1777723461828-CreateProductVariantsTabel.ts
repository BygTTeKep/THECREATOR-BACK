import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductVariantsTabel1777723461828 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS product_variants (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                product_id UUID NOT NULL,
                size VARCHAR(5) NOT NULL,
                sku VARCHAR(255) NOT NULL UNIQUE,
                price DECIMAL(10, 2) NOT NULL,
                stock INT NOT NULL,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS product_variants;
        `);
  }
}
