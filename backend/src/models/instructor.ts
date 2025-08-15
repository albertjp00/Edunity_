// models/Instructor.ts
import mongoose, { Document, Schema } from "mongoose";

// Interface for Instructor document
export interface IInstructor extends Document {
  name: string;
  email: string;
  password: string;
  expertise?: string;
  bio?: string;
  profileImage?: string;
  KYCApproved: boolean;
  joinedAt: Date;
  KYCstatus: "pending" | "verified" | "rejected" | "notApplied";
  work?: string;
  education?: string;
  blocked?:boolean
}



// Schema definition
const InstructorSchema: Schema<IInstructor> = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  expertise: {
    type: String
  },
  bio: {
    type: String
  },
  profileImage: {
    type: String
  },
  KYCApproved: {
    type: Boolean,
    default: false
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  KYCstatus: {
    type: String,
    enum: ["pending", "verified", "rejected", "notApplied"],
    default: "notApplied"
  },
  work: {
    type: String
  },
  education: {
    type: String
  },
  blocked:{
    type:Boolean,
    default:false
  } 
});

// Export model
export const InstructorModel =  mongoose.model<IInstructor>("Instructor", InstructorSchema);
