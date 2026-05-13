import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSubscriptionTable1778056648056 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                CREATE TABLE IF NOT EXISTS subscriptions (
                    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                    user_id UUID NOT NULL,
                    stripe_id TEXT NULL,
                    status VARCHAR(255) NOT NULL DEFAULT 'active',
                    started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    current_period_end TIMESTAMP NOT NULL,
                    canceled_at TIMESTAMP,
                    subscription_plan_id INTEGER NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    FOREIGN KEY (subscription_plan_id) REFERENCES subscription_plans(id)
                );
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                DROP TABLE IF EXISTS subscriptions;
            `);
  }
}
