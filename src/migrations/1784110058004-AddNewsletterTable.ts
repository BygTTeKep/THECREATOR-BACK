import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewsletterTable1784110058004 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS newsletter (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        user_id UUID,
        user_session_id VARCHAR(255) NOT NULL UNIQUE,
        enable BOOLEAN NOT NULL DEFAULT TRUE
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS newsletter;
    `);
  }
}
