import { NextFunction, Response } from "express"
import { InstAuthRequest } from "../../middleware/authMiddleware"
import { HttpStatus } from "../../enums/httpStatus.enums"
import { IEventManageController, IEventParticipationController, IEventReadController } from "../../interfaces/instructorInterfaces"
import { IInstEventService } from "../../interfacesServices.ts/instructorServiceInterface"
import { mapEventToDTO } from "../../mapper/instructor.mapper"
import { IEvent } from "../../models/events"
import { StatusMessage } from "../../enums/statusMessage"
// import { InstEventService } from "../../services/instructor/eventService"




export class EventController implements
    IEventManageController,
    IEventReadController,
    IEventParticipationController {
    private _eventService: IInstEventService

    constructor(eventService: IInstEventService) {
        // const repo = new InstructorRepository()
        this._eventService = eventService
    }

    createEvents = async (req: InstAuthRequest, res: Response, next: NextFunction) => {
        try {
            const id = req.instructor?.id
            const data = { ...req.body.formData }


            await this._eventService.createEventRequest(id as string, data)
            res.status(HttpStatus.OK).json({ success: true })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    // getMyEvents = async (req: InstAuthRequest, res: Response,next: NextFunction) => {
    //     try {
    //         const id = req.instructor?.id
    //         const result = await this._eventService.getMyEventsRequest(id as string)
    //         console.log(result)

    //         res.json({ success: true, events: result })
    //     } catch (error) {
    //         console.log(error);

    //     }
    // }


    getAllEvents = async (req: InstAuthRequest, res: Response, next: NextFunction) => {
        try {
            const search = (req.query.query as string) || "";
            const page = (req.query.page as string) || "1";
            const id = req.instructor?.id;

            const result = await this._eventService.getMyEventsRequest(id as string, search, page);

            // console.log("dto -- -", result);
            const mappedEvents = result?.events?.map((event: IEvent) =>
                mapEventToDTO(event)
            ) || [];


            res.status(HttpStatus.OK).json({
                success: true,
                events: mappedEvents,
                totalPages: result?.totalPages || 1,
                currentPage: result?.currentPage || parseInt(page),
            });
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: StatusMessage.INTERNAL_SERVER_ERROR });
            next(error)
        }
    };


    getEvent = async (req: InstAuthRequest, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id!

            const result = await this._eventService.getEventRequest(id)
            const event = mapEventToDTO(result)
            console.log( event , result);
            

            res.status(HttpStatus.OK).json({ success: true, event: result })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    editEvent = async (req: InstAuthRequest, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id!
            const data = req.body

            if (!data.title || !data.description || !data.date || !data.topic) {
                res.status(400).json({
                    success: false,
                    message: StatusMessage.TITLE_DES_DATE,
                });
                return;
            }
            const eventDate = new Date(data.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (eventDate < today) {
                res.status(400).json({
                    success: false,
                    message: StatusMessage.EVENT_DATE_ERROR
                });
                return;
            }
            await this._eventService.updateEventRequest(id, data)

            res.status(HttpStatus.OK).json({ success: true })

        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    



    joinEvent = async (req: InstAuthRequest, res: Response, next: NextFunction) => {
        try {
            const instructorId = req.instructor?.id;
            const eventId = req.params.eventId!


            if (!instructorId) {
                res.status(HttpStatus.UNAUTHORIZED).json({ message: "Unauthorized" });
                return
            }

            const result = await this._eventService.joinEventRequest(eventId, instructorId);

            if (!result || !result.success) {
                res.status(HttpStatus.BAD_REQUEST).json({ message: result?.message || StatusMessage.FAILED_TO_START });
                return
            }



            res.status(HttpStatus.OK).json({
                success: true,
                message: result.message,
                meetingLink: result.meetingLink,
                instructorId: instructorId
            });
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
            next(error)
        }
    };


    endEvent = async (req: InstAuthRequest, res: Response, next: NextFunction) => {
        try {
            const instructorId = req.instructor?.id;
            const eventId = req.params.eventId!

            if (!instructorId) {
                res.status(401).json({ message: StatusMessage.UNAUTHORIZED });
                return
            }

            const result = await this._eventService.endEventRequest(eventId, instructorId);

            if (!result || !result.success) {
                res.status(400).json({ message: result?.message || StatusMessage.FAILED_TO_END });
                return
            }

            res.status(HttpStatus.OK).json({
                success: true,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
            next(error)
        }
    };



}



