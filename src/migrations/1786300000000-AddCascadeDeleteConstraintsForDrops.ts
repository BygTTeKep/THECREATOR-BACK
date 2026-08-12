import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Гарантирует ON DELETE CASCADE по цепочке:
 * drops → products → product_files / product_variants
 * drops → drops_files
 */
export class AddCascadeDeleteConstraintsForDrops1786300000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      DECLARE
        constraint_name text;
      BEGIN
        -- products.drop_id → drops.id
        SELECT con.conname INTO constraint_name
        FROM pg_constraint con
        JOIN pg_attribute att
          ON att.attrelid = con.conrelid AND att.attnum = ANY (con.conkey)
        WHERE con.conrelid = 'products'::regclass
          AND con.contype = 'f'
          AND con.confrelid = 'drops'::regclass
          AND att.attname = 'drop_id'
        LIMIT 1;
        IF constraint_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE products DROP CONSTRAINT %I', constraint_name);
        END IF;

        -- product_files.product_id → products.id
        SELECT con.conname INTO constraint_name
        FROM pg_constraint con
        JOIN pg_attribute att
          ON att.attrelid = con.conrelid AND att.attnum = ANY (con.conkey)
        WHERE con.conrelid = 'product_files'::regclass
          AND con.contype = 'f'
          AND con.confrelid = 'products'::regclass
          AND att.attname = 'product_id'
        LIMIT 1;
        IF constraint_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE product_files DROP CONSTRAINT %I', constraint_name);
        END IF;

        -- product_variants.product_id → products.id
        SELECT con.conname INTO constraint_name
        FROM pg_constraint con
        JOIN pg_attribute att
          ON att.attrelid = con.conrelid AND att.attnum = ANY (con.conkey)
        WHERE con.conrelid = 'product_variants'::regclass
          AND con.contype = 'f'
          AND con.confrelid = 'products'::regclass
          AND att.attname = 'product_id'
        LIMIT 1;
        IF constraint_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE product_variants DROP CONSTRAINT %I', constraint_name);
        END IF;

        -- drops_files.drop_id → drops.id
        SELECT con.conname INTO constraint_name
        FROM pg_constraint con
        JOIN pg_attribute att
          ON att.attrelid = con.conrelid AND att.attnum = ANY (con.conkey)
        WHERE con.conrelid = 'drops_files'::regclass
          AND con.contype = 'f'
          AND con.confrelid = 'drops'::regclass
          AND att.attname = 'drop_id'
        LIMIT 1;
        IF constraint_name IS NOT NULL THEN
          EXECUTE format('ALTER TABLE drops_files DROP CONSTRAINT %I', constraint_name);
        END IF;
      END $$;
    `);

    await queryRunner.query(`
      ALTER TABLE products
        ADD CONSTRAINT products_drop_id_fkey
        FOREIGN KEY (drop_id) REFERENCES drops(id) ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE product_files
        ADD CONSTRAINT product_files_product_id_fkey
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE product_variants
        ADD CONSTRAINT product_variants_product_id_fkey
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;
    `);

    await queryRunner.query(`
      ALTER TABLE drops_files
        ADD CONSTRAINT drops_files_drop_id_fkey
        FOREIGN KEY (drop_id) REFERENCES drops(id) ON DELETE CASCADE;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE product_files
        DROP CONSTRAINT IF EXISTS product_files_product_id_fkey;
    `);
    await queryRunner.query(`
      ALTER TABLE product_files
        ADD CONSTRAINT product_files_product_id_fkey
        FOREIGN KEY (product_id) REFERENCES products(id);
    `);

    // Остальные FK изначально уже были с CASCADE — оставляем как есть
  }
}
