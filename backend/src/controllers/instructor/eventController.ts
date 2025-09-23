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
            console.log(id);
            const result = await this.eventService.getEventRequest(id)
            console.log(result);

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

    // joinEvent = async (req: InstAuthRequest, res: Response) => {
    //     try {
    //         const { id } = req.params;
    //         const event = await Event.findByIdAndUpdate(
    //             id,
    //             { isLive: true },
    //             { new: true }
    //         );
    //         if (!event) return res.status(404).json({ message: "Event not found" });

    //         res.json({ success: true, event });
    //     } catch (error) {
    //         res.status(500).json({ message: "Failed to start session", error });
    //     }
    // };



    startSession = async (req: InstAuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const io = req.app.get("io") as Server | undefined;

            const event = await this.eventService.startEvent(id as string, io);

            return res.json({ success: true, event });
        } catch (err: any) {
            // if (err instanceof this.eventService.NotFoundError) {
            //     return res.status(404).json({ success: false, message: err.message });
            // }
            if (err) {
                return res.json({ success: false, message: err.message });
            }
            console.error("startSession error:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to start session",
                error: err?.message || err,
            });
        }
    }



    endSession = async (req: InstAuthRequest, res: Response) => {
        try {
            const { id } = req.params;
            const io = req.app.get("io") as Server | undefined;

            const event = await this.eventService.endEvent(id as string, io);

            return res.json({ success: true, event });
        } catch (err: any) {
            // if (err instanceof this.eventService.NotFoundError) {
            //     return res.status(404).json({ success: false, message: err.message });
            // }
            if (err) {
                return res.json({ success: false, message: err.message });
            }
            console.error("endSession error:", err);
            return res.status(500).json({
                success: false,
                message: "Failed to end session",
                error: err?.message || err,
            });
        }
    };



} 