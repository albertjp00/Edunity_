export interface IEventFormData { 
    title?:string , 
    topic?:string, 
    description?:string, 
    date?:string,
     time?:string ,
    //  ampm:string,
    isLive?:boolean
    isOver?:boolean
    };



export interface IUser {
  _id?: string;
  name?: string;
  email?: string;
  profileImage?: string;
  bio?: string;
  expertise?: string;
  KYCstatus?: 'verified' | 'pending' | 'rejected' | string;
  education?: string;
  work?: string;
  skills?:string[];
}



 export    interface QuizOption {
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correctAnswer: string;
  points: number;
}

export interface QuizPayload {
  courseId: string;
  title: string;
  questions: QuizQuestion[];
}


export interface Option {
  text: string;
}

export interface Question {
  _id?: string; // make optional since new questions won't have one yet
  question: string;
  options: Option[];
  correctAnswer: string;
  points: number;
}

export interface QuizData {
  _id: string;
  courseId: string;
  title: string;
  questions: Question[];
}

