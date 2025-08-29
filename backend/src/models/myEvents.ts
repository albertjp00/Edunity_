import mongoose, { Document, Schema } from "mongoose";

export interface IMyEvent extends Document {
  userId: mongoose.Types.ObjectId;      
  eventId: mongoose.Types.ObjectId;     
  enrolledAt: Date;                   
  status: "enrolled" | "completed" | "cancelled"; 
}

const MyEventSchema = new Schema<IMyEvent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["enrolled", "completed", "cancelled"],
      default: "enrolled",
    },

  },
  { timestamps: true }
);

export const MyEventModel = mongoose.model<IMyEvent>("MyEvent", MyEventSchema);
