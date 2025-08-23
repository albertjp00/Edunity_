import mongoose, { Schema, Document } from "mongoose";

export interface IEvent extends Document {
  instructorId: string;
  title: string;
  description: string;

  date: Date;
  duration: number; 
  participants: string[];
  createdAt: Date;
  updatedAt: Date;
}


const EventSchema = new Schema<IEvent>(
  {
    instructorId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },

    date: { type: Date, required: true },
    duration: { type: Number, required: true },
    participants: [{ type: Number ,default:10 }],
  },
  { timestamps: true }
);

export const EventModel = mongoose.model<IEvent>("Event", EventSchema); 
