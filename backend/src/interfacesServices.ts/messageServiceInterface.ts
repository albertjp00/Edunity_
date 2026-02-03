import { MessagedStudentsDTO } from "../dto/instructorDTO";
import { MessageDTO } from "../dto/userDTO";
import { ILastMessage, IMessagedInstructor } from "../interfaces/instructorInterfaces";
import { IInstructor } from "../models/instructor";
import { IMessage } from "../models/message";


export interface IMessageService {
  getInstructor(instructorId: string, userId: string): Promise<IMessagedInstructor | null>;

  getInstructorToMessage(instructorId: string): Promise<IInstructor | null>;

  getInstructors(userId: string): Promise<IMessagedInstructor[]>;

  getUnreadMessages(userId: string, instructorId: string): Promise<ILastMessage | null>;

  sendMessage(senderId: string, receiverId: string, text: string, file: string | null): Promise<IMessage>;

  getChatHistory(userId: string, receiverId: string): Promise<MessageDTO[]>;

  markMessagesAsRead(senderId: string, receiverId: string): Promise<boolean>;

  getStudents(instructorId: string): Promise<MessagedStudentsDTO[] | null>;

  getMessages(instructorId: string, receiverId: string): Promise<MessageDTO[] | null>;

  sendInstructorMessage(instructorId: string, receiverId: string, text: string, file: string | null): Promise<IMessage>;
}
