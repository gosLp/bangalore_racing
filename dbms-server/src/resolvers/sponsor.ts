import {login} from '../entities/login'
import { Resolver, Query, Ctx, Arg, Mutation, Int, InputType, Field, ObjectType } from "type-graphql";
import { MyContext } from "src/types";
import argon2 from 'argon2';
import console from 'console';
import { COOKIE_NAME } from '../constant';
import { getConnection, getRepository } from 'typeorm';
import {Driver} from '../entities/driver'
import {FError} from './contract'
import { Revenue, RType } from '../entities/revenue';
import { Car } from '../entities/car';
declare module "express-session" {
    interface SessionData {
      userId?: number;
    }
  }

 

@InputType()
class SponsorInput{
    @Field(() => RType)
    type: RType;
    @Field(() => String)
    duration: string;
    @Field( () => Int)
    value: number;
}


@ObjectType()
class SponsorResponse{
    @Field(() => [FError], {nullable: true} )
    errors?: FError[]  

    @Field(() => Revenue, {nullable: true})
    revenue?: Revenue
}
@ObjectType()
class DriverInput{
    @Field(() => String)
    name: string

    @Field(() => Int)
    age: number
    
}

@Resolver()
export class SponsorResolvers {

    

    @Mutation(() => SponsorResponse)
    async newSponsor(
        @Arg('options', () => SponsorInput) options: SponsorInput,
        @Arg('carId', () => Int, {nullable: true}) carId: number | null
    ): Promise<SponsorResponse>{
         let sponsoredCar;
         let sponsor
         if(!carId){
            try{
                // return{
                //     revenue:  
                 sponsor = await Revenue.create({
                     duration: options.duration,
                     type: options.type,
                     value: options.value
                 }).save();
                        
                
            }catch(err){
                console.log(err);
            }
            return {
                revenue : sponsor
            }
         }
         
         try{
             sponsoredCar = await Car.findOne({where: {car_id: carId}});
                console.log(options);
             
                if(sponsoredCar){
                    sponsor =  Revenue.create({
                       ...options,
                       duration: options.duration ,
                       car: sponsoredCar
                   });
                   console.log(sponsor)
                   console.log(sponsoredCar);
                   sponsoredCar.revenue = [sponsor];
                   
               
               
                return {
                    errors: [{
                        field: "carId",
                        message: `car with id : ${carId} doesn't exist, select a proper car`
                    }]
                        
                }
                
            }
             
             

         }catch(err){
            console.log(err);
         }
         
        
        return {
            revenue: sponsor
        }
        
        
    }

    @Query(() =>[Revenue])
    async allSponsors(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => Int, {nullable: true}) cursor: number | null
    ): Promise<Revenue[]>{
        const realLimit = Math.min(50, limit);
        const qb = getConnection().getRepository(Revenue)
                                .createQueryBuilder("S")
                                
                                .orderBy('value')
                                .take(realLimit)

                if(cursor){
                    qb.where(" r_id > :cursor", {cursor});
                }
                return qb.getMany()
    }


}