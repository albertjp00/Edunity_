// models/earning.js
import mongoose, { Schema, Document } from "mongoose";


export interface IPayment extends Document {
    userId : string;
    courseId: string;
    courseName : string;
    amount: number;
    paymentDate :Date;
    status : string;
}



const PaymentSchema: Schema = new Schema<IPayment>({
    userId: { 
        type: String
    },
    courseId: { 
        type: String,
    },
    courseName :{
        type : String
    },
    amount: { type: Number},

    paymentDate: { type: Date, default: Date.now },

    status: { type: String, enum: ["Success", "Failed", "Pending"], default: "Success" },

});



export const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
