import {  Entity, PrimaryKey,  Property } from "@mikro-orm/core";

@Entity()
export class login  {

    @PrimaryKey()
    id!: number;
    
    @Property()
    uname: string;

    @Property()
    password : string;
  
}