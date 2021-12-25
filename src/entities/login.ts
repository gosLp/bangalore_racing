import {  Entity, PrimaryKey,  Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";


@ObjectType()
@Entity()
export class login  {

    @Field(() => Int)
    @PrimaryKey()
    id!: number;
    
    @Field()
    @Property({type: "text", unique: true})
    uname: string;

    
    @Property({type: "text"})
    password : string;
  
}