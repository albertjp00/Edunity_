import { ICourseDetailsDTO } from "./instructorDTO";

export interface LoginDTO {
  success : true
  message: string;
  accessToken: string;
  refreshToken : string
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
  blocked : boolean;
  moduleCount: number;
  instructorName : string;
  instructorImage: string;
}


export interface CourseDocument{
  _id: string,
  title: string,
  description: string,
  price: number,
  skills: string[],
  level: string,
  category: string,
  totalEnrolled: number,
  createdAt: Date,
  thumbnail: string,
  blocked: boolean,
  moduleCount: number,
  instructorName: string,
  instructorImage: string
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
  modules : string;
  category: string;
  totalEnrolled: number;
  accessType: string;
  thumbnail: string;
  createdAt: Date;
}
