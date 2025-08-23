import { IEvent } from "../../models/events.js";
import { IInsRepository } from "../../repositories/instructorRepository.js";



export class EventService{
    constructor(private InstructorRepository : IInsRepository){}

    createEventRequest = async(id:string , data : any):Promise<IEvent | null> =>{
        try {
            const event = await this.InstructorRepository.addEvent(id,data)
            return event
        } catch (error) {
            console.log(error);
            return null
        }
    }
}