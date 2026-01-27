import mongoose, { Document, Schema } from "mongoose";




export interface IReport extends Document {
    userId: string;
    courseId: string;
    reason : string;
    message : string;
    createdAt : Date
}

const ReportSchema: Schema<IReport> = new Schema({
    userId: {
        type: String,
        required: true,
    },
    courseId: {
        type: String,
        required: true
    },
    reason :{
        type : String
    },
    message : {
        type : String,
    },
    createdAt: {
        type: Date, default: Date.now
    },

});

export const ReportModel = mongoose.model<IReport>("Report", ReportSchema);
