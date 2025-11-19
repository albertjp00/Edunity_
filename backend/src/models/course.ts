import mongoose, { Schema, Document, Types } from "mongoose";

export interface IModule {
  title: string;
  // videoUrl: string;
  content: string;
  videoUrl?: string;
  signedVideoUrl?: string; 
}

export interface IReview {
  userId: string;
  userName : string;
  userImage : string;
  rating: number;
  comment: string;
  createdAt?: Date;
}

export interface ICourse extends Document {
  _id: Types.ObjectId; 
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
  category: string;
  review: IReview[];
  onPurchase:boolean;
  averageRating?: number
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

  review: [
    {
      
      userId: { type: String, required: true },
      userName : {type :String},
      userImage : {type : String},
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    
    }
  ]
});

export const CourseModel = mongoose.model<ICourse>("Course", CourseSchema);
