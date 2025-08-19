import mongoose, { Document, Schema, Model } from "mongoose";

export interface IModule {
  title: string;
  videoUrl: string;
  content: string;
}

export interface ICourse {
  id: string;
  title: string;
  description: string;
  price: string;
  thumbnail: string;
  modules: IModule[];
}

export interface IProgress {
  completedModules: string[];
}

export interface IMyCourse extends Document {
  userId: string;
  course: ICourse;
  progress: IProgress;
  createdAt: Date;
}

const myCourseSchema: Schema<IMyCourse> = new Schema({
  userId: {
    type: String,
    required: true,
  },
  course: {
    id: { type: String },
    title: { type: String },
    description: { type: String },
    price: { type: String },
    thumbnail: { type: String },
    modules: [
      {
        title: { type: String },
        videoUrl: { type: String },
        content: { type: String },
      },
    ],
  },
  progress: {
    completedModules: [{ type: String }],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const MyCourseModel = mongoose.model<IMyCourse>("MyCourse",myCourseSchema);
