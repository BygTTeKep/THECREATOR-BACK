import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIdInCourierSystem1786188910556 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE orders ADD COLUMN IF NOT EXISTS id_in_courier_service VARCHAR(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE orders DROP COLUMN IF EXISTS id_in_courier_service`,
    );
  }
}
