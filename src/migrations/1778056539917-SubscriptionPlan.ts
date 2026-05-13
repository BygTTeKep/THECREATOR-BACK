import { MigrationInterface, QueryRunner } from 'typeorm';

export class SubscriptionPlan1778056539917 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS subscription_plans (
                id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                name TEXT NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL
            );
        `);
    await queryRunner.query(`
            INSERT INTO subscription_plans (name, description, price) VALUES
            ('CREATOR', 'Subscription for creators', 15000.00)
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS subscription_plans;
        `);
  }
}
