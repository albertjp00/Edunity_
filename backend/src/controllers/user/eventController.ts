import { AuthRequest } from "../../middleware/authMiddleware.js";
import { UserRepository } from "../../repositories/userRepository.js";
import { NextFunction, Response } from "express"
import { EventFullError, NotFoundError, NotLiveError, UserEventService } from "../../services/user/eventService.js";
import { InstructorRepository } from "../../repositories/instructorRepository.js";
import { Server } from "http";
import { log } from "console";
import logger from "../../utils/logger.js";






export class UserEventController {
    private _userEventService: UserEventService;

    constructor() {
        const repo = new UserRepository()
        const Irepo = new InstructorRepository()
        this._userEventService = new UserEventService(repo, Irepo)

    }

    getEvents = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void | null> => {
        try {
            const result = await this._userEventService.getEventsRequest()
            console.log(result);
            

            res.json({ success: true, events: result })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    getEventDetails = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void | null> => {
        try {
            const id = req.params.id!
            const enrolled = await this._userEventService.getIfEnrolled(id)
            const result = await this._userEventService.getEventDetailsRequest(id)
            // console.log(enrolled ,result); 

            res.json({ success: true, event: result, enrolled: enrolled })
        } catch (error) {
            // console.log(error);
            next(error)
        }
    }



    enrollEvent = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void | null> => {
        try {
            const id = req.user?.id!
            const eventId = req.params.id
            logger.info('enroll events ',id , eventId )
            if (!eventId) {
                res.status(400).json({ success: false, message: "event Id missing" });
                return;
            }
            const result = await this._userEventService.eventEnrollRequest(id, eventId)
            console.log('enrolled event ',result)

            res.json({ success: true })
        } catch (error) {
            // console.log(error);
            next(error)
        }
    }

    getMyEvents = async(req:AuthRequest , res : Response)=>{
        try {
            // logger.info('getting my eventss ')
            const userId = req.user?.id!
            console.log(userId);
            
            const events = await this._userEventService.getMyEvents(userId)
            logger.info('evetnssss',events)
            console.log(events);
            
            res.json({success : true , events : events})
        } catch (error) {
            console.log(error);
            
        }
    }


    joinUserEvent = async (req: AuthRequest, res: Response) => {
        try {
            const userId = req.user?.id!
            const eventId = req.params.eventId!;
            console.log('join event', eventId, userId);

            // if (!userId) {
            //     return res.status(401).json({ message: "Unauthorized" });
            // }

            const result = await this._userEventService.joinUserEventRequest(eventId, userId);

            if (!result || !result.success) {
                return res.status(400).json({ message: result?.message || "Failed to start event" });
            }

            // console.log('result', result);

            // ✅ Only include meetingLink if it exists
            // const response: { success: boolean; message: string; meetingLink?: string } = {
            //     success: true,
            //     message: result.message,
            // };
            // if (result.meetingLink) {
            //     response.meetingLink = result.meetingLink;
            // }

            res.json({result , userId}); 
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    };




}