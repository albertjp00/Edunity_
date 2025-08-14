import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()

const URL: string = process.env.MONGO_URI || "";

export const connectDB = async () => {
  try {
    await mongoose.connect(URL);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    process.exit(1);
  }
};

