// import {  Entity, ManyToOne, OneToOne, PrimaryKey,  Property } from "@mikro-orm/core";
import { Field, Int, ObjectType, } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, JoinColumn, OneToOne, ManyToOne } from "typeorm";
import { Car } from "./car";
import { Contract } from "./contract";

export enum Parts{
    ENGINE = "engine",
    CHASIS = "chasis",
    AERO = "aero",
    CREW = "crew",
    
}
@ObjectType()
@Entity()
export class Mechanic extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    mech_id!: number;

    @Field(() => Int)
    @Column({
        type: "enum",
        enum: Parts,
        default: Parts.CREW
    })
    part: Parts;
    
    @Field()
    @Column({type: "text"})
    Mname: string;

    @OneToOne(() => Contract)
    @JoinColumn()
    contract: Contract;

    @ManyToOne(() => Car, car => car.mechanic)
    car: Car


}