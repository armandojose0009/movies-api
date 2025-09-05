import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTables1700000000000 implements MigrationInterface {
  name = 'CreateTables1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "movies" (
        "id" SERIAL NOT NULL,
        "title" character varying NOT NULL,
        "description" text NOT NULL,
        "duration" integer NOT NULL,
        "genre" character varying NOT NULL,
        "rating" character varying NOT NULL,
        CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "cinemas" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "location" character varying NOT NULL,
        "capacity" integer NOT NULL,
        CONSTRAINT "PK_2eb9d6c6d6d6f6c6d6d6f6c6d6d" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "showtimes" (
        "id" SERIAL NOT NULL,
        "movieId" integer NOT NULL,
        "cinemaId" integer NOT NULL,
        "startTime" TIMESTAMP NOT NULL,
        "price" numeric(10,2) NOT NULL,
        CONSTRAINT "PK_3eb9d6c6d6d6f6c6d6d6f6c6d6d" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "tickets" (
        "id" SERIAL NOT NULL,
        "showtimeId" integer NOT NULL,
        "customerName" character varying NOT NULL,
        "customerEmail" character varying NOT NULL,
        "seatNumber" character varying NOT NULL,
        "purchaseDate" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_4eb9d6c6d6d6f6c6d6d6f6c6d6d" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      ALTER TABLE "showtimes" 
      ADD CONSTRAINT "FK_showtime_movie" 
      FOREIGN KEY ("movieId") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "showtimes" 
      ADD CONSTRAINT "FK_showtime_cinema" 
      FOREIGN KEY ("cinemaId") REFERENCES "cinemas"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      ALTER TABLE "tickets" 
      ADD CONSTRAINT "FK_ticket_showtime" 
      FOREIGN KEY ("showtimeId") REFERENCES "showtimes"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_ticket_seat_showtime" 
      ON "tickets" ("showtimeId", "seatNumber")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_ticket_seat_showtime"`);
    await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_ticket_showtime"`);
    await queryRunner.query(`ALTER TABLE "showtimes" DROP CONSTRAINT "FK_showtime_cinema"`);
    await queryRunner.query(`ALTER TABLE "showtimes" DROP CONSTRAINT "FK_showtime_movie"`);
    await queryRunner.query(`DROP TABLE "tickets"`);
    await queryRunner.query(`DROP TABLE "showtimes"`);
    await queryRunner.query(`DROP TABLE "cinemas"`);
    await queryRunner.query(`DROP TABLE "movies"`);
  }
}