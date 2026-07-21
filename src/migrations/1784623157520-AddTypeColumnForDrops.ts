import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTypeColumnForDrops1784623157520 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE drops
            ADD COLUMN IF NOT EXISTS drop_type VARCHAR(255) NOT NULL DEFAULT 'standart';
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE drops
        DROP COLUMN IF EXISTS drop_type;
    `);
  }
}
