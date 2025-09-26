import { Response } from "express"
import { InstAuthRequest } from "../../middleware/authMiddleware.js"
import { InstructorRepository } from "../../repositories/instructorRepository.js"
import { EventService } from "../../services/instructor/eventService.js"
import { Server } from "http"




export class EventController {
    private eventService: EventService

    constructor() {
        const repo = new InstructorRepository()
        this.eventService = new EventService(repo)
    }

    createEvents = async (req: InstAuthRequest, res: Response): Promise<void> => {
        try {
            const id = req.instructor?.id
            const data = { ...req.body.formData }
            console.log("event creation", data);


            const result = await this.eventService.createEventRequest(id, data)
            res.json({ success: true })
        } catch (error) {
            console.log(error);

        }
    }

    getMyEvents = async (req: InstAuthRequest, res: Response): Promise<void> => {
        try {
            const id = req.instructor?.id
            const result = await this.eventService.getMyEventsRequest(id)
            console.log(result)

            res.json({ success: true, events: result })
        } catch (error) {
            console.log(error);

        }
    }

    getEvent = async (req: InstAuthRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id!
            console.log("getEvent");
            
            console.log(id);
            const result = await this.eventService.getEventRequest(id)
            // console.log(result);

            res.json({ success: true, event: result })
        } catch (error) {
            console.log(error);

        }
    }

    editEvent = async (req: InstAuthRequest, res: Response): Promise<void> => {
        try {
            const id = req.params.id!
            const data = req.body

            if (!data.title || !data.description || !data.date || !data.topic) {
                res.status(400).json({
                    success: false,
                    message: "Title, description, and date are required",
                });
                return;
            }

            const eventDate = new Date(data.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (eventDate < today) {
                res.status(400).json({
                    success: false,
                    message: "Event date must be today or a future date",
                });
                return;
            }
            console.log(data, id);
            const result = await this.eventService.updateEventRequest(id, data)

            res.json({ success: true })

        } catch (error) {
            console.log(error);

        }
    }



    joinEvent = async (req: InstAuthRequest, res: Response) => {
        try {
            const instructorId = req.instructor?.id;
            const eventId = req.params.eventId!
            console.log('join event' , eventId , instructorId);
            

            if (!instructorId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const result = await this.eventService.joinEventRequest(eventId, instructorId);

            if (!result || !result.success) {
                return res.status(400).json({ message: result?.message || "Failed to start event" });
            }


            
            res.json({
                success: true,
                message: result.message,
                meetingLink: result.meetingLink,
                instructorId: instructorId
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    };


    endEvent = async (req: InstAuthRequest, res: Response) => {
        try {
            const instructorId = req.instructor?.id;
            const eventId = req.params.eventId!

            if (!instructorId) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const result = await this.eventService.endEventRequest(eventId, instructorId);

            if (!result || !result.success) {
                return res.status(400).json({ message: result?.message || "Failed to end event" });
            }

            res.json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Server error" });
        }
    };



}



