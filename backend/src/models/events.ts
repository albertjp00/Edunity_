// import mongoose, { Schema, Document } from "mongoose";
import mongoose , { Schema, Document, Types } from "mongoose";

export interface IEvent extends Document {
  instructorId: string;
  instructorName: string;
  title: string;
  description: string;
  topic: string;
  date: Date;
  time: string
  participants: number;
  participantsList: string[]; 
  isLive: boolean;            
  maxParticipants?: number;  
  meetingLink?: string;      
  recordingUrl?: string;      
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema<IEvent>(
  {
    instructorId: { type: String, required: true },
    instructorName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    topic: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    participants: { type: Number, default: 0 },          // ✅ Counter
    participantsList: { type: [String], default: [] },   // ✅ Array of userIds
    isLive: { type: Boolean, default: false },
    maxParticipants: { type: Number },
    meetingLink: { type: String },
    recordingUrl: { type: String },
  },
  { timestamps: true }
);



export const EventModel = mongoose.model<IEvent>("Event", EventSchema); 
