import mongoose, { Document, Schema, Model } from "mongoose";

export interface IModule {
  title: string;
  videoUrl: string;
  content: string;
}

interface ICourse {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  modules: IModule[];
}

export interface IProgress {
  completedModules: string[];
}

export interface IMyCourse extends Document {
  userId: string;
  courseId: ICourse | mongoose.Types.ObjectId;
  progress: IProgress;
  createdAt: Date;
  quizScore : number
  amountPaid:number
  paymentStatus:string
}


const myCourseSchema: Schema<IMyCourse> = new Schema({
  userId: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  progress: {
    completedModules: [{ type: String }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  quizScore: {
    type: Number,
  },
  amountPaid: {
    type: Number, // store price at purchase time
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed",
  }
});



export const MyCourseModel = mongoose.model<IMyCourse>("MyCourse",myCourseSchema);
