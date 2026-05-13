import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1777198552766 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(255) NOT NULL UNIQUE,
                status VARCHAR(255) NOT NULL DEFAULT 'active',
                total_months SMALLINT NOT NULL DEFAULT 0,
                metadata JSONB,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                current_tier_id SMALLINT
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS users;
        `);
  }
}
