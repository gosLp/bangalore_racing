import { Resolver, Query } from "type-graphql";

@Resolver()
export class HelloResolvers {
    @Query(()=> String)
    hello(){
        return "bye"
    }
}