import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddTrackingNumberColumnToOrders1779352386925 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'tracking_number',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders', 'tracking_number');
  }
}
