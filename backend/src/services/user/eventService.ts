import { IEvent } from "../../models/events.js";
import { IMyEvent } from "../../models/myEvents.js";
import { InstructorRepository } from "../../repositories/instructorRepository.js";
import { UserRepository } from "../../repositories/userRepository.js";


export class UserEventService {
    
    private userRepository: UserRepository;
    private instructorRepository : InstructorRepository;

    constructor(userRepository: UserRepository , instructorRepository : InstructorRepository) {
        this.userRepository = userRepository;
        this.instructorRepository = instructorRepository
    }

    getEventsRequest = async():Promise<IEvent[] | null>=>{
        try {
            const result = await this.userRepository.getEvents()
        
            return result
        } catch (error) {
            console.log(error);
            return null
            
        }
    }

    getIfEnrolled = async(id :string):Promise<IMyEvent | boolean | null>=>{
        try {
            
            const result = await this.userRepository.getMyEvent(id)
            
            if(result){
                return true
            }else{
                return false
            }
        } catch (error) {
            console.log(error);
            return null
        }
    }

    getEventDetailsRequest = async(id :string):Promise<IEvent | null>=>{
        try {
            const result = await this.instructorRepository.getEvent(id)
        
            return result
        } catch (error) {
            console.log(error);
            return null
            
        }
    }

    eventEnrollRequest = async(id:string , eventId : string):Promise<void>=>{
        try {
            const result = await this.userRepository.enrollEvent(id, eventId)
        } catch (error) {
            console.log(error);
            
        }
    }
    
}