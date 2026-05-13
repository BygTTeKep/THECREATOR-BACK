import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTierTable1777198813783 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS tiers (
                id SMALLINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                code VARCHAR(255) NOT NULL UNIQUE,
                name VARCHAR(255) NOT NULL,
                min_months SMALLINT NOT NULL,
                priority SMALLINT NOT NULL
            );
        `);
    await queryRunner.query(`
            INSERT INTO tiers (code, name, min_months, priority) VALUES ('INITIATE', 'Initiate', 0, 1);
            INSERT INTO tiers (code, name, min_months, priority) VALUES ('MEMBER', 'Member', 1, 2);
            INSERT INTO tiers (code, name, min_months, priority) VALUES ('CORE', 'Core', 3, 3);
            INSERT INTO tiers (code, name, min_months, priority) VALUES ('INNER', 'Inner', 6, 4);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS tiers;
        `);
  }
}
