import { Mechanic } from "../entities/mechanic";
import { Resolver, Query, Arg, Int, ObjectType, Field, Mutation, InputType, } from "type-graphql";
import { FError } from "./contract";
import { Contract } from "src/entities/contract";
import { Car } from "src/entities/car";
import { Management } from "../entities/management";
import { getConnection } from "typeorm";


@ObjectType()
class MechanicResponse{
    @Field(() => [FError])
    errors?: FError[]

    @Field(() => Mechanic)
    mechanic?: Mechanic

}


@Resolver()
export class ManagementResolvers{

    @Query(() =>[Management])
    async allManagement(
        @Arg('limit', () => Int) limit: number,
        @Arg('cursor', () => Int, {nullable: true}) cursor: number | null
    ): Promise<Management[]>{
        const realLimit = Math.min(50, limit);
        const qb = getConnection().getRepository(Management)
                                .createQueryBuilder("M")
                                
                                .orderBy('m_id')
                                .take(realLimit)

                if(cursor){
                    qb.where(" m_id > :cursor", {cursor});
                }
                return qb.getMany()
    }

    @Query(() =>[Management])
    async myManagement(

    ): Promise<Management[]>{
            const qb = await getConnection().getRepository(Management)
                                            .createQueryBuilder("m")
                                            .where("status = 1")
                                            .orderBy('m_id')
                                            .getMany();
            return qb;
    }

    


}