import {login} from '../entities/login'
import { Resolver, Query, Ctx, Arg, Mutation, Int, InputType, Field, ObjectType } from "type-graphql";
import { MyContext } from "src/types";
import argon2 from 'argon2';


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
    @Query(()=> [login])
    users(
        @Ctx() {em}: MyContext
    ):Promise<login[]>{
        
        return em.find(login, {});
    }

    @Mutation(() => login, {nullable: true})
    async updateUser(
        @Arg('id', () => Int) id: number,
        @Arg('uname', () => String) uname: string,
        @Arg('password', () => String) password: string,
        @Ctx() {em}: MyContext
    ):Promise<login | null>{
        const update = await em.findOne(login, {id});
        if(!update){
            return null
        }
        if(typeof uname !== 'undefined' && typeof password !== 'undefined'){
            update.uname = uname;
            update.password = password;
            await em.persistAndFlush(update);

        }
        
    
        return update;
    }


    @Mutation(() => Boolean)
    async deleteUser(
        @Arg('uname', () => String) uname: string,
        @Ctx() {em}: MyContext
    ):Promise<Boolean>{
        try{
            await em.nativeDelete(login, {uname});
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
        @Ctx() {em}: MyContext
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
        const user = em.create(login,{
            uname: options.username,
            password: hashedPassword
        });
        try{
            await em.persistAndFlush(user);
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
        
        return {
            user //from UserResponse Object type
        };
    }

    // Login module for users with hash comparsion
    @Mutation(() => UserResponse)
    async login(
        @Arg('options', () => UsernamePasswordInput) options : UsernamePasswordInput,
        @Ctx() {em}: MyContext
    ): Promise<UserResponse>{
        const user = await em.findOne(login, {uname: options.username});
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
        return {
            user
        };
    }

}