import { Request, Response } from "express";
import { AuthRequest, InstAuthRequest } from "../middleware/authMiddleware";

export interface BaseMessageController {
  sendMessage(req: AuthRequest, res: Response): Promise<void>;
  getChatHistory(req: AuthRequest, res: Response): Promise<void>;
}





export interface UserMessageController {
  getInstructor(req: AuthRequest, res: Response): Promise<void>;
  getInstructorToMessage(req: AuthRequest, res: Response): Promise<void>;
  getMessagedInstructors(req: AuthRequest, res: Response): Promise<void>;
  getUnreadMessages(req: AuthRequest, res: Response): Promise<void>;
}



export interface InstructorMessageController {
  getMessagedStudents(req: InstAuthRequest, res: Response): Promise<void>;
  getMessages(req: InstAuthRequest, res: Response): Promise<void>;
  sendInstructorMessage(req: InstAuthRequest, res: Response): Promise<void>;
}



export interface MessageReadController {
  markAsRead(senderId: string, receiverId: string): Promise<void>;
}
