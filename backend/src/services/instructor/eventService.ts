import { IMyEventInterface } from "../../interfaces/instructorInterfaces.js";
import { IEvent } from "../../models/events.js";
import { IInsRepository } from "../../repositories/instructorRepository.js";



export class EventService {
    constructor(private InstructorRepository: IInsRepository) { }

    createEventRequest = async (id: string, data: any): Promise<IEvent | null> => {
        try {
            const instructor = await this.InstructorRepository.findById(id)
            if (!instructor || !instructor.name) {
                throw new Error("Instructor not found or has no name");
            }
            const event = await this.InstructorRepository.addEvent(id, instructor?.name, data)
            return event
        } catch (error) {
            console.log(error);
            return null
        }
    }

    getMyEventsRequest = async (id: string): Promise<IEvent[] | null> => {
        try {

            const events = await this.InstructorRepository.getMyEvents(id)
            return events
        } catch (error) {
            console.log(error);
            return null
        }
    }

    getEventRequest = async (id: string): Promise<IEvent | null> => {
        try {

            const event = await this.InstructorRepository.getEvent(id)
            return event
        } catch (error) {
            console.log(error);
            return null
        }
    }
}