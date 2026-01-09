//  subscription: {
//     userId: string;
//     planName: string;
//     status: "active" | "expired" | "cancelled";
//     startDate: string;
//     endDate: string;
//     nextBillingDate?: string;
//     billingCycle: "monthly" | "yearly";
//     autoRenew: boolean;
//   };


import mongoose, { Document, Schema, Model } from "mongoose";


export interface ISubscription extends Document {
    userId: string;
    planName: string;
    status: "active" | "expired"
    startDate: string;
    endDate: string;
    nextBillingDate?: string;
    billingCycle: "monthly"
}


const SubscriptionSchema: Schema<ISubscription> = new Schema({
    userId: {
        type: String,
        required: true,
    },
    planName: {
        type: String,
        required: true
    },
    status: {
        type: String
    },
    startDate:
    {
        type: String
        
    },
    endDate: {
        type: String
    },
    nextBillingDate: {
        type: String
    },
    billingCycle: {
        type: String
    },


});

export const SubscriptionModel = mongoose.model<ISubscription>("Subscription", SubscriptionSchema);