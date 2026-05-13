import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateProductFilesTable1777715729809 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS product_files (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                product_id UUID NOT NULL,
                file_url VARCHAR(255) NOT NULL,
                FOREIGN KEY (product_id) REFERENCES products(id)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS product_files;
        `);
  }
}
