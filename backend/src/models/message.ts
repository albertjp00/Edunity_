import { Types } from "mongoose";
import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  _id : Types.ObjectId
  senderId: string;
  receiverId: string;
  text?: string;
  attachment? : string;
  timestamp: Date;
  read : boolean;
  createdAt : Date;
}

const messageSchema: Schema<IMessage> = new Schema(
  {
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    text: { type: String },
    attachment : {type: String },
    timestamp: { type: Date, default: Date.now },
    read : {type: Boolean, default : false}
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model<IMessage>("Message", messageSchema);
