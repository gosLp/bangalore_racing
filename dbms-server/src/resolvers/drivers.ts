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
class DriverDetailsResponse{
    @Field(() => [FError], {nullable:true})
    errors?: FError[]

    @Field(() => Contract, {nullable:true})
    contract?: Contract

    @Field(() => Engineer, {nullable:true})
    engineer?: Engineer

    @Field(() => Driver, {nullable:true})
    driver?: Driver

    
}

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

    @Query(() => [Car])
    async myCar(
        @Arg('id', () =>Int) id: number
    ):Promise<Car[]>{
        const myCar = await Car.find({where:{driverId: id}});
        return myCar
    }


    @Query(() => DriverDetailsResponse)
    async myDetails(
        @Arg('id', () =>Int) id: number
    ):Promise<DriverDetailsResponse>{
        const myDriver = await getConnection().getRepository(Driver)
        .find({where:{driver_id: id},relations: ["contract", "engineer"]})
        console.log(myDriver[0]);
        if(myDriver[0].contract || myDriver[0].engineer){
            return{
                contract: myDriver[0].contract,
                engineer: myDriver[0].engineer,
                driver: myDriver[0]
            }
        }
        
        else{
            return{
                errors:[{
                    field:"Engineer",
                    message: "Driver doesn't have a Engineer"
                }]
            }
        }
    }

    @Mutation(() => Driver)
    async newDriverEngineer(
        @Arg('driverId', ()=>Int) driverId: number,
        @Arg('eId', ()=>Int) eId: number
    ):Promise<Driver>{
        const driver =  await getConnection().getRepository(Driver)
        .findOne({where:{driver_id: driverId},relations: ["contract", "engineer"]})
        if(driver){
            const engineer = await Engineer.findOne({where:{engineer_id: eId}});

            await getConnection().createQueryBuilder().update(Driver)
                                            .set({engineer: engineer}).where("driver_id = :id", {id:driverId})
                                            .execute().then(()=>{
                                                return driver
                                            }).catch(()=>{
                                                return driver
                                            })

        }
        return driver!
    }
}