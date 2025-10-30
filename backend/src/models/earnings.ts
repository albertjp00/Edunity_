// models/earning.js
import mongoose , {Schema , Document} from "mongoose";


export interface IEarnings extends Document{
    courseId : string;
    instructorId : string;
    coursePrice : string ;
    totalSales : number;
    totalEarnings : number;
    instructorEarnings : number;
    adminEarnings : number;
    lastUpdated : Date;
}



const EarningSchema : Schema = new Schema<IEarnings>({
  courseId: {
    type: String,
    required: true,
  },
  instructorId: {
    type: String,
    ref: "Instructor",
    required: true,
  },
  coursePrice : {
    type:String
  },
  totalSales: {
    type: Number,
    default: 0,
  },
  totalEarnings: {
    type: Number,
    default: 0, // Total amount paid by users
  },
  instructorEarnings: {
    type: Number,
    default: 0,
  },
  adminEarnings: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});



export const EarningModel = mongoose.model<IEarnings>("Earning", EarningSchema);
