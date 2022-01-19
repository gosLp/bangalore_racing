// import {  Entity, ManyToOne, OneToOne, PrimaryKey,  Property } from "@mikro-orm/core";
import { Field, Int, ObjectType, } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { Car } from "./car";
import { Contract } from "./contract";
import { Engineer } from "./engineer";


@ObjectType()
@Entity()
export class Driver extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    driver_id!: number;

    @Field(() => Int)
    @Column({unique: true})
    pos: number;

    @Field()
    @Column({type: "text", default: "inactive driver"})
    status: string;
    
    @Field()
    @Column({type: "text"})
    Dname: string;

    @Field(() => Int)
    @Column()
    Dage: number;

    @OneToMany(() => Car, car => car.driver)
    car: Car[];

    @OneToOne(() => Contract)
    @JoinColumn()
    contract: Contract;

    @OneToOne(() => Engineer)
    @JoinColumn()
    engineer: Engineer;
}