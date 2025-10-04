import { Server } from "http";
import { IEvent } from "../../models/events.js";
import { IMyEvent } from "../../models/myEvents.js";
import { InstructorRepository } from "../../repositories/instructorRepository.js";
import { UserRepository } from "../../repositories/userRepository.js";


export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}

export class NotLiveError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotLiveError";
    }
}

export class EventFullError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "EventFullError";
    }
}



export class UserEventService {

    private userRepository: UserRepository;
    private instructorRepository: InstructorRepository;

    constructor(userRepository: UserRepository, instructorRepository: InstructorRepository) {
        this.userRepository = userRepository;
        this.instructorRepository = instructorRepository
    }

    getEventsRequest = async (): Promise<IEvent[] | null> => {
        try {
            const result = await this.userRepository.getEvents()

            return result
        } catch (error) {
            console.log(error);
            return null

        }
    }

    getIfEnrolled = async (id: string): Promise<IMyEvent | boolean | null> => {
        try {

            const result = await this.userRepository.getMyEvent(id)
            

            if (result) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log(error);
            return null
        }
    }

    getEventDetailsRequest = async (id: string): Promise<IEvent | null> => {
        try {
            const result = await this.instructorRepository.getEvent(id)
            console.log(result);
            

            if(!result){
                return null
            }

            // const user = await this.userRepository.getMyEvent(result._id : )
            return result
        } catch (error) {
            console.log(error);
            return null

        }
    }

    eventEnrollRequest = async (id: string, eventId: string): Promise<IMyEvent | null> => {
        try {
            const result = await this.userRepository.enrollEvent(id, eventId)
            return result
        } catch (error) {
            console.log(error);
            return null
        }
    }



    getMyEvents = async (userId: string): Promise<IEvent[] | null> => {
        try {
            const result = await this.userRepository.getMyEvents(userId)
            return result
        } catch (error) {
            console.log(error);
            return null

        }
    }

    

    joinUserEventRequest = async (eventId: string, userId: string): Promise<{ success: boolean; message: string; meetingLink?: string } | null> => {
        try {
            const myEvent = await this.userRepository.getMyEvent(eventId);
            // console.log(myEvent);
            

            if (!myEvent) return { success: false, message: "Event not found" };
            // if (myEvent.userId !== userId)
            //     return { success: false, message: "Not authorized" };

            const event = await this.instructorRepository.getEvent(eventId);
            if (!event) return { success: false, message: "Event not found" };

            if (!event.isLive)
                return { success: false, message: "Event has not started yet" };
            console.log(event);
            

            // if (!event.participantsList.includes(userId)) {
            //   event.participantsList.push(userId);
            //   event.participants += 1;
            //   await event.save();
            // }

           
                let meetingLink = event.meetingLink;
            

            // const meetingLink = event.meetingLink;
            const result: { success: boolean; message: string; meetingLink?: string } = meetingLink !== undefined
                ? { success: true, message: "Joined event", meetingLink }
                : { success: true, message: "Joined event" };

            
            // console.log(result);
            
            return result;

        } catch (error) {
            console.error(error);
            return null;
        }
    };


}