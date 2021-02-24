import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMovieDetails1614161244336 implements MigrationInterface {
  name = 'addMovieDetails1614161244336';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "details_entity" ("movieId" character varying NOT NULL, "title" character varying NOT NULL, "released" character varying NOT NULL, "genre" character varying NOT NULL, "director" character varying NOT NULL, CONSTRAINT "PK_d08e785fd07c4de5470afa48b06" PRIMARY KEY ("movieId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "details_entity"`);
  }
}
