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
  duration: number;
  participants: number;
  participantsList: string[]; // store userIds of joined participants
  isLive: boolean;            // indicates if the session is ongoing
  maxParticipants?: number;   // optional limit for users
  meetingLink?: string;       // link to join (Zoom/WebRTC/Socket room)
  recordingUrl?: string;      // saved recording (optional)
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    instructorId: { type: String, required: true },
    instructorName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    topic: { type: String },
    date: { type: Date, required: true },
    time:{type : String },
    duration: { type: Number },
    participants: { type: Number, default: 0 },
    participantsList: [{ type: String }], // array of userIds
    isLive: { type: Boolean, default: false },
    maxParticipants: { type: Number , default:10},
    meetingLink: { type: String },
    recordingUrl: { type: String }
  },
  { timestamps: true }
);



export const EventModel = mongoose.model<IEvent>("Event", EventSchema); 
