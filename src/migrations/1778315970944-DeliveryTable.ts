import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeliveryTable1778315970944 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS delivery (
                id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                description TEXT NOT NULL UNIQUE
            );
        `);
    await queryRunner.query(`
            INSERT INTO delivery (name, description) VALUES ('Sdek', 'Sdek is a delivery service that delivers packages to your door.');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS delivery;
        `);
  }
}
