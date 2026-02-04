import { IMyEvent } from "../../models/myEvents";
import {  InstructorRepository } from "../../repositories/instructorRepository";
import { UserRepository } from "../../repositories/userRepository";
import { IUserEventService } from "../../interfacesServices.ts/userServiceInterfaces";
import { StatusMessage } from "../../enums/statusMessage";
import { mapEventDetailsToDto, mapEventToDTO } from "../../mapper/user.mapper";
import { EventDTO } from "../../dto/userDTO";
import { IUserRepository } from "../../interfaces/userInterfaces";
import { IInsRepository } from "../../interfacesServices.ts/instructorServiceInterface";


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



export class UserEventService implements IUserEventService {


    constructor(
        private userRepository: IUserRepository, 
        private instructorRepository: IInsRepository
    ) {}

    getEventsRequest = async (): Promise<EventDTO[] | null> => {
        try {
            const result = await this.userRepository.getEvents()
            console.log('events',result);
            if(!result) return null
            return result?.map(mapEventToDTO)
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

    getEventDetailsRequest = async (id: string): Promise<EventDTO | null> => {
        try {
            const result = await this.instructorRepository.getEvent(id)            
            if(!result){
                return null
            }
            return mapEventDetailsToDto(result)
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



    getMyEvents = async (userId: string): Promise<EventDTO[] | null> => {
        try {
            const result = await this.userRepository.getMyEvents(userId)
            if(!result) return null           
            return result.map(mapEventToDTO)
        } catch (error) {
            console.log(error);
            return null
        }
    }

    

    joinUserEventRequest = async (eventId: string, userId: string): Promise<{ success: boolean; message: string; meetingLink?: string } | null> => {
        try {
            const myEvent = await this.userRepository.getMyEvent(eventId);

            if (!myEvent) return { success: false, message: StatusMessage.NO_EVENT_FOUND };
            if (myEvent.userId !== userId)
                return { success: false, message: "Not authorized" };

            const event = await this.instructorRepository.getEvent(eventId);
            if (!event) return { success: false, message: StatusMessage.NO_EVENT_FOUND };

            if (!event.isLive)
                return { success: false, message: StatusMessage.EVENT_NOT_STARTED };


            const meetingLink = event.meetingLink

            const result: { success: boolean; message: string; meetingLink?: string } = meetingLink !== undefined
                ? { success: true, message: StatusMessage.EVENT_JOINED, meetingLink }
                : { success: true, message: StatusMessage.EVENT_JOINED };
                  
            return result;

        } catch (error) {
            console.error(error);
            return null;
        }
    };


}