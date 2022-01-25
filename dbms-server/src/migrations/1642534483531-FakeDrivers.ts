import {MigrationInterface, QueryRunner} from "typeorm";

export class FakeDrivers1642534483531 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await  queryRunner.query(
           `insert into driver (pos, status, Dname, Dage) values (6, false, 'Kizzie', 21);
           `
        );
    }

    public async down(_: QueryRunner): Promise<void> {
    }

}
