import { IPurchase } from "../interfaces/adminInterfaces";
import { ITotalEnrolled } from "../interfacesServices.ts/adminServiceInterfaces";

export type AdminLoginDTO =
  | {
      success: true;
      message: string;
      token: string;
      refreshToken: string;
    }
  | {
      success: false;
      message: string;
    };


export interface CourseDTO {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  instructorName: string;
  createdAt: Date;
  category: string;
  blocked: boolean;
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

// dto/PurchaseDTO.ts
export interface PurchaseAdminDTO {
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  amountPaid: number;
  paymentStatus: string;
  createdAt: string; // usually send ISO string to frontend
}

export interface AdminPurchaseService {
  purchases: IPurchase[] | undefined;
  totalPurchases: number;
  totalPages: number;
  currentPage: number;
}

export interface PurchasePDFRow {
  userName: string;
  userEmail: string;
  courseTitle: string;
  coursePrice: number;
  amountPaid: number;
  paymentStatus: string;
  createdAt: string;
}

export interface StatsDTO {
  totalUsers: number;
  totalInstructors: number;
  totalCourses: number;
  totalEarnings: number;
  totalEnrolled: ITotalEnrolled[];
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
  blocked: boolean;
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
  description: string;
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

export interface AdminCourseDetailsDTO {
  course: {
    id: string;
    title: string;
    description: string;
    price: number;
    skills: string[];
    level: string;
    category: string;
    thumbnail: string;
    blocked: boolean;
    accessType: string;
    createdAt: Date;
    totalEnrolled: number;
  };
  instructor: {
    id: string;
    name: string;
    email: string;
    expertise: string;
    profileImage: string;
    bio?: string;
    education?: string;
    work?: string;
    skills: string[];
    blocked: boolean;
    KYCstatus: string;
  };
  enrolledUsersCount: number;
}

export interface CategoryDTO {
  id: string;
  name: string;
  skills: string[];
}

export interface ReportDTO {
  id: string;
  userId: string;
  courseId: string;
  reason: string;
  createdAt: Date;
}

export interface LoginDTO {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken : string;
}

export interface TotalEnrolledDTO {
  enrolled: number;
  month: string;
}

export interface AdminStatsDTO {
  totalUsers: number;
  totalInstructors: number;
  totalCourses: number;
  totalEnrolled: TotalEnrolledDTO[];
}


