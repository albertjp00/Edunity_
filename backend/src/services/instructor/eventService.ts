import { Server } from "http";
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

    updateEventRequest = async (id: string, data: any): Promise<IEvent | null> => {
        try {

            const event = await this.InstructorRepository.updateEvent(id, data)
            return event
        } catch (error) {
            console.log(error);
            return null
        }
    }

    startEvent = async (
        eventId: string,
        io?: Server
    ): Promise<IEvent> => {
        const existing = await this.InstructorRepository.findById(eventId);
        if (!existing) throw new Error("Event not found");

        if (existing.isLive) {
            throw new Error("Event already live");
        }

        const updated = await this.InstructorRepository.startEventById(eventId);
        if (!updated) throw new Error("Failed to update event");

        // Notify all potential listeners that event went live
        if (io) {
            io.emit("event-started", { eventId: updated._id, title: updated.title });
        }

        return updated;
    };

    endEvent = async (
        eventId: string,
        io?: Server
    ): Promise<IEvent | null> => {
        try {
            const existing = await this.InstructorRepository.findById(eventId);
        if (!existing) throw new Error("Event not found");

        if (!existing.isLive) {
            throw new Error("Event is not live");
        }

        const updated = await this.InstructorRepository.endEventById(eventId);
        if (!updated) throw new Error("Failed to update event");

        // Notify all participants in this room
        if (io) {
            io.to(eventId).emit("session-ended", { eventId });
        }

        return updated;
        } catch (error) {
            console.log(error);
            return null
        }
    };
}