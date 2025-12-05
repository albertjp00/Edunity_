import mongoose ,{Schema, Document , Types} from "mongoose";


export interface  INotification extends Document{
    _id: Types.ObjectId;
    recipientId : string;
    senderId : string;
    title : string;
    message : string;
    isRead : boolean
}


const notificationSchema : Schema = new Schema<INotification>(
  {
    recipientId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export const NotificationModel = mongoose.model<INotification>("Notification", notificationSchema);
