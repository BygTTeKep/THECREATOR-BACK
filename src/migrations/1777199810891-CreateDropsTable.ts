import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDropsTable1777199810891 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS drops (
                id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT NOT NULL,
                starts_at TIMESTAMP NOT NULL,
                ends_at TIMESTAMP NOT NULL,
                is_active BOOLEAN NOT NULL,
                is_visible BOOLEAN NOT NULL DEFAULT TRUE,
                tier SMALLINT NOT NULL,
                FOREIGN KEY (tier) REFERENCES tiers(id)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS drops;
        `);
  }
}
