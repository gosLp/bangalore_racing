// import {  Entity, ManyToOne, OneToOne, PrimaryKey,  Property } from "@mikro-orm/core";
import { Field, Int, ObjectType, registerEnumType, } from "type-graphql";
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany } from "typeorm";
import { Driver } from "./driver";
import { Mechanic } from "./mechanic";
import { Revenue } from "./revenue";



export enum EngineParts {
    OLD = "old",
    USED = "used",
    NEW = "new"
}

registerEnumType(EngineParts, {
    name: "EngineParts",
    description: "Age of the parts in the car"
})

@ObjectType()
@Entity({name: 'car', schema: 'public'})
export class Car extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    car_id!: number;

    @Field(() => String)
    @Column({unique: true})
    engineSupplier: string;

    @Field()
    @Column({
        type: "enum",
        enum: EngineParts,
        default: EngineParts.NEW
    })
    front: EngineParts;
    
    @Field()
    @Column({type: "boolean"})
    isActiveCar: boolean;

    @Field()
    @Column()
    driverId: number;

    @Field()
    @ManyToOne(() =>Driver, driver => driver.car)
    driver: Driver

    @OneToMany(() => Mechanic, mechanic => mechanic.car)
    mechanic: Mechanic[];

    @OneToMany(() => Revenue, revenue => revenue.car)
    revenue: Revenue[];

    @Field()
    @Column({type:"enum", enum: EngineParts, default: EngineParts.NEW})
    E_condition: EngineParts

    @Field()
    @Column({type:"enum", enum: EngineParts, default: EngineParts.NEW})
    rear: EngineParts

    @Field()
    @Column({type:"enum", enum: EngineParts, default: EngineParts.NEW})
    chasis: EngineParts
    
}