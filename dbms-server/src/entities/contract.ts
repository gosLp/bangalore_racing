// import {  Entity, ManyToOne, OneToOne, PrimaryKey,  Property } from "@mikro-orm/core";
import { Field, Int, ObjectType, } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne } from "typeorm";
import {registerEnumType} from 'type-graphql';





export enum ContractType {
    MANGAEMENT = "management",
    DRIVER = "driver",
    ENGINEER = "engineer",
    MECHANIC = "mechanic"

}
registerEnumType(ContractType,{
    name:'ContractType',
    description: "which employee contract type, EX: Driver Contract or Mechanic",

});

@ObjectType()
@Entity()
export class Contract extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    contract_id!: number;
    
    @Field()
    @Column({type: "boolean"})
    status: boolean;
    
    @Field()
    @Column({
        type: "enum",
        enum: ContractType,
        default: ContractType.MANGAEMENT
    })
    type: ContractType;

    @Field()
    @Column({type: "date"})
    duration: string;

    @Field()
    @Column()
    value: number;

}