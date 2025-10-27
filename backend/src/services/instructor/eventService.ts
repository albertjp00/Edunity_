import { Server } from "http";
import { IMyEventInterface } from "../../interfaces/instructorInterfaces.js";
import { IEvent } from "../../models/events.js";
import { NextFunction } from "express";
import { IInsRepository } from "../../repositories/instructorRepository.js";



export class InstEventService {
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


    joinEventRequest = async (
        eventId: string,
        instructorId: string
    ): Promise<{ success: boolean; message: string, meetingLink?: string } | null> => {
        try {
            const event = await this.InstructorRepository.getEvent(eventId);

            if (!event) {
                return { success: false, message: "Event not found" };
            }

            if (event.instructorId !== instructorId) {
                return { success: false, message: "Not authorized" };
            }

            // ✅ update in repo
            const meetingLink =
                event.meetingLink || `${process.env.FRONTEND_URL}/joinEvent/${event._id}`;

            await this.InstructorRepository.updateEvent(eventId, {
                isLive: true,
                meetingLink,
            });

            return { success: true, message: "Event started", meetingLink };
        } catch (error) {
            console.error(error);
            return null;
        }
    };


    endEventRequest = async (
        eventId: string,
        instructorId: string
    ): Promise<{ success: boolean; message: string } | null> => {
        try {
            const event = await this.InstructorRepository.getEvent(eventId);

            if (!event) {
                return { success: false, message: "Event not found" };
            }

            if (event.instructorId !== instructorId) {
                return { success: false, message: "Not authorized" };
            }

            await this.InstructorRepository.updateEvent(eventId, {
                isLive: false,
                meetingLink: undefined,
            });

            return { success: true, message: "Event ended successfully" };
        } catch (error) {
            console.error(error);
            return null;
        }
    };


}