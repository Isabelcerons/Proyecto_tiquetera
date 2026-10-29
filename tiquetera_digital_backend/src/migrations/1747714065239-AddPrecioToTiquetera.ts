import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPrecioToTiquetera1747714065239 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tiqueteras" ADD "precio" decimal(10,2) NOT NULL DEFAULT 225000`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tiqueteras" DROP COLUMN "precio"`);
    }

}
