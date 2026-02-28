import {
    IEventDetailsService,
  IEventResultService,
} from "../../interfaces/instructorInterfaces";
import { IEvent } from "../../models/events";
import { IInsRepository, IInstEventService } from "../../interfacesServices.ts/instructorServiceInterface";
import { mapEventDetailsDTO, mapEventsDTO } from "../../mapper/instructor.mapper";

export class InstEventService implements IInstEventService {
  constructor(private _InstructorRepository: IInsRepository) {}

  createEventRequest = async (
    id: string,
    data: Partial<IEvent>,
  ): Promise<IEvent | null> => {
    try {
      const instructor = await this._InstructorRepository.findById(id);
      if (!instructor || !instructor.name) {
        throw new Error("Instructor not found or has no name");
      }

      console.log("event add",data)
      const date = data.date!
      
      const eventCount = await this._InstructorRepository.getEventCount(id , date)
      console.log("event count ",eventCount);
      

      const event = await this._InstructorRepository.addEvent(
        id,
        instructor?.name,
        data,
      );
      return event;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getMyEventsRequest = async (
    id: string,
    search: string,
    page: string,
  ): Promise<IEventResultService | null> => {
    try {
      const result = await this._InstructorRepository.getMyEvents(
        id,
        search,
        page,
      );
      if (!result) return null;
      return {
        events: result?.events?.map(mapEventsDTO),
        totalPages: result?.totalPages,
        currentPage: result?.currentPage,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getEventRequest = async (id: string): Promise<IEventDetailsService | null> => {
    try {
      const event = await this._InstructorRepository.getEvent(id);
      if (!event) return null;

      const now = new Date();

      const eventDate = new Date(event.date);
      const [hourStr, minuteStr] = event.time.split(":");

    //   if (!hourStr || !minuteStr) return event;

      const eventDateTime = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate(),
        Number(hourStr),
        Number(minuteStr),
        0,
        0,
      );

      // if (now >= eventDateTime && !event.isLive && !event.isOver) {
      //   await this._InstructorRepository.updateEvent(event._id.toString(), {
      //     isLive: true,
      //   });

      //   event.isLive = true;
      // }      

      return {event :mapEventDetailsDTO(event)}
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  updateEventRequest = async (
    id: string,
    data: Partial<IEvent>,
  ): Promise<IEvent | null> => {
    try {
      const event = await this._InstructorRepository.updateEvent(id, data);
      return event;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  joinEventRequest = async (
    eventId: string,
    instructorId: string,
  ): Promise<{
    success: boolean;
    message: string;
    meetingLink?: string;
  } | null> => {
    try {
      const event = await this._InstructorRepository.getEvent(eventId);

      

      if (!event) {
        return { success: false, message: "Event not found" };
      }

      if (event.instructorId !== instructorId) {
        return { success: false, message: "Not authorized" };
      }

      const meetingLink =
        event.meetingLink ||
        `${process.env.FRONTEND_URL}/joinEvent/${event._id}`;

      await this._InstructorRepository.updateEvent(eventId, {
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
    instructorId: string,
  ): Promise<{ success: boolean; message: string } | null> => {
    try {
      const event = await this._InstructorRepository.getEvent(eventId);

      if (!event) {
        return { success: false, message: "Event not found" };
      }

      if (event.instructorId !== instructorId) {
        return { success: false, message: "Not authorized" };
      }

      await this._InstructorRepository.updateEvent(eventId, {
        isLive: false,
        meetingLink: '',
        isOver: true,
      });

      return { success: true, message: "Event ended successfully" };
    } catch (error) {
      console.error(error);
      return null;
    }
  };
}
