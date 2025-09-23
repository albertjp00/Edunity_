import { AuthRequest } from "../../middleware/authMiddleware";
import { UserRepository } from "../../repositories/userRepository";
import { NextFunction, Response } from "express"
import { EventFullError, NotFoundError, NotLiveError, UserEventService } from "../../services/user/eventService.js";
import { InstructorRepository } from "../../repositories/instructorRepository.js";
import { Server } from "http";





export class UserEventController {
    private userEventService: UserEventService;

    constructor() {
        const repo = new UserRepository()
        const Irepo = new InstructorRepository()
        this.userEventService = new UserEventService(repo, Irepo)

    }

    getEvents = async (req: AuthRequest, res: Response, next : NextFunction): Promise<void | null> => {
        try {
            const result = await this.userEventService.getEventsRequest()

            res.json({ success: true, events: result })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    getEventDetails = async (req: AuthRequest, res: Response, next : NextFunction): Promise<void | null> => {
        try {
            const id = req.params.id!
            const enrolled = await this.userEventService.getIfEnrolled(id)
            const result = await this.userEventService.getEventDetailsRequest(id)
            // console.log(enrolled ,result);

            res.json({ success: true, event: result, enrolled: enrolled })
        } catch (error) {
            // console.log(error);
            next(error)

        }
    }

    enrollEvent = async (req: AuthRequest, res: Response, next : NextFunction): Promise<void | null> => {
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
            // console.log(error);
            next(error)
        }
    }


    joinSession = async (req: AuthRequest, res: Response , next : NextFunction) => {
        try {
            const { id } = req.params; // eventId
            const  userId = req.user?.id! 
            const io = req.app.get("io") as Server | undefined;

            const event = await this.userEventService.joinEvent(id as string, userId, io);

            return res.json({ success: true, event });
        } catch (err: any) {
            if (err instanceof NotFoundError) {
                return res.status(404).json({ success: false, message: err.message });
            }
            if (err instanceof NotLiveError) {
                return res.status(400).json({ success: false, message: err.message });
            }
            if (err instanceof EventFullError) {
                return res.status(400).json({ success: false, message: err.message });
            }
            // console.error("joinSession error:", err);
            next(err)
            return res.status(500).json({
                success: false,
                message: "Failed to join session",
                error: err?.message || err,
            });
        }
    };



}