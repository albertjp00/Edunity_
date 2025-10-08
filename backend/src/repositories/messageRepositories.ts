
import { IMessagedInstructor } from "../interfaces/instructorInterfaces.js";
import { IMessagedUser } from "../interfaces/userInterfaces.js";
import { IInstructor, InstructorModel } from "../models/instructor.js";
import { IMessage, MessageModel } from "../models/message.js";
import { IUser, UserModel } from "../models/user.js";



export interface IMessageRepository {

  getInstructor(instructorId: string , userId : string): Promise<IMessagedInstructor | null>

  getInstructorOnly(instructorId : string):Promise<IInstructor | null>

  getInstructors(userId: string): Promise<IMessagedInstructor[]>

  createMessage(senderId: string, receiverId: string, text: string , file:string): Promise<IMessage>

  getMessages(userId: string, receiverId: string): Promise<IMessage[]>

  markAsRead(userId : string , senderId :string):Promise<boolean>

  getUsers(instructorId: string): Promise<IMessagedUser[]>


}

export class MessageRepository implements IMessageRepository {


  async getInstructor(instructorId: string , userId : string): Promise<IMessagedInstructor | null> {

    const instructor =  await InstructorModel.findById(
      instructorId,
      { name: 1 }
    );

    const lastMessage = await MessageModel.findOne({
      $or:[
        { senderId : userId, receiverId : instructorId },
        { senderId : instructorId, receiverId : userId },
      ]
    }).sort({ timestamp: -1 }).limit(1)
    console.log(lastMessage);
    
    
    return {instructor : instructor as IInstructor,lastMessage : lastMessage  as IMessage} 
  }


  async getInstructorOnly(instructorId : string):Promise<IInstructor | null>{
    return await InstructorModel.findById(
      instructorId,
      { name: 1 }
    );
  }

async getInstructors(userId: string): Promise<IMessagedInstructor[]> {
  const instructorIds = await MessageModel.distinct("receiverId", { senderId: userId });

  const instructors = await InstructorModel.find(
    { _id: { $in: instructorIds } },
    { name: 1, avatar: 1 }
  ).lean();

  // For each instructor, fetch the last message
  const result: IMessagedInstructor[] = await Promise.all(
    instructors.map(async (inst) => {
      const lastMessage = await MessageModel.findOne({
        $or: [
          { senderId: userId, receiverId: inst._id },
          { senderId: inst._id, receiverId: userId },
        ],
      })
        .sort({ timestamp: -1 })
        .lean();

      return {
        instructor: inst as IInstructor,
        lastMessage: lastMessage as IMessage,
      };
    })
  );

  return result;
}



  async createMessage(userId: string, instructorId: string, text?: string , file? : string | null):Promise<IMessage> {
    const message = new MessageModel({ senderId: userId, receiverId: instructorId, text , attachment : file });
    return message.save();
  }


async getMessages(userId: string, instructorId: string): Promise<IMessage[]> {
  return MessageModel.find({
    $or: [
      { senderId: userId, receiverId: instructorId },   
      { senderId: instructorId, receiverId: userId },   
    ],
  }).sort({ timestamp: 1 });
}

async markAsRead(senderId : string , receiverId :string):Promise<boolean>{
  const read =  await MessageModel.updateMany(
    {senderId : senderId , receiverId : receiverId , read : false},
    {$set :{read : true}}
  )
  return true
}


 async getUsers(instructorId: string): Promise<IMessagedUser[]> {
  const userIds = await MessageModel.distinct("receiverId", { senderId: instructorId });
  const sentIds = await MessageModel.distinct("senderId", { receiverId: instructorId });
  const allUserIds = [...new Set([...userIds, ...sentIds])];

  const messages = await MessageModel.aggregate([
    {
      $match: {
        $or: [
          { senderId: instructorId, receiverId: { $in: allUserIds } },
          { receiverId: instructorId, senderId: { $in: allUserIds } },
        ],
      },
    },

    { $sort: { timestamp: -1 } },
    {
      $group: {
        _id: {
          $cond: [
            { $eq: ["$senderId", instructorId] },
            "$receiverId",
            "$senderId",
          ],
        },
        lastMessage: { $first: "$$ROOT" },
      },
    },
    {$sort : {'lastMessage.timestamp':-1}}
  ]);

  const users = await UserModel.find(
    { _id: { $in: messages.map((m) => m._id) } },
    { name: 1, avatar: 1 }
  ).lean();

  const result: IMessagedUser[] = messages.map((m) => ({
    instructor: users.find((u) => u._id.toString() === m._id.toString()) as IUser,
    lastMessage: m.lastMessage as IMessage,
  }));

  return result;
}



  // const studentIds = await MessageModel.distinct("senderId", { receiverId: instructorId });
  // const studentIds2 = await MessageModel.distinct("receiverId", { senderId: instructorId });

  // const allUserIds = [...new Set([...studentIds, ...studentIds2])];

  // const filteredIds = allUserIds.filter(id => id !== instructorId);

  // const students = await UserModel.find({ _id: { $in: filteredIds } })
  //   .select("_id name");

  // return students;





async getUserMessages(instructorId: string, userId: string): Promise<IMessage[]> {
  return MessageModel.find({
    $or: [
      { senderId: instructorId, receiverId: userId }, 
      { senderId: userId, receiverId: instructorId }, 
    ],
  }).sort({ timestamp: 1 });
}



async sendInstructorsMessage(instructorId: string, userId: string, text: string , file : string | null)   {
  
  const message = new MessageModel({
    senderId: instructorId,   
    receiverId: userId,       
    text,
    attachment : file
  });
  return message.save();
}



}
