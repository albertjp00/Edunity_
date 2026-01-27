import mongoose, { Document, Schema} from "mongoose";




export interface IReview extends Document {
    userId: string;
    courseId: string;
    userName: string;
    userImage: string;
    rating: number;
    comment: string;
    createdAt?: Date;
}

const ReviewSchema: Schema<IReview> = new Schema({
    userId: {
        type: String,
        required: true,
    },
    courseId: {
        type: String,
        required: true
    },
    userName: {
        type: String
    },
    userImage:
    {
        type: String
        
    },
    rating: {
        type: Number, required: true, min: 1, max: 5
    },
    comment: {
        type: String, required: true
    },
    createdAt: {
        type: Date, default: Date.now
    },

});

export const ReviewModel = mongoose.model<IReview>("Review", ReviewSchema);
