import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDropFilesTable1777628290502 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS drops_files (
                id SERIAL PRIMARY KEY,
                drop_id INTEGER NOT NULL,
                file_url VARCHAR(255) NOT NULL,
                FOREIGN KEY (drop_id) REFERENCES drops(id) ON DELETE CASCADE
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS drops_files
        `);
  }
}
