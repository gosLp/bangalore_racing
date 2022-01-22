// import {  Entity, ManyToOne, OneToOne, PrimaryKey,  Property } from "@mikro-orm/core";
import { Field, Int, ObjectType, registerEnumType, } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToOne, JoinColumn } from "typeorm";
import { Contract } from "./contract";

export enum MType{
    PRINCIPLE = "principle",
    ADVISOR = "advisor",
    DIRECTOR = "director"
}

registerEnumType(MType,{
    name: "MType",
    description: "Type of management"
})
@ObjectType()
@Entity()
export class Management extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    m_id!: number;

    @Field(() => MType)
    @Column({type: "enum", enum: MType, default: MType.ADVISOR})
    type: MType;

    @Field()
    @Column({type: "boolean"})
    status: boolean;

    @OneToOne(() => Contract)
    @JoinColumn()
    contract: Contract;
    
    @Field()
    @Column({type: "text"})
    name: string;

}