import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPlannedDeliveryDateColumn1786201488892 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS planned_delivery_date TIMESTAMP`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE orders DROP COLUMN IF EXISTS planned_delivery_date`,
    );
  }
}
