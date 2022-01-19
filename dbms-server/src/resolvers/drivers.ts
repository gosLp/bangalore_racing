import {login} from '../entities/login'
import { Resolver, Query, Ctx, Arg, Mutation, Int, InputType, Field, ObjectType } from "type-graphql";
import { MyContext } from "src/types";
import argon2 from 'argon2';
import console from 'console';
import { COOKIE_NAME } from '../constant';
import { getConnection, getRepository } from 'typeorm';
import {Driver} from '../entities/driver'
import {FError} from './contract'
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

// @ObjectType()
// class FieldError{
//     @Field()
//     field: string;
//     @Field()
//     message: string;

// }

@ObjectType()
class UserResponse{
    @Field(() => [FError], {nullable: true} )
    errors?: FError[]  

    @Field(() => login, {nullable: true})
    user?: login
}
@ObjectType()
class DriverInput{
    @Field(() => String)
    name: string

    @Field(() => Int)
    age: number
    
}

@Resolver()
export class DriverResolvers {

    // @Query(() => login, {nullable: true})
    // async me(
    //     @Ctx(){ req }:MyContext
    // ){
    //     // not logged in
    //     console.log(req.session.userId);
    //     if(!req.session.userId){
    //         return null
    //     }

    //     // const user = await  .findOne(login, {id: req.session.userId});
    //     const user = await login.findOne({where:{id:req.session.userId}});//login.findOne(req.session.userId);
    //     return user;
    // }

    @Query(() =>[Driver])
    async myDrivers(

    ): Promise<Driver[]>{
            const qb = await getConnection().getRepository(Driver)
                                            .createQueryBuilder("d")
                                            .where("status = 1")
                                            .orderBy('pos')
                                            .getMany();
            return qb;
    }


    @Mutation(() => Driver)
    async newDriver(
        // @Arg('limit') limit: number,
        // @Arg('cursor', () => String, {nullable: true}) cursor: string | null
    ){
         return Driver.create()
        
    }


    @Query(()=> [Driver])
    drivers(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => Int, {nullable: true}) cursor: number | null
  
    ):Promise<Driver[]>{
        const realLimit = Math.min(50, limit);
        const qb = getConnection().getRepository(Driver)
                                .createQueryBuilder("d")
                                
                                .orderBy('pos')
                                .take(realLimit)

                if(cursor){
                    qb.where("pos > :cursor", {cursor});
                }
                return qb.getMany()
                                // .select()
                                // .from(Driver, "drivers")
                                // // .where("user.id = :id", { id: 1 })
                                // .orderBy('"pos"')
                                // .getMany()
        
    }

    

}