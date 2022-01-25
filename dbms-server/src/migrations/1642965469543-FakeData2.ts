import {MigrationInterface, QueryRunner} from "typeorm";

export class FakeData21642965469543 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
        ` 
        insert into driver (pos, status, Dname, Dage) values (1, false, 'Max Verstappen', 24);
        insert into driver (pos, status, Dname, Dage) values (2, false, 'Lewis Hamilton', 37);
        insert into driver (pos, status, Dname, Dage) values (3, false, 'Sebastien Vettel', 34);
        insert into driver (pos, status, Dname, Dage) values (4, false, 'Charles Leclerc', 24);
        insert into driver (pos, status, Dname, Dage) values (5, false, 'Pato O'Ward ', 22);
        insert into driver (pos, status, Dname, Dage) values (15, false, 'Oscar Piastri', 19);
        insert into driver (pos, status, Dname, Dage) values (7, false, 'Carlos Sainz', 27);
        insert into driver (pos, status, Dname, Dage) values (8, false, 'Lando Norris', 21);
        insert into driver (pos, status, Dname, Dage) values (9, false, 'Pierre Gasly', 26);
        insert into driver (pos, status, Dname, Dage) values (10, false, ' Fernando Alonso', 41);
        insert into driver (pos, status, Dname, Dage) values (11, false, 'George Russel', 23);
        insert into driver (pos, status, Dname, Dage) values (12, false, 'Daniel Ricardo', 32);
        insert into driver (pos, status, Dname, Dage) values (13, false, 'Mick Schumacher', 22);
        insert into driver (pos, status, Dname, Dage) values (14, false, 'Valteri Bottas', 30);


        insert into engineer (Ename, Eage, status) values ('GP', 37, false);
        insert into engineer (Ename, Eage, status) values ('Brad', 34, false);
        insert into engineer (Ename, Eage, status) values ('Bono', 38, false);
        insert into engineer (Ename, Eage, status) values ('Greg', 37, false);
        insert into engineer (Ename, Eage, status) values ('Randy', 35, false);
        insert into engineer (Ename, Eage, status) values ('James', 28, false);
        insert into engineer (Ename, Eage, status) values ('Tom', 39, false);
        insert into engineer (Ename, Eage, status) values ('Alain', 33, false);
        insert into engineer (Ename, Eage, status) values ('Martin', 41, false);
        insert into engineer (Ename, Eage, status) values ('Danil', 29, false);
        insert into engineer (Ename, Eage, status) values ('Pierre', 35, false);
        insert into engineer (Ename, Eage, status) values ('Bastiat', 32, false);



        insert into management (name, status, type) values ('Christian Horner', false, 'principle');
        insert into management (name, status, type) values ('Otmar Snaufnar', false,ß 'principle');
        insert into management (name, status, type) values ('Damon Hill', false, 'advisor');
        insert into management (name, status, type) values ('Bernie Ecclestone', false, 'director');
        insert into management (name, status, type) values ('Gene haas', false, 'director');
        insert into management (name, status, type) values ('Mac Johnson', false, 'director');
        insert into management (name, status, type) values ('Josh Allen', false, 'director');
        insert into management (name, status, type) values ('David A Brivio', false, 'advisor');
        insert into management (name, status, type) values ('Robert Murphy', false, 'advisor');
        insert into management (name, status, type) values ('Martin Budkowski', false, 'advisor');
        insert into management (name, status, type) values ('Allain Prost', false, 'advisor');
        insert into management (name, status, type) values ('Andries Siedle', false, 'principle');
        insert into management (name, status, type) values ('Matia Binotto', false, 'principle');
        insert into management (name, status, type) values ('Toto Wolf', false, 'principle');
        `
        )
    }

    public async down(_: QueryRunner): Promise<void> {
        
    }

}
