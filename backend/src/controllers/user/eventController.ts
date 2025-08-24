import { AuthRequest } from "../../middleware/authMiddleware.js";
import { UserRepository } from "../../repositories/userRepository.js";
import { UserEventService } from "../../services/user/eventservice.js";
import { Response } from "express"





class EventController{
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