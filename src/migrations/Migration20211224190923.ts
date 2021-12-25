import { Migration } from '@mikro-orm/migrations';

export class Migration20211224190923 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table `login` add unique `login_uname_unique`(`uname`);');
  }

}
