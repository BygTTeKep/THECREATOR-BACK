import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeliveryMethodForOrders1779699860732 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE orders ADD COLUMN delivery_method VARCHAR(255) NOT NULL DEFAULT 'standard';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE orders DROP COLUMN delivery_method;
        `);
  }
}
