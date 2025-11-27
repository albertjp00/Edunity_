import { ILastMessage, IMessagedInstructor } from "../interfaces/instructorInterfaces";
import { IInstructor } from "../models/instructor";
import { IMessage } from "../models/message";


export interface IMessageService {
  getInstructor(instructorId: string, userId: string): Promise<IMessagedInstructor | null>;
  getInstructorToMessage(instructorId: string): Promise<IInstructor | null>;
  getInstructors(userId: string): Promise<IMessagedInstructor[]>;
  getUnreadMessages(userId: string, instructorId: string): Promise<ILastMessage | null>;
  sendMessage(senderId: string, receiverId: string, text: string, file: string | null): Promise<IMessage>;
  getChatHistory(userId: string, receiverId: string): Promise<IMessage[]>;
  markMessagesAsRead(senderId: string, receiverId: string): Promise<boolean>;
  getStudents(instructorId: string): Promise<any>; // replace 'any' if you know the model type
  getMessages(instructorId: string, receiverId: string): Promise<IMessage[]>;
  sendInstructorMessage(instructorId: string, receiverId: string, text: string, file: string | null): Promise<IMessage>;
}
