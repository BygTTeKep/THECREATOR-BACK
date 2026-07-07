import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSocialMediaTable1783426785793 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS socialmedia (
                id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                link TEXT
            );
        `);
    await queryRunner.query(`
            INSERT INTO socialmedia (name, link) VALUES ('pinterest', 'https://ru.pinterest.com/THECREATOROFF/');
            INSERT INTO socialmedia (name, link) VALUES ('telegram', 'https://t.me/THECR3ATOR');
            INSERT INTO socialmedia (name, link) VALUES ('instagram', 'https://www.instagram.com/thecreatoroff/');
            INSERT INTO socialmedia (name, link) VALUES ('thecreator', 'https://thecreatorstudio.ru/');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS socialmedia;
        `);
  }
}
