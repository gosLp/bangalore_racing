import { MikroORM } from "@mikro-orm/core";
import { __prod__ } from "./constant";
import mikroOrmConfig from "./mikro-orm.config";
import express from "express";
import {ApolloServer} from 'apollo-server-express';
import {buildSchema} from 'type-graphql';
import { HelloResolvers } from "./resolvers/hello";
import { LoginResolvers } from "./resolvers/users";
import "reflect-metadata";
//import mysql from "mysql2";
import session from "express-session";
import { MyContext } from "./types";
import cors from 'cors';
//import connectMySql from "express-mysql-session";




// const MySqlStore = require("express-mysql-session")(session);


const main = async () => {
    const orm = MikroORM.init(mikroOrmConfig);
    (await orm).getMigrator().up();
    console.log("This might be the start of the project"); 
    const app = express();

    //const MySqlStore = connectMySql(session);
    const MySqlStore = require("express-mysql-session")(session)
    const mySqlOptions ={
        
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'prat1234',
        database: 'Bangalore_racing'

    }
    const sessionStore = new MySqlStore(mySqlOptions);


    // use in production
    app.use(cors({
        origin: "http://localhost:3000", credentials: true
    })
    );
    
    // const mySqlClient = mysql.createConnection(mySqlOptions)
    app.use(session({
        name: "qid",
        secret: 'dbmsminiproject',
        cookie: {
            maxAge: 365 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'lax', //csrf
            secure: __prod__ // cookie only in https if production
        },
        store: sessionStore,
        resave: false,
        saveUninitialized: false
    }));


    const apolloserver = new ApolloServer({
        schema: await buildSchema({
            resolvers:[HelloResolvers, LoginResolvers],
            validate: false
        }),
        
        context: async ({req, res}): Promise<MyContext> => ({em: (await orm).em, req, res}),
    });
    await apolloserver.start()
    console.log(apolloserver);
    apolloserver.applyMiddleware({app, cors:false}); // set true to use apollo studio

    app.listen(4000, ()=>{
        console.log("server started on localhost:4000")
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
