import { Migration } from '@mikro-orm/migrations';

export class Migration20211223175454 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table `login` (`id` int unsigned not null auto_increment primary key, `uname` varchar(255) not null, `password` varchar(255) not null) default character set utf8mb4 engine = InnoDB;');
  }

}
