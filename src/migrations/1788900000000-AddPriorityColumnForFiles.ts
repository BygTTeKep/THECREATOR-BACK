import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPriorityColumnForFiles1788900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE drops_files
            ADD COLUMN IF NOT EXISTS priority INTEGER NOT NULL DEFAULT 0;
        `);
    await queryRunner.query(`
            ALTER TABLE product_files
            ADD COLUMN IF NOT EXISTS priority INTEGER NOT NULL DEFAULT 0;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE drops_files
            DROP COLUMN IF EXISTS priority;
        `);
    await queryRunner.query(`
            ALTER TABLE product_files
            DROP COLUMN IF EXISTS priority;
        `);
  }
}
