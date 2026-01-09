import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  profileImage?: string;
  bio?: string;
  phone?: string;
  location?: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  blocked: boolean;
  createdAt: Date;
  googleId : string;
  courseCount : number;
  subscription : ISubscription;
}

export interface ISubscription {
    isActive: Boolean,
    startDate:  Date ,
    endDate:  Date ,
    paymentId:  String ,
    orderId:  String ,
    billingCycle: String
}


const UserSchema: Schema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },

  password: {
    type: String,
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  profileImage: {
    type: String,
    default:'profilePic.png'
  },

  bio: {
    type: String,
    default: '',
  },

  phone: {
    type: String,
  },

  location: {
    type: String,
  },

  dob: {
    type: String,
  },

  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
  },

  blocked: {
    type: Boolean,
    default: false,
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  googleId : {
    type:String
  },

  courseCount :{
    type : Number,
  },

  subscription: {
    isActive: { type: Boolean, default: false },
    startDate: { type: Date },
    endDate: { type: Date },
    orderId: { type: String },
    paymentId: { type: String },
    billingCycle:{type:String , default:"Monthly"}
  },

});


export const UserModel = mongoose.model<IUser>('User', UserSchema);
