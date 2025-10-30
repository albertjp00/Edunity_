import mongoose, { Schema, Document } from "mongoose";

export interface IModule {
  title: string;
  videoUrl: string;
  content: string;
}

export interface ICourse extends Document {
    instructorId?: string;
    title: string;
    description?: string;
    thumbnail?: string;
    price?: number;
    skills?: string[];
    level?: string;
    modules?: IModule[];
    createdAt?: Date;
    totalEnrolled?: number;
    category:string;
}



const CourseSchema: Schema = new Schema<ICourse>({
  instructorId: {
    type: String,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  price: {
    type: Number,
  },
  skills: {
    type: [String],
  },
  level: {
    type: String,
  },
  modules: [
    {
      title: { type: String },
      videoUrl: { type: String },
      content: { type: String },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category:{
    type:String,

  },
  
  totalEnrolled: {
    type: Number,
    default: 100,
  },
});

export const CourseModel =  mongoose.model<ICourse>("Course", CourseSchema);
