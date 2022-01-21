import {login} from '../entities/login'
import { Resolver, Query, Ctx, Arg, Mutation, Int, InputType, Field, ObjectType } from "type-graphql";
import { MyContext } from "src/types";
import argon2 from 'argon2';
import console from 'console';
import { COOKIE_NAME } from '../constant';
import { getConnection, getRepository } from 'typeorm';
import {Driver} from '../entities/driver'
import {FError} from './contract'
import { Car } from '../entities/car';
import { Contract,  } from '../entities/contract';
import { Engineer } from '../entities/engineer';
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
class EngineerDetailsResponse{
    @Field(() => [FError], {nullable:true})
    errors?: FError[]

    @Field(() => Contract, {nullable:true})
    contract?: Contract

    @Field(() => Engineer, {nullable:true})
    engineer?: Engineer

    
}


@ObjectType()
class EngineerResponse{
    @Field(() => [FError], {nullable: true} )
    errors?: FError[]  

    @Field(() => Engineer, {nullable: true})
    engineer?: Engineer
}
@InputType()
class EngineerInput{
    @Field(() => String)
    name: string

    @Field(() => Int)
    age: number
    
}

@Resolver()
export class EngineerResolvers {

   


    @Mutation(() => EngineerResponse)
    async newEngineer(
        @Arg('options', () => EngineerInput) options: EngineerInput
        // @Arg('limit') limit: number,
        // @Arg('cursor', () => String, {nullable: true}) cursor: string | null
    ): Promise<EngineerResponse>{
         const engineer = await Engineer.create({Ename: options.name, Eage: options.age, status:false}).save();
         if(engineer){
             return{
                 engineer: engineer
             }
         }
         else{
             return{
                 errors: [{
                     field: "Engineer",
                     message: "Query Failed, New Engineer not created"
                 }]
             }
         }
    }


    @Query(()=> [Engineer])
    Engineers(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => Int, {nullable: true}) cursor: number | null
  
    ):Promise<Engineer[]>{
        const realLimit = Math.min(50, limit);
        const qb = getConnection().getRepository(Engineer)
                                .createQueryBuilder("e")
                                
                                .orderBy('Eage')
                                .take(realLimit)

                if(cursor){
                    qb.where("Eage > :cursor", {cursor});
                }
                return qb.getMany()
                                // .select()
                                // .from(Driver, "drivers")
                                // // .where("user.id = :id", { id: 1 })
                                // .orderBy('"pos"')
                                // .getMany()
        
    }

    @Query(() => [Engineer])
    async myEngineers(
    ):Promise<Engineer[]>{
        const qb = await getConnection().getRepository(Engineer)
                                            .createQueryBuilder("e")
                                            .where("status = 1")
                                            .orderBy('Eage')
                                            .getMany();
            return qb;
    }


    @Query(() => EngineerDetailsResponse)
    async EngineerInfo(
        @Arg('id', () =>Int) id: number
    ):Promise<EngineerDetailsResponse>{
        const engineer = await getConnection().getRepository(Engineer)
                        .find({where:{engineer_id: id},relations: ["contract"]});
        if(engineer.length !==0){
            console.log(engineer[0])
            
            if(engineer[0].contract){
                return{
                    contract: engineer[0].contract,
                    engineer: engineer[0]
                }
            }
            else{
                return{
                    engineer: engineer[0]
                }
            }
            
        }
        
        
        else{
            return{
                errors:[{
                    field:"engineer",
                    message: `engineer with id: ${id} doesn't exist`
                }]
            }
        }
    }

    // @Query(() => Engineer)
    // async myEngineer(
    //     @Arg('id')
    // )
}