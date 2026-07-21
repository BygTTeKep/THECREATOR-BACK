import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTypeColumnForOrders1784623422586 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE orders
            ADD COLUMN IF NOT EXISTS order_type VARCHAR(255) NOT NULL DEFAULT 'standart';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE orders
        DROP COLUMN IF EXISTS order_type;
    `);
  }
}
