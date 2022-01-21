import { Mechanic } from "../entities/mechanic";
import { Resolver, Query, Arg, Int, ObjectType, Field, Mutation, InputType, } from "type-graphql";
import { FError } from "./contract";
import { Contract } from "../entities/contract";
import { Car } from "../entities/car";
import { getConnection } from "typeorm";


@ObjectType()
class MechanicResponse{
    @Field(() => [FError],{nullable: true})
    errors?: FError[]

    @Field(() => Mechanic, {nullable: true})
    mechanic?: Mechanic

}


@Resolver()
export class MechanicResolvers{

    @Query(() => MechanicResponse)
    async MechInfo(
        @Arg('mechId',()=>Int) mechId: number
    ): Promise<MechanicResponse>{
        let mechanic;
        mechanic = await Mechanic.findOne({relations:['car', 'contract'], where:{mech_id: mechId}});
        console.log(mechanic);
        if(mechanic){
            return{
                
                mechanic: mechanic
            }
        }
        else{
            return{
                errors:[{
                    field:"Mech Id",
                    message:`Could not find mechanic with ID: ${mechId}`
                }]
            }
        }

    }
    
    @Mutation(() => MechanicResponse)
    async NewMechanic(
        @Arg('Mname', () => String) Mname: string,
        @Arg('carId', ()=> Int) carId: number
    ):Promise<MechanicResponse>{
            let mechanic;

            
            const car = await Car.findOne({where:{car_id: carId}})
            if(car){

                mechanic = await Mechanic.create({Mname: Mname,car: car}).save();
                return{
                    mechanic: mechanic
                }
            }   
            else{
                return{
                    errors: [{
                        field:"carID",
                        message: `could not find car with id : ${carId}`
                    }]
                }
            }
            

    }

    @Query(() =>[Mechanic])
    async myMechanics(

    ): Promise<Mechanic[]>{
            const qb = await getConnection().getRepository(Mechanic)
                                            .createQueryBuilder("m")
                                            .where("status = 1")
                                            .orderBy('mech_id')
                                            .getMany();
            return qb;
    }


}