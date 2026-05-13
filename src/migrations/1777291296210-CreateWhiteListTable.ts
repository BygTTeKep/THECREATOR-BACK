import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWhiteListTable1777291296210 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS whitelist (
                id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                user_id UUID NOT NULL,
                product_id UUID NOT NULL,
                drop_id INT NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
                FOREIGN KEY (drop_id) REFERENCES drops(id) ON DELETE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS whitelist;
        `);
  }
}
