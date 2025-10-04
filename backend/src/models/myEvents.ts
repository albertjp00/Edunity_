import mongoose, { Document, Schema } from "mongoose";

export interface IMyEvent extends Document {
  userId:string;      
  eventId: string;     
  enrolledAt: Date;                   
  status: "enrolled" | "completed" | "cancelled"; 
}

const MyEventSchema = new Schema<IMyEvent>(
  {
    userId: { type: String, required: true },
    eventId: { type: String, required: true },
    enrolledAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["enrolled", "completed", "cancelled"],
      default: "enrolled",
    },
  },
  { timestamps: true }
);


export const MyEventModel = mongoose.model<IMyEvent>("MyEvent", MyEventSchema);
