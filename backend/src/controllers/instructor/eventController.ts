import { Response } from "express"
import { InstAuthRequest } from "../../middleware/authMiddleware.js"
import { InstructorRepository } from "../../repositories/instructorRepository.js"
import { EventService } from "../../services/instructor/eventService.js"




export class EventController{
    private eventService : EventService

    constructor(){
        const repo = new InstructorRepository()
        this.eventService = new EventService(repo)
    }

    createEvents = async(req : InstAuthRequest , res : Response):Promise<void>=>{
        try {
            const id = req.instructor?.id
            const data = {  ...req.body.formData }
            console.log("event creation",data);

            
            const result = await this.eventService.createEventRequest(id , data)
        } catch (error) {
            console.log(error);
            
        }
    }

    getMyEvents = async(req:InstAuthRequest , res:Response):Promise<void>=>{
        try {
            const id = req.instructor?.id
            const result = await this.eventService.getMyEventsRequest(id)
            // console.log(result)
            
            res.json({success:true , events:result})
        } catch (error) {
            console.log(error);
            
        }
    }
} 