import { IEvent } from "../../models/events.js";
import { UserRepository } from "../../repositories/userRepository.js";


export class UserEventService {
    private userRepository: UserRepository

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
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
    
}