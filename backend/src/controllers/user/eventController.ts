import { AuthRequest } from "../../middleware/authMiddleware.js";
import { UserRepository } from "../../repositories/userRepository.js";
import { Response } from "express"
import { UserEventService } from "../../services/user/eventService.js";





export class UserEventController{
    private userEventService : UserEventService;

    constructor(){
        const repo =new UserRepository()
        this.userEventService = new UserEventService(repo)
    }

    getEvents = async (req:AuthRequest , res:Response ):Promise<void | null>=>{
        try {
            const result = await this.userEventService.getEventsRequest()

            res.json({success:true , events : result})
        } catch (error) {
            console.log(error);
            
        }
    }



}