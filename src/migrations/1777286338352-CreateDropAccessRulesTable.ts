import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDropAccessRulesTable1777286338352 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS drop_access_rules (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                drop_id INT NOT NULL,
                min_tier_id INT NOT NULL,
                min_months INT NOT NULL,
                whitelist_only BOOLEAN NOT NULL,
                FOREIGN KEY (drop_id) REFERENCES drops(id) ON DELETE CASCADE,
                FOREIGN KEY (min_tier_id) REFERENCES tiers(id)
            );

        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS drop_access_rules;
        `);
  }
}
