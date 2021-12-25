import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constant";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolvers } from "./resolvers/hello";
import { LoginResolvers } from "./resolvers/users";
import "reflect-metadata";


const main = async () => {
    const orm = MikroORM.init(mikroOrmConfig);
    (await orm).getMigrator().up();
    console.log("This might be the start of the project"); 
    const app = express();

    const apolloserver = new ApolloServer({
        schema: await buildSchema({
            resolvers:[HelloResolvers, LoginResolvers],
            validate: false
        }),
        context: async () => ({em: (await orm).em})
    });
    await apolloserver.start()
    console.log(apolloserver);
    apolloserver.applyMiddleware({app});

    app.listen(3000, ()=>{
        console.log("server started on localhost:3000")
    });

    app.get('/',(_,res) =>{
        res.send("HELLO!")
    })


    // const loginfo = (await orm).em.create(login, {uname: 'prat', password: '1234'});
    // (await orm).em.persistAndFlush(loginfo).catch((err)=>{console.log(err)});
    // const loginfo = (await orm).em.find(login, {})
    //                 .then((doc) => {
    //                     console.log(doc);
    //                 })
    //                 .catch((err)=>{
    //                     console.log(err);
    //                 });
    // console.log(loginfo);
};
main().catch((err) =>{
    console.log(err);
});
