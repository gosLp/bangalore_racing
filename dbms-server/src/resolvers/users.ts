import {login} from '../entities/login'
import { Resolver, Query, Ctx, Arg, Mutation, Int, InputType, Field, ObjectType } from "type-graphql";
import { MyContext } from "src/types";
import argon2 from 'argon2';
import console from 'console';
import { COOKIE_NAME } from '../constant';
import { getConnection, getRepository } from 'typeorm';
declare module "express-session" {
    interface SessionData {
      userId?: number;
    }
  }



@InputType()
class UsernamePasswordInput{
    @Field()
    username: string
    @Field()
    password: string
}

@ObjectType()
class FieldError{
    @Field()
    field: string;
    @Field()
    message: string;

}

@ObjectType()
class UserResponse{
    @Field(() => [FieldError], {nullable: true} )
    errors?: FieldError[]  

    @Field(() => login, {nullable: true})
    user?: login
}

@Resolver()
export class LoginResolvers {

    @Query(() => login, {nullable: true})
    async me(
        @Ctx(){ req }:MyContext
    ){
        // not logged in
        console.log(req.session.userId);
        if(!req.session.userId){
            return null
        }

        // const user = await  .findOne(login, {id: req.session.userId});
        const user = await login.findOne({where:{id:req.session.userId}});//login.findOne(req.session.userId);
        return user;
    }


    @Query(()=> [login])
    users():Promise<login[]>{
        
        return login.find()
    }

    @Mutation(() => login, {nullable: true})
    async updateUser(
        @Arg('id', () => Int) id: number,
        @Arg('uname', () => String) uname: string,
        @Arg('password', () => String) password: string
    ):Promise<login | null>{
        const update = await login.findOne(id);
        if(!update){
            return null
        }
        if(typeof uname !== 'undefined' && typeof password !== 'undefined'){
            update.uname = uname;
            update.password = password;
            await login.update({uname: uname},{password: password})//em.persistAndFlush(update);

        }
        
    
        return update;
    }


    @Mutation(() => Boolean)
    async deleteUser(
        @Arg('uname', () => String) uname: string
    ):Promise<Boolean>{
        try{
            // await em.nativeDelete(login, {uname});
            await login.delete(uname);
        }catch{
            console.log("user does not exist");
            return false;
        }
        
    
        return true;
    }

    //Actual signup mmodule with hashed passwords
    @Mutation(() => UserResponse)
    async register(
        @Arg('options', () => UsernamePasswordInput) options : UsernamePasswordInput,
        @Ctx() { req}: MyContext
    ):Promise<UserResponse>{
        if(options.username.length <= 2){
            return{
                errors:[
                    {
                        field: "username",
                        message: "Length should be greater than 2 characters"
                    }
                ]
            }
        }
        if(options.password.length <= 3){
            return{
                errors:[
                    {
                        field: "password",
                        message: "Length should be greater than 3 characters"
                    }
                ]
            }
        }
        const hashedPassword = await argon2.hash(options.password);
        // const user = em.create(login,{
        //     uname: options.username,
        //     password: hashedPassword
        // });
        let user;
        try{
            user = await login.create({
                uname: options.username,
                password: hashedPassword
            }).save()
             console.log('result: ', user);
            
             console.log("id is :", user.id)

        }catch(err){
            // duplicate username error code
            
            if(err.code ==="ER_DUP_ENTRY"){
                
                return {
                    errors: [
                        {
                            field:"username",
                            message:"Username already taken"
                        }
                    ]
                }
            }  
        }
        //store the cookie in the cookie table
        //will keep the user logged in
        req.session.userId = user?.id;

        return {
            user //from UserResponse Object type
        };
    }

    // Login module for users with hash comparsion
    @Mutation(() => UserResponse)
    async login(
        @Arg('options', () => UsernamePasswordInput) options : UsernamePasswordInput,
        @Ctx() { req}: MyContext
    ): Promise<UserResponse>{
        const user = await login.findOne({where:{uname:options.username}});
        if(!user){
            return{
                errors: [
                    {
                    field: 'username',
                    message:'Username does not exist',
                },
            ]
            }
        }
        const valid = await argon2.verify(user.password, options.password);
        if(!valid){
            return{
                errors: [
                    {
                        field: "password",
                        message: "incorect password"
                    }
                ]
            }
        }
        
        req.session.userId = user.id;
        console.log(req.session.userId);
         
        return {
            user
        };
    }

    @Mutation(() => Boolean)
    logout(
        @Ctx(){ req, res}: MyContext
    ){
        res.clearCookie
        return new Promise(resolve =>req.session.destroy(err =>{
            res.clearCookie(COOKIE_NAME)
            if(err){
                console.log(err);
                resolve(false)
                return
            }

            resolve(true);
        }))
    }

}