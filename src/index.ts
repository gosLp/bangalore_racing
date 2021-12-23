import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constant";
import { login } from "./entities/login";
import mikroOrmConfig from "./mikro-orm.config";


const main = async () => {
    const orm = MikroORM.init(mikroOrmConfig);
    (await orm).getMigrator().up();
    console.log("This might be the start of the project");    
    const loginfo = (await orm).em.create(login, {uname: 'prat', password: '1234'});
    (await orm).em.persistAndFlush(loginfo).catch((err)=>{console.log(err)});
};
main().catch((err) =>{
    console.log(err);
});
