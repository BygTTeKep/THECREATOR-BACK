import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrderItemsTable1777291656199 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                order_id UUID NOT NULL,
                product_id UUID NOT NULL,
                quantity INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS order_items;
        `);
  }
}
