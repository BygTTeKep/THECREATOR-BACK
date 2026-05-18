import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPaymentIdColumnForOrders1779013094272 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'orders',
      new TableColumn({
        name: 'payment_id',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('orders', 'payment_id');
  }
}
