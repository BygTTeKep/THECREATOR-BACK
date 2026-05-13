import { MigrationInterface, QueryRunner } from 'typeorm';

export class CountriesTable1778315909664 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS countries (
                id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                code VARCHAR(255) NOT NULL UNIQUE
            );
        `);
    await queryRunner.query(`
            INSERT INTO countries (name, code) VALUES ('Russia', 'RU');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS countries;
        `);
  }
}
