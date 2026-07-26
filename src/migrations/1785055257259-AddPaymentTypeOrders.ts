import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentTypeOrders1785055257259 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE orders
            ADD COLUMN IF NOT EXISTS payment_type VARCHAR(255) NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE orders
        DROP COLUMN IF EXISTS payment_type;
    `);
  }
}
