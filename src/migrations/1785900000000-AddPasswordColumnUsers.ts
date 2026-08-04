import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPasswordColumnUsers1785900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE users
            ADD COLUMN IF NOT EXISTS password VARCHAR(255) NOT NULL DEFAULT '';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE users
        DROP COLUMN IF EXISTS password;
    `);
  }
}
