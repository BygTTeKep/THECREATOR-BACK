import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeNullableCreatedAtEndsAtDrops1784979505472 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE drops
            ALTER COLUMN starts_at DROP NOT NULL`);
    await queryRunner.query(`
            ALTER TABLE drops
            ALTER COLUMN ends_at DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE drops
            ALTER COLUMN starts_at SET NOT NULL`);
    await queryRunner.query(`
            ALTER TABLE drops
            ALTER COLUMN ends_at SET NOT NULL`);
  }
}
