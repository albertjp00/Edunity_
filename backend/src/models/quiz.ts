import mongoose, { Document, Schema } from "mongoose";

export interface IOption {
  text: string;
}

export interface IQuestion {
  _id: mongoose.Types.ObjectId;   
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
}


export interface IQuiz extends Document {
  courseId: string;
  title: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt?: Date;
}

const optionSchema = new Schema<IOption>({
  text: { type: String, required: true },
});

const questionSchema = new Schema<IQuestion>({
  question: { type: String, required: true },
  options: [optionSchema],
  correctAnswer: { type: String, required: true },
  points: { type: Number, default: 1 },
});

const quizSchema = new Schema<IQuiz>(
  {
    courseId: { type: String, required: true },
    title: { type: String, required: true },
    questions: [questionSchema],
  },
  { timestamps: true }
);

export const QuizModel = mongoose.model<IQuiz>("Quiz", quizSchema);
