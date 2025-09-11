import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  userId: string;
  instructorId: string;
  text: string;
  timestamp: Date;
}

const messageSchema: Schema<IMessage> = new Schema(
  {
    userId: { type: String, required: true },
    instructorId: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model<IMessage>("Message", messageSchema);
