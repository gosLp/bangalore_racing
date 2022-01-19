import {MigrationInterface, QueryRunner} from "typeorm";

export class FakeDrivers1642534483531 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await  queryRunner.query(
           `insert into driver (pos, status, Dname, Dage) values (6, false, 'Kizzie', 21);insert into driver (pos, status, Dname, Dage) values (7, false, 'Carlos', 26);insert into driver (pos, status, Dname, Dage) values (20, true, 'Shelagh', 33);
           insert into driver (pos, status, Dname, Dage) values (8, false, 'Barnie', 35);
           insert into driver (pos, status, Dname, Dage) values (12, false, 'Thomasina', 30);
           insert into driver (pos, status, Dname, Dage) values (8, false, 'Tonnie', 29);
           insert into driver (pos, status, Dname, Dage) values (11, false, 'Ted', 25);
           insert into driver (pos, status, Dname, Dage) values (19, false, 'Vivie', 28);
           insert into driver (pos, status, Dname, Dage) values (19, true, 'Russ', 38);
           insert into driver (pos, status, Dname, Dage) values (6, true, 'Ignatius', 28);
           insert into driver (pos, status, Dname, Dage) values (6, false, 'Brade', 35);
           insert into driver (pos, status, Dname, Dage) values (14, false, 'Nickola', 25);
           insert into driver (pos, status, Dname, Dage) values (17, false, 'Fionnula', 28);
           insert into driver (pos, status, Dname, Dage) values (7, false, 'Martha', 20);
           `
        );
    }

    public async down(_: QueryRunner): Promise<void> {
    }

}
