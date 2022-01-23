import {login} from '../entities/login'
import { Resolver, Query, Ctx, Arg, Mutation, Int, InputType, Field, ObjectType, registerEnumType } from "type-graphql";
import { MyContext } from "src/types";
import argon2 from 'argon2';
import console from 'console';
import { COOKIE_NAME } from '../constant';
import { getConnection, getRepository } from 'typeorm';
import {Driver} from '../entities/driver'
import {FError} from './contract'
import { Revenue, RType } from '../entities/revenue';
import { Car, EngineParts } from '../entities/car';
import {Mechanic, Parts} from '../entities/mechanic'
import { Engineer } from 'src/entities/engineer';

declare module "express-session" {
    interface SessionData {
      userId?: number;
    }
  }




export enum PartType{
    FRONT = "front",
    REAR = "rear",
    CHASIS = "chasis",
    ENGINE = "E_condition"
} 

registerEnumType(PartType,{
    name: "PartType",
    description: "values for part inquiry on car"
})
@ObjectType()
class CarResponse{
    @Field(() => [FError], {nullable: true} )
    errors?: FError[]  

    @Field(() => Car, {nullable: true})
    car?: Car
}


@ObjectType()
class mechanicResponse{
    @Field(() => [Mechanic])
    mechanic: Mechanic[]
    
    @Field(() => [FError], {nullable: true} )
    errors?: FError[]  

}
@ObjectType()
class ConditonType{
    @Field(() => String)
    part: string

    @Field(() => EngineParts)
    condition: EngineParts;   
}

@ObjectType()
class carConditionResponse{
    @Field(() => [FError], {nullable: true} )
    errors?: FError[]
    
    @Field(()=> [ConditonType], {nullable: true})
    condition?: ConditonType[]
}
@Resolver()
export class CarResolvers {

   @Query(() => carConditionResponse)
   async carCondition(
       @Arg('carId', () => Int) carId: number,
       @Arg('part', () => PartType ) part: PartType,
       @Ctx(){req}: MyContext
   ):Promise<carConditionResponse> {
        
        const car = await Car.findOne({where: {car_id: carId}});
        let condition
        if(car){
            req.body.car = car
            switch (part) {
                case PartType.ENGINE:
                     condition = car.E_condition
                    return{
                        condition: [{
                            condition:condition,
                            part: part.toString()
                        }]
                    }
                    
                case PartType.FRONT:
                     condition = car.front
                    return{
                        condition: [{
                            condition:condition,
                            part: part.toString()
                        }]
                    }
                    
                   
                case PartType.CHASIS:
                     condition = car.chasis
                    return{
                        condition: [{
                            condition:condition,
                            part: part.toString()
                        }]
                    }
                    
                  
                case PartType.REAR:
                     condition = car.rear
                    return{
                        condition: [{
                            condition:condition,
                            part: part.toString()
                        }]
                    }
                    
            
                default: return{
                    errors: [{
                        field: "part",
                        message: "input the correct part "
                    }]
                }
                    
            }

            

        }

        else{
            return{
                errors:[{
                    field: "carId",
                    message:"no such car of input ID"
                }]
            }
        }
        
   }


    @Mutation(() =>CarResponse)
    async newDriver(
        @Arg('driver_id', () => Int) driver_id: number,
        @Arg('id', () => Int) id: number

    ): Promise<CarResponse>{

        const newDriver = await Driver.findOne({where:{driver_id: driver_id}});
        console.log(newDriver?.driver_id);
        if(!newDriver){
            return{
                errors: [{
                    field: "driver_id",
                    message: `Driver doesn't exist with Id : ${driver_id}`
                }]
            }
        }    
        const  car = await Car.findOne({where:{car_id: id}});
        console.log(car)
        if(car){
            
            
               const update= await getConnection().createQueryBuilder()
                    .update(Car)
                    .set({driver: newDriver, driverId: newDriver.driver_id})
                    .where("car_id = :id",{id: id})
                    .execute();
                    console.log(update)
                
                if(update.affected === 1){
                     return{
                        car:  car   
                    }
                }
                else{
                    return{
                        errors:[{
                            field: "driverId",
                            message: "Query failed for some reason"
                        }]
                    }
                }
                
                   
                 
                
            
            

        }
        else{
            return{
                errors:[{
                    field: "carId",
                    message: `car with id: ${id} doesnt exist`
                }]
            }
        }
        return{
            errors: [{
                field: "driver_id",
                message: "query failed"
            }]
            
            
        }
    }


    @Query(() => [Revenue])
    async sponsors(
        @Arg('carId', () => Int) carId: number
    ): Promise<Revenue[]>{
        const qb = getConnection().getRepository(Revenue)
                                   .createQueryBuilder("r")
                                   .where("carCarId = :id", {id: carId })
                                   .orderBy('type')
             return await qb.getMany();
    }

    

    @Query(() => mechanicResponse)
    async mechanics(
        @Arg('carId', () => Int) carId: number
    ): Promise<mechanicResponse>{
        const qb = await getConnection().getRepository(Mechanic)
                                   .createQueryBuilder("M")
                                   .where("carCarId = :id", {id: carId })
                                   .groupBy('mech_id')
                                   .getMany();
        console.log(qb[0])
        
             return {
                 mechanic: qb
             }
    }
    

    


}