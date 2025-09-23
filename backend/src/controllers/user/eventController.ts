import { AuthRequest } from "../../middleware/authMiddleware";
import { UserRepository } from "../../repositories/userRepository";
import { Response } from "express"
import { UserEventService } from "../../services/user/eventService";
import { InstructorRepository } from "../../repositories/instructorRepository";





export class UserEventController {
    private userEventService: UserEventService;

    constructor() {
        const repo = new UserRepository()
        const Irepo = new InstructorRepository()
        this.userEventService = new UserEventService(repo, Irepo)

    }

    getEvents = async (req: AuthRequest, res: Response): Promise<void | null> => {
        try {
            const result = await this.userEventService.getEventsRequest()

            res.json({ success: true, events: result })
        } catch (error) {
            console.log(error);

        }
    }

    getEventDetails = async (req: AuthRequest, res: Response): Promise<void | null> => {
        try {
            const id = req.params.id!
            const enrolled = await this.userEventService.getIfEnrolled(id)
            const result = await this.userEventService.getEventDetailsRequest(id)
            // console.log(enrolled ,result);
            
            res.json({ success: true, event: result , enrolled:enrolled})
        } catch (error) {
            console.log(error);

        }
    }

    enrollEvent = async (req: AuthRequest, res: Response): Promise<void | null> => {
        try {
            const id = req.user?.id!
            const eventId = req.params.id
            if (!eventId) {
                res.status(400).json({ success: false, message: "event Id missing" });
                return;
            }
            const result = await this.userEventService.eventEnrollRequest(id, eventId)

            res.json({ success: true })
        } catch (error) {
            console.log(error);
        }
    }



}