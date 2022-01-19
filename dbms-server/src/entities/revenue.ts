// import {  Entity, ManyToOne, OneToOne, PrimaryKey,  Property } from "@mikro-orm/core";
import { Field, Int, ObjectType, registerEnumType, } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne } from "typeorm";
import { Car } from "./car";


export enum RType{
    TITLE ="title",
    PARTNER = "partner",
    OTHER = "other"

}

registerEnumType(RType,{
    name: "RType",
    description: "this is the revenue type for the sponsor"
})

@ObjectType()
@Entity()
export class Revenue extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    r_id!: number;

    @Field(() => String)
    @Column(({type: "date"}))
    duration: string;

    @Field(() => Int)
    @Column()
    value: number;

    @Field()
    @Column({type: "enum", enum: RType, default: RType.OTHER})
    type: RType;

    @ManyToOne(() => Car, car => car.revenue)
    car: Car;
}