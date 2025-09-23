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

            return result
        } catch (error) {
            console.log(error);
            return null

        }
    }

    eventEnrollRequest = async (id: string, eventId: string): Promise<void> => {
        try {
            const result = await this.userRepository.enrollEvent(id, eventId)
        } catch (error) {
            console.log(error);

        }
    }

    joinEvent = async (eventId: string,userId: string,io?: Server): Promise<IEvent> => {
        const existing = await this.userRepository.findById(eventId);
        if (!existing) throw new NotFoundError("Event not found");

        if (!existing.isLive) {
            throw new NotLiveError("Event is not live");
        }

        if (
            existing.maxParticipants &&
            existing.participants >= existing.maxParticipants
        ) {
            throw new EventFullError("Event is full");
        }

        const updated = await this.userRepository.addParticipant(eventId, userId);
        if (!updated) throw new Error("Failed to update participants");

        // Notify instructor & others
        if (io) {
            io.to(eventId).emit("user-joined", { eventId, userId });
        }

        return updated;
    };

}