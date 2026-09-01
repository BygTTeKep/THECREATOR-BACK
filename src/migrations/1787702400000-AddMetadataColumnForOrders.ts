import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMetadataColumnForOrders1787702400000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE orders
            ADD COLUMN IF NOT EXISTS metadata JSONB;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE orders
            DROP COLUMN IF EXISTS metadata;
        `);
  }
}
