import { IReview } from "../models/review";

export interface InstructorCourseDTO {
  id: string;
  instructorId: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  skills: string[];
  level: string;
  category: string;
  totalEnrolled: number;
  createdAt: string;
  onPurchase: boolean;
}



export interface MyCoursesResponseDTO {
  success: boolean;
  courses: InstructorCourseDTO[];
  skills: string[];
  totalPages: number;
  currentPage: number;
}


// Module DTO
export interface IModuleDTO {
  id: string;
  title: string;
  videoUrl: string;
  content: string;
}

// Course DTO
export interface ICourseDetailsDTO {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  totalEnrolled: number;
  skills: string[];
  level: string;
  category: string;
  modules: IModuleDTO[];
  reviews: IReview[];
  createdAt: Date;
  instructorId: string;
}


export interface IEventDTO {
  id: string;

  title: string;
  description: string;
  topic: string;
  date: Date;
  time: string;
  participants: number;
  isLive: boolean;
  meetingLink?: string;
  isOver:boolean
}

export interface EventDTO {
  id: string;
  instructorId: string;
  instructorName: string;
  title: string;
  description: string;
  topic: string;
  date: Date;
  time: string;
  participants: number;
  isLive: boolean;
  isOver: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface IInstructorProfileDTO{
  _id : string;
  name: string;
  email: string;
  expertise?: string;
  bio?: string;
  profileImage?: string;
  KYCApproved: boolean;
  KYCstatus: "pending" | "verified" | "rejected" | "notApplied";
  work?: string;
  education?: string;
  blocked:boolean;
  skills:string[];
}


export interface INotificationDTO {
  _id: string;
  recipientId: string;
  title: string;
  message: string;
  isRead: boolean;
  // createdAt: Date;
  // updatedAt: Date;
}


export interface IRecentStudentDTO {
  name: string;
  email: string;
  course: string;
  date: Date;
}


export interface InstructorDashboardRaw {
  totalCourses: number;
  totalStudents: number;
  totalEarnings: number;
  monthlyEarnings: Record<string, number>;
  recentStudents?: {
    name: string;
    email: string;
    course: string;
    date: Date;
  }[];
}


export interface IInstructorDashboardDTO {
  totalCourses: number;
  totalStudents: number;
  totalEarnings: number;
  monthlyEarnings: Record<string, number>;
  recentStudents: IRecentStudentDTO[];
}



export interface IMonthlyEarningDTO {
  month: string;
  earnings: number;
}

export interface IEarningsDTO {
  monthlyEarnings: IMonthlyEarningDTO[];
  totalEarnings: number;
}


export interface TransactionDto {
  type: "credit" | "debit";
  amount: number;
  courseId: string;
  description: string;
  createdAt: Date;
}

export interface WalletDto {
  userId: string;
  balance: number;
  transactions: TransactionDto[];
}


export interface PurchaseDTO{
    name: string,
    title: string,
    thumbnail: string,
    price: number,
    category: string,
    amountPaid: number,
    paymentStatus: string,
    createdAt: Date
  }


  export interface QuizDTO {
  id: string;
  courseId: string;
  title: string;
  questions: QuizQuestionDTO[];
  createdAt: Date;
}

export interface QuizQuestionDTO {
  id: string;
  question: string;
  options: string[];
  points: number;
}




export interface MessagedStudentsDTO { 
  instructor: {
    _id: string;
    name: string;
  };
  lastMessage: {
    id: string;
    text: string;
    attachment : string;
    senderId: string;
    receiverId: string;
    read: boolean;
    timestamp: Date;
    
  };
}


