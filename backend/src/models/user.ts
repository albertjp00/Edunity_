import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
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
  createdAt: string;
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
    required: true,
  },

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },

  profileImage: {
    type: String,
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
    type: String,
    default: () => new Date().toISOString(),
  },
});


export const UserModel = mongoose.model<IUser>('User', UserSchema);
