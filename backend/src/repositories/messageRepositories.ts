
import { IInstructor, InstructorModel } from "../models/instructor.js";
import { IMessage, MessageModel } from "../models/message.js";
import { IUser, UserModel } from "../models/user.js";



export interface IMessageRepository {

  getInstructors(userId : string ):Promise<IInstructor[]>

  createMessage(senderId: string, receiverId: string, text: string): Promise<IMessage>

  getMessages(userId: string, receiverId: string): Promise<IMessage[]>

  getUsers(instructorId:string):Promise<IUser[]>

}

export class MessageRepository implements IMessageRepository {


  async getInstructors(userId : string ):Promise<IInstructor[]>{
    const instructorIds = await MessageModel.distinct("instructorId", { userId });

     return await InstructorModel.find(
      { _id: { $in: instructorIds } },
      { name: 1, avatar: 1 } 
    );
  }

  async createMessage(userId: string, instructorId: string, text: string) {
    const message = new MessageModel({ userId, instructorId, text });
    return message.save();
  }


  async getMessages(userId: string, instructorId: string): Promise<IMessage[]> {
    return MessageModel.find({
      $or: [
        { userId, instructorId },
        { userId: userId, instructorId: instructorId },
      ],
    }).sort({ timestamp: 1 });
  }

  async getUsers(instructorId:string):Promise<IUser[]>{
    const studentIds = await MessageModel.distinct("userId", { instructorId });

    const students = await UserModel.find({ _id: { $in: studentIds } })
      .select("_id name"); 

      return students
  }

}
