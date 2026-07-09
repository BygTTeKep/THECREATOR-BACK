import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStatisticTabel1783508414144 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        event_type VARCHAR(255) NOT NULL,
        user_id UUID,
        page_url VARCHAR(255) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
        ip VARCHAR(45) NOT NULL,
        user_agent TEXT NOT NULL,
        session_id UUID NOT NULL
      );

      CREATE INDEX idx_analytics_events_created_at
        ON analytics_events(created_at);

      CREATE INDEX idx_analytics_events_event_type
        ON analytics_events(event_type);

      CREATE INDEX idx_analytics_events_user_id
        ON analytics_events(user_id);

      CREATE INDEX idx_analytics_events_session_id
        ON analytics_events(session_id);

      CREATE INDEX idx_analytics_events_page_url
        ON analytics_events(page_url);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE IF EXISTS analytics_events;
    `);
  }
}
