import {  IModuleDTO, QuizQuestionDTO } from "./instructorDTO";

export interface LoginDTO {
  success: true;
  message: string;
  accessToken: string;
  refreshToken: string;
}

export interface CourseDetailsDTO {
  _id: string;
  title: string;
  description: string;
  price: number;
  skills: string[];
  level: string;
  category: string;
  totalEnrolled: number;
  createdAt: Date;
  thumbnail: string;
  blocked: boolean;
  moduleCount: number;
  instructorName: string;
  instructorImage: string;
}

export interface CourseDocument {
  _id: string;
  title: string;
  description: string;
  price: number;
  skills: string[];
  level: string;
  category: string;
  totalEnrolled: number;
  createdAt: Date;
  thumbnail: string;
  blocked: boolean;
  moduleCount: number;
  instructorName: string;
  instructorImage: string;
}

export interface CourseWithAccessDTO {
  _id: string;
  instructorId: string;
  title: string;
  description: string;
  price: number;
  skills: string[];
  level: string;
  category: string;
  totalEnrolled: number;
  accessType: string;
  onPurchase: boolean;
  thumbnail: string;
  createdAt: Date;
  modules: {
    id: string;
    title: string;
    videoUrl: string;
    content: string;
  }[];
  instructor: {
    id: string;
    name: string;
    expertise: string;
    profileImage: string;
    bio: string;
    education: string;
    work: string;
    skills: string[];
  };
  hasAccess: boolean;
  completedModules: string[];
}

export interface MyCourseDTO {
  _id: string;
  courseId: string;
  paymentStatus: string;
  cancelCourse: boolean;
  blocked: boolean;
  createdAt: Date;
  completedModules: string[];

  course: {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    skills: string[];
    level: string;
    category: string;
    totalEnrolled: number;
    accessType: string;
  };
}

export interface SubscriptionCourseDTO {
  _id: string;
  title: string;
  description: string;
  price: number;
  skills: string[];
  level: string;
  modules: string;
  category: string;
  totalEnrolled: number;
  accessType: string;
  thumbnail: string;
  createdAt: Date;
}

// dto/courseView.dto.ts

export interface CourseMapperInput {
  _id: string;
  title: string;
  thumbnail?: string;
  description?: string;
  level?: string;
  skills?: string[];
  price?: number;
  accessType: string;
  onPurchase: boolean;
  instructorId: string;
  createdAt: Date;

  instructor?: {
    name?: string;
    profileImage?: string;
  };
}


export interface CourseModuleDTO {
  title: string;
  id: string;
  videoUrl: string;
}

export interface CourseViewDTO {
  _id: string;
  instructorId: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  skills: string[];
  level: string;
  category: string;
  accessType: "oneTime" | "subscription";
  totalEnrolled: number;
  onPurchase: boolean;
  blocked: boolean;
  createdAt: Date;
  modules: CourseModuleDTO[];
  reviewCount: number;
}


export interface loginInput{
  success : boolean , 
  message : string , 
  accessToken : string , 
  refreshToken : string}

export interface UserInstructorDTO {
  name: string;
  expertise: string;
  profileImage: string;
}

export interface FavoriteCourseDTO {
  _id: string;
  userId: string;
  courseId: string;
  course: {
    _id: string;
    title: string;
    description: string;
    thumbnail: string;
    price: number;
    skills: string[];
    level: string;
    modules?: IModuleDTO[] | undefined;
    totalEnrolled: number;
    category: string;
    accessType: string;
    onPurchase: boolean;
    blocked: boolean;
    createdAt: Date;
  };
}

import { Types } from "mongoose";

export interface IModule {
  _id: Types.ObjectId;
  title: string;
  content: string;
  videoUrl?: string;
}

export interface IInstructor {
  _id: Types.ObjectId;
  name: string;
  email: string;
  expertise: string;
  KYCApproved: boolean;
  joinedAt: Date;
  KYCstatus: string;
  profileImage?: string;
  bio?: string;
  education?: string;
  work?: string;
  blocked: boolean;
  skills: string[];
}

export interface ICoursePopulated {
  _id: Types.ObjectId;
  instructorId: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  skills: string[];
  modules: IModule[];
  totalEnrolled: number;
  createdAt: Date;
  level: string;
  category: string;
  blocked: boolean;
  accessType: string;
  onPurchase: boolean;
  instructor: IInstructor;
  hasAccess: boolean;
  completedModules: Types.ObjectId[];
}

export interface FavCourseDTO {
  _id: string;
  instructorId: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  skills: string[];
  modules: {
    _id: string;
    title: string;
    content: string;
    videoUrl?: string;
  }[];
  totalEnrolled: number;
  createdAt: Date;
  level: string;
  category: string;
  blocked: boolean;
  accessType: string;
  onPurchase: boolean;
  instructor: {
    _id: string;
    name: string;
    email: string;
    expertise: string;
    KYCApproved: boolean;
    joinedAt: Date;
    KYCstatus: string;
    profileImage?: string;
    bio?: string;
    education?: string;
    work?: string;
    blocked: boolean;
    skills: string[];
  };
  hasAccess: boolean;
  completedModules: string[];
}

export interface QuizUserDTO {
  _id: string;
  courseId: string;
  title: string;
  questions: QuizQuestionDTO[];
}

export interface PayDto {
  _id: string;
  userId: string;
  courseId: string;
  courseName: string;
  amount: number;
  status: string;
  paymentDate: Date;
}


export interface EventDTO {
  _id: string;
  instructorId: string;
  instructorName: string;
  title: string;
  description: string;
  topic: string;
  date: Date;
  time: string;
  participants: number;
  participantsList: string[];
  isLive: boolean;
  isOver: boolean;
  meetingLink?: string;
  createdAt: Date;
  updatedAt: Date;
}




export interface MessageDTO {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  attachment?: string;
  read: boolean;
  timestamp: Date;
  createdAt: Date;
}
