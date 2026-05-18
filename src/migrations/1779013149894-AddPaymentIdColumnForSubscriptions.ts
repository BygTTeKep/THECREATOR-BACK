import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddPaymentIdColumnForSubscriptions1779013149894 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'subscriptions',
      new TableColumn({
        name: 'payment_id',
        type: 'varchar',
        length: '255',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('subscriptions', 'payment_id');
  }
}
