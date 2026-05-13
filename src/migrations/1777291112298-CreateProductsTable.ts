import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductsTable1777291112298 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS products (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                drop_id INT NOT NULL,
                name VARCHAR(255) NOT NULL,
                base_cost DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                metadata JSONB NOT NULL,
                FOREIGN KEY (drop_id) REFERENCES drops(id) ON DELETE CASCADE
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS products
        `);
  }
}
