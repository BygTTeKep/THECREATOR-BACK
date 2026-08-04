import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAddressColumnOrder1785828524114 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE orders
            ADD COLUMN IF NOT EXISTS address JSONB NOT NULL DEFAULT '{}';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE orders
        DROP COLUMN IF EXISTS address;
    `);
  }
}
