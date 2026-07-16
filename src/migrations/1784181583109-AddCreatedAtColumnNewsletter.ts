import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedAtColumnNewsletter1784181583109 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE newsletter
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT now();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE newsletter
      DROP COLUMN IF EXISTS created_at;
    `);
  }
}
