import mongoose, { Schema, Document } from "mongoose";

export interface ISubscriptionPlan extends Document {
  name: string;
  price: number;
  durationInDays: number;
  features: string[];
  isActive: boolean;
}

const subscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    durationInDays: { type: Number, required: true },
    features: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const SubscriptionModel = mongoose.model<ISubscriptionPlan>("SubscriptionPlan",subscriptionPlanSchema);
