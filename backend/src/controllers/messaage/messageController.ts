import { NextFunction, Response } from "express";
import { AuthRequest, InstAuthRequest } from "../../middleware/authMiddleware";
import { HttpStatus } from "../../enums/httpStatus.enums";
import {
  BaseMessageController,
  InstructorMessageController,
  MessageReadController,
  UserMessageController,
} from "../../interfaces/messageInterfaces";
import { IMessageService } from "../../interfacesServices.ts/messageServiceInterface";
import { StatusMessage } from "../../enums/statusMessage";
// import { MessageService } from "../../services/message/messageService";

export class MessageController
  implements
    BaseMessageController,
    UserMessageController,
    InstructorMessageController,
    MessageReadController
{
  private _messageService: IMessageService;

  constructor(messageService: IMessageService) {
    // const repo = new MessageRepository();
    this._messageService = messageService;
  }

  getInstructor = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { instructorId } = req.params;
      const userId = req.user?.id;
      const instructor = await this._messageService.getInstructor(
        instructorId as string,
        userId as string,
      );
      console.log("message instructor", instructor);

      res.status(HttpStatus.OK).json({ success: true, instructor: instructor });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  // controller
  getInstructorToMessage = async (
    req: AuthRequest,
    res: Response,
  ) => {
    try {
      const { id } = req.params;
      const instructor = await this._messageService.getInstructorToMessage(
        id as string,
      );
      if (!instructor) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({
            success: false,
            message: StatusMessage.INSTRUCTOR_NOT_FOUND,
          });
        return;
      }

      res.status(HttpStatus.OK).json({
        success: true,
        instructor: {
          id: instructor._id,
          name: instructor.name,
          avatar: instructor.profileImage,
        },
      });
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: StatusMessage.FAILED_TO_FETCH_DATA });
    }
  };

  getMessagedInstructors = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      const result = await this._messageService.getInstructors(userId as string);
      res.status(HttpStatus.OK).json({ data: result, userId });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getUnreadMessages = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.user?.id;
      const { instructorId } = req.params!;
      const result = await this._messageService.getUnreadMessages(
        userId as string,
        instructorId as string,
      );
      res.status(HttpStatus.OK).json({ success: true, message: result });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  sendMessage = async (req: AuthRequest, res: Response) => {
    try {
      const { receiverId, text = "" } = req.body;
      const userId = req.user?.id as string;

      const file = req.file ? req.file.filename : "";

      const message = await this._messageService.sendMessage(
        userId,
        receiverId,
        text,
        file,
      );

      res.status(201).json({ success: true, message });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, error: StatusMessage.FAILED_TO_SEND_MESSAGE });
    }
  };

  getChatHistory = async (
    req: AuthRequest,
    res: Response,
  ) => {
    try {
      const { receiverId } = req.params;

      const userId = req.user?.id;

      const messages = await this._messageService.getChatHistory(
        userId as string,
        receiverId as string,
      );

      res.status(HttpStatus.OK).json({ success: true, messages });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, error: StatusMessage.FAILED_TO_FETCH_DATA });
    }
  };

  // Instructor side -------------------------------

  getMessagedStudents = async (
    req: InstAuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const instructorId = req.instructor?.id;

      const result = await this._messageService.getStudents(
        instructorId as string,
      );
      res
        .status(HttpStatus.OK)
        .json({ success: true, students: result, instructorId });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getMessages = async (
    req: InstAuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { receiverId } = req.params;

      const instructorId = req.instructor?.id;

      const messages = await this._messageService.getMessages(
        instructorId as string,
        receiverId as string,
      );

      res
        .status(HttpStatus.OK)
        .json({ success: true, messages: messages, instructorId });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  sendInstructorMessage = async (
    req: InstAuthRequest,
    res: Response,
  ) => {
    try {
      const { text } = req.body;

      const file = req.file ? req.file.filename : null;
      const receiverId = req.params.receiverId!;
      const instructorId = req.instructor?.id as string;
      const message = await this._messageService.sendInstructorMessage(
        instructorId,
        receiverId,
        text,
        file,
      );

      res.status(HttpStatus.OK).json({ success: true, message });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, error: StatusMessage.FAILED_TO_SEND_MESSAGE });
    }
  };

  markAsRead = async (senderId: string, receiverId: string) => {
    try {
      await this._messageService.markMessagesAsRead(senderId, receiverId);
    } catch (error) {
      console.log(error);
    }
  };
}
