// order.model.ts
import mongoose, { Schema } from "mongoose";
import { Document, Types } from "mongoose";

export interface IOrder extends Document {
  userId: Types.ObjectId; // Reference to User
  courseId: Types.ObjectId; // Reference to Course
  orderId: string; // Razorpay orderId
  amount: number;
  currency: string; // default: "INR"
  status: "pending" | "paid" | "failed"; // enum
  createdAt: Date;
  updatedAt: Date;
}



const orderSchema = new Schema<IOrder>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    orderId: { type: String, required: true }, // Razorpay orderId
    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.model<IOrder>("Order", orderSchema);
