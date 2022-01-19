import { Entity,Column, PrimaryGeneratedColumn, BaseEntity  } from "typeorm";
import { Field, Int, ObjectType } from "type-graphql";


@ObjectType()
@Entity()
export class login extends BaseEntity {

    @Field(() => Int)
    @PrimaryGeneratedColumn()
    id!: number;
    
    @Field()
    @Column({ unique: true})
    uname: string;

    
    @Column({type: "text"})
    password : string;
  
}