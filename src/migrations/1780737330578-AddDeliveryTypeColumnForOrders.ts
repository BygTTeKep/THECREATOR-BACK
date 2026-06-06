import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeliveryTypeColumnForOrders1780737330578 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE orders ADD COLUMN delivery_type VARCHAR(255) NOT NULL DEFAULT 'pvz';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE orders DROP COLUMN delivery_type;
        `);
  }
}
