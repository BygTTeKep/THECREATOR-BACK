import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDropLine1784978615645 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE drops
            ADD COLUMN IF NOT EXISTS drop_line VARCHAR(255) NOT NULL DEFAULT 'limit';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE drops
        DROP COLUMN IF EXISTS drop_line;
    `);
  }
}
