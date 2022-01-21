import { Mechanic, Parts } from '../entities/mechanic';
import { Connection, EntitySubscriberInterface, getConnection, InsertEvent } from 'typeorm';
import { Car } from '../entities/car';

export class MechanicSubscriber implements EntitySubscriberInterface<Mechanic>{


    listenTo(){
        return Mechanic
    }

    async afterInsert(event: InsertEvent<Mechanic>){
        console.log('After Entity insert', event);
        console.log('car of mechanic is :', event.entity.car);

        // const car = await Car.findOne({where: {car_id: event.entity.car.car_id}, relations:['mechanic'] })
        // let partCount = {
        //     "aero":0,
        //     "chasis":0,
        //     "crew":0,
        //     "engine":0
        // }
        // if(car){
            
        //     car.mechanic.map((m) =>{
        //         if(m.part === Parts.AERO){
        //             partCount.aero +=1;
        //         }
        //         else if(m.part === Parts.CHASIS){
        //             partCount.chasis+=1;
        //         }
        //         else if(m.part === Parts.CREW){
        //             partCount.crew +=1;
        //         }
        //         else if(m.part === Parts.ENGINE){
        //             partCount.engine +=1;
        //         }
        //     });

        //  event.entity.part = Parts.CREW; 

        // }
    }
}