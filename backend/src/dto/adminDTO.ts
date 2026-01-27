import { ITotalEnrolled } from "../interfacesServices.ts/adminServiceInterfaces";

export interface AdminLoginDTO {
  success: boolean;
  message: string;
  token?: string;
}


export interface CourseDTO {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  instructorName: string;
  createdAt: Date;
  category : string;
  blocked:boolean 
}

export interface CourseDetailsDTO {
  id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  instructor: {
    id: string;
    name: string;
    email: string;
  };
  enrolledUsers: number;
}

export interface PurchaseDTO {
  id: string;
  userName: string;
  courseTitle: string;
  coursePrice: number;
  amountPaid : number;
  paymentStatus:string;
  purchasedAt: Date;
}



export interface StatsDTO {
  totalUsers: number;
  totalInstructors: number;
  totalCourses: number;
  totalEarnings: number;
  totalEnrolled : ITotalEnrolled[]
}

export interface UserOverviewDTO {
  name: string;
  count: number;
}

export interface EarningsDTO {
  adminEarnings: number;
  instructorEarnings: number;
  totalSales: number;
  lastUpdated: string;
}



export interface InstructorAdminDTO {
    id: string;
    name: string;
    email: string;
    profileImage?: string;
    KYCstatus: string;
    blocked : boolean
}

export interface KycDTO {
    id: string;
    status: string;
    documentType: string;
    documentUrl: string;
    submittedAt: Date;
}

export interface DTOKyc {
  id: string;
  instructorId: string;
  idProof: string;
  addressProof: string;
}




export interface UserDTO {
    id: string;
    name: string;
    email: string;
    picture?: string;
    isBlocked: boolean;
    createdAt: Date;
}


export interface UserCourseDTO {
    id: string;
    title: string;
    thumbnail?: string;
    progress?: number;
    purchasedAt: Date;
}


export interface CourseListAggregation {
  _id: string;
  title: string;
  description?: string;
  price: number;
  skills: string[];
  level: string;
  category: string;
  totalEnrolled: number;
  createdAt: Date;
  thumbnail: string;
  blocked: boolean;

  // derived fields
  moduleCount: number;
  instructorName: string;
  instructorImage: string;
}
