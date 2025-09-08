import { IMessage, MessageModel } from "../models/message.js";


export class MessageRepository {
  async saveMessage(message: Partial<IMessage>): Promise<IMessage> {
    const newMsg = new MessageModel(message);
    return await newMsg.save();
  }

  async getMessages(userId: string, receiverId: string): Promise<IMessage[]> {
    return await MessageModel.find({
      $or: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId },
      ],
    }).sort({ createdAt: 1 });
  }
}
