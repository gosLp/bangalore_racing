import { __prod__ } from "./constant";
import { login } from "./entities/login";
import {MikroORM} from "@mikro-orm/core";
import path from "path";

export default{
    migrations:{
        path: path.join(__dirname,"./migrations"),
        pattern: /^[\w-]+\d+\.[tj]s$/
    },
    entities:[login],
    dbName: 'Bangalore_racing',
    host:"localhost",
    user:"root",
    port:3306,
    password: "prat1234",
    type:"mysql",
    debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];

