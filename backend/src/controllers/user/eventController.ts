import { AuthRequest } from "../../middleware/authMiddleware";
import { NextFunction, Response } from "express";
import {
  IUserEventEnrollmentController,
  IUserEventJoinController,
  IUserEventReadController,
} from "../../interfaces/userInterfaces";
import { HttpStatus } from "../../enums/httpStatus.enums";
import { IUserEventService } from "../../interfacesServices.ts/userServiceInterfaces";
import { StatusMessage } from "../../enums/statusMessage";

export class UserEventController
  implements
    IUserEventReadController,
    IUserEventEnrollmentController,
    IUserEventJoinController
{
  private _userEventService: IUserEventService;

  constructor(userEventService: IUserEventService) {
    this._userEventService = userEventService;
  }

  getEvents = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void | null> => {
    try {
      const result = await this._userEventService.getEventsRequest();

      res.status(HttpStatus.OK).json({ success: true, events: result });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getEventDetails = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void | null> => {
    try {
      const id = req.params.id!;
      const enrolled = await this._userEventService.getIfEnrolled(id);
      const result = await this._userEventService.getEventDetailsRequest(id);

      res
        .status(HttpStatus.OK)
        .json({ success: true, event: result, enrolled: enrolled });
    } catch (error) {
      console.log(error)
      next(error);
    }
  };

  enrollEvent = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void | null> => {
    try {
      const id = req.user?.id as string;
      const eventId = req.params.id;

      if (!eventId) {
        res
          .status(400)
          .json({ success: false, message: StatusMessage.NO_EVENT_ID });
        return;
      }
      await this._userEventService.eventEnrollRequest(id, eventId);

      res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getMyEvents = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id as string;

      const events = await this._userEventService.getMyEvents(userId);

      res.status(HttpStatus.OK).json({ success: true, events: events });
    } catch (error) {
      console.log(error);
    }
  };

  joinUserEvent = async (
    req: AuthRequest,
    res: Response,
  ): Promise<void | null> => {
    try {
      const userId = req.user?.id as string;
      const eventId = req.params.eventId!;

      const result = await this._userEventService.joinUserEventRequest(
        eventId,
        userId,
      );

      if (!result || !result.success) {
        res
          .status(400)
          .json({ message: result?.message || StatusMessage.FAILED_TO_START });
        return;
      }

      res.status(HttpStatus.OK).json({ result, userId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
    }
  };
}
