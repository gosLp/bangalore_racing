// import {  Entity, ManyToOne, OneToOne, PrimaryKey,  Property } from "@mikro-orm/core";
import { Field, Int, ObjectType, } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn } from "typeorm";
import { Contract } from "./contract";


@ObjectType()
@Entity()
export class Engineer extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    engineer_id!: number;

    @Field(() => String)
    @Column({type: "text"})
    Ename: string;

    @Field()
    @Column({type: "boolean"})
    status: boolean;

    @Field(() => Int)
    @Column()
    Eage: number;

    @OneToOne(() => Contract)
    @JoinColumn()
    contract: Contract;
}