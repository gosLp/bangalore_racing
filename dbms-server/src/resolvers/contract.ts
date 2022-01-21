import {login} from '../entities/login'
import { Resolver, Query, Ctx, Arg, Mutation, Int, InputType, Field, ObjectType, UseMiddleware } from "type-graphql";
import { MyContext } from "src/types";
import argon2 from 'argon2';
import console from 'console';
import { COOKIE_NAME } from '../constant';
import { getConnection, getRepository } from 'typeorm';
// import { Contract, ContractType } from 'src/entities/contract';
import {Contract, ContractType} from '../entities/contract'
import { Engineer } from '../entities/engineer';
import {Management, MType} from '../entities/management';
import {Mechanic } from '../entities/mechanic';
import {Driver} from '../entities/driver'
import { isAuth } from '../middleware/isAuth';
import { TypeMetaFieldDef } from 'graphql';


declare module "express-session" {
    interface SessionData {
      userId?: number;
    }
  }

@InputType()
class Contractdetails{
    // @Field({defaultValue: false})
    // status: boolean
    @Field(() => ContractType)
    type: ContractType
    @Field()
    duration: string
    @Field()
    value: number
    // @Field(() => Int, {nullable: true})
    // typeId: number
}

@ObjectType()
export class FError{
    @Field()
    field: string;
    @Field()
    message: string;

}
@ObjectType()
class TypeField{
    @Field()
    type: string;

    @Field()
    message: string;
}

@ObjectType()
class ContractResponse{
    @Field(() => [FError], {nullable: true} )
    errors?: FError[]  

    @Field(() => Contract, {nullable: true})
    contract?: Contract

    @Field(()=>[TypeField],{nullable: true})
    TypeContract?: TypeField[]
}

@Resolver()
export class ContractResolvers {

    //Still have to do Error handling for inputs
    @Mutation(() => ContractResponse)
    //  @UseMiddleware(isAuth) //uncomment when using frontend
    async createContract(
        @Arg("options", () => Contractdetails) options: Contractdetails,
        @Arg("typeId", ()=> Int, {nullable: true}) typeId: number 
    ): Promise<ContractResponse>{
        let offer;
        if (!typeId) {
            try{
                
                offer = await Contract.create({
                    ...options,
                    duration: options.duration,
                    status: false,
                    type: options.type,
                    value: options.value
                }).save();
    
                if(!offer){
                    return {
                        errors: [{
                            field: "invalid Contract values",
                            message: "Enter Proper Values"
                        }]
                    }
                }
    
        
            } 
            catch(err){
                console.log("error is :",err);
            }
            
        } 
        else {
            try{    
                
                const offerFunc = async () =>{
                    offer = await Contract.create({
                        ...options,
                        duration: options.duration,
                        status: true,
                        type: options.type,
                        value: options.value
                    }).save();
                }
                

                switch (options.type) {
                    case ContractType.DRIVER: // logic to check if previous contract is more valuable isnt added
                    const driver = await Driver.findOne({where: {driver_id:typeId}});
                    if(!driver){
                        console.log(typeId);
                            return{
                                errors: [{
                                    field: `Input Personel ID is incorrect`,
                                    message: `${options.type} with ID: ${typeId} doesn't exist, Input a Valid Id`
                                }]
                            }
                            
                        
                    }
                    await offerFunc();
                    await getConnection().createQueryBuilder().update(Driver)
                                            .set({contract:offer, status: "active driver"}).where("driver_id = :id", {id:typeId})
                                            .execute();
                                            console.log(driver);
                        

                        
    
                        break;
                    case ContractType.ENGINEER:
                        const engineer = await Engineer.findOne({where:{engineer_id: typeId}})
                        if(!engineer){
                            console.log(typeId)
                                return{
                                    errors: [{
                                        field: `Input Personel ID is incorrect`,
                                        message: `${options.type} with ID: ${typeId} doesn't exist, Input a Valid Id`
                                    }]
                                }
                                
                            
                        }

                        await offerFunc();
                        await getConnection().createQueryBuilder().update(Engineer)
                                            .set({contract:offer, status: true}).where("engineer_id = :id", {id:typeId})
                                            .execute();
                        
                        break;
                    case ContractType.MANGAEMENT:
                        const management = await Management.findOne({where:{m_id: typeId}})
                        if(!management){
                            console.log(typeId)
                                return{
                                    errors: [{
                                        field: `Input Personel ID is incorrect`,
                                        message: `${options.type} with ID: ${typeId} doesn't exist, Input a Valid Id`
                                    }]
                                }
                                
                            
                        }
                        

                        await offerFunc(); 
                        await getConnection().createQueryBuilder().update(Management)
                                            .set({contract:offer, status: true}).where("m_id = :id",{id:typeId});                      
                        break;
                    case ContractType.MECHANIC:
                        const mechanic =  await Mechanic.findOne({where:{mech_id: typeId}})
                        if(!mechanic){
                            console.log(typeId)
                                return{
                                    errors: [{
                                        field: `Input Personel ID is incorrect`,
                                        message: `${options.type} with ID: ${typeId} doesn't exist, Input a Valid Id`
                                    }]
                                }
                                
                            
                        }

                        await offerFunc();
                        await getConnection().createQueryBuilder().update(Mechanic)
                                            .set({contract:offer, status: true}).where("mech_id = :id",{id:typeId});
                                
                        break;
                    default: return {
                        errors: [{
                            field: "ContractType",
                            message: " chose a proper contract Type"
                        }]
                    }
                        
                }
    
                if(!offer){
                    return {
                        errors: [{
                            field: "invalid Contract values",
                            message: "Enter Proper Values"
                        }]
                    }
                }
    
        
            } 
            catch(err){

                console.log("error is :",err);
            }
            
            
        }

        

        console.log("options entered by user are :", options)
        
        
        return {
            contract: offer
        }
        

    }


    

}