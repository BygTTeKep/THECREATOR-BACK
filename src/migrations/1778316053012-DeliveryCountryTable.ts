import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeliveryCountryTable1778316053012 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS delivery_country (
                id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                delivery_id INTEGER NOT NULL,
                country_id INTEGER NOT NULL,
                FOREIGN KEY (delivery_id) REFERENCES delivery(id),
                FOREIGN KEY (country_id) REFERENCES countries(id),
                UNIQUE (delivery_id, country_id)
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS delivery_country;
    `);
  }
}
