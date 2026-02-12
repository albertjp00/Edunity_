import mongoose, { Schema, Document, Types } from "mongoose";

export interface IModule {
  title: string;
  _id : string;
  // videoUrl: string;
  content: string;
  videoUrl?: string;
  signedVideoUrl?: string; 
}


export type IModuleInput = Omit<IModule, "_id">;

export interface ICourse extends Document {
  _id: Types.ObjectId; 
  instructorId: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  skills: string[];
  level: string;
  modules: IModule[];
  createdAt: Date;
  totalEnrolled: number;
  category: string;
  onPurchase:boolean;
  averageRating: number;
  accessType : string;
  blocked : boolean
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
  category: {
    type: String,

  },

  totalEnrolled: {
    type: Number,
    default: 100,
  },

  onPurchase:{
    type : Boolean,
    default : false
  },

  accessType :{
    type:String,
    default : 'oneTime'
  },

  blocked:{
    type : Boolean,
    default : false
  }


});

export const CourseModel = mongoose.model<ICourse>("Course", CourseSchema);
