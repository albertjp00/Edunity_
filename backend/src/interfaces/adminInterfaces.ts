import {
  AdminLoginDTO,
  AdminPurchaseService,
  CategoryDTO,
  CourseDTO,
  DTOKyc,
  InstructorAdminDTO,
  ReportDTO,
} from "../dto/adminDTO";
import { AdminAuthRequest } from "../middleware/authMiddleware";
import { ICategory } from "../models/category";
import { ICourse } from "../models/course";
import { IInstructor } from "../models/instructor";
import { IQuiz } from "../models/quiz";
import { IUser } from "../models/user";
import { NextFunction, Request, Response } from "express";
export interface IAdminCourseReadController {
  getCourses(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCourseDetails(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  blockCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
  getReports(req: Request, res: Response, next: NextFunction): Promise<void>;
}

//Admin Purchase Operations
export interface IAdminPurchaseController {
  getAllPurchases(
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  // exportPurchasesPDF(req: AdminAuthRequest,res: Response , next : NextFunction):Promise<void>;
}

export interface IAdminCategoryController {
  addCategory(
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getCategory(
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  deleteCategory(
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

//controller.ts
//  AUTH INTERFACE
export interface IAdminAuthController {
  adminLogin(
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

//  USER MANAGEMENT INTERFACE
export interface IAdminUserManagementController {
  getUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  getUserCourses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  blockUnblock(req: Request, res: Response, next: NextFunction): Promise<void>;
  unblockUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}

//  INSTRUCTOR MANAGEMENT INTERFACE
export interface IAdminInstructorController {
  getInstructors(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  blockInstructor(
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

//  KYC MANAGEMENT INTERFACE
export interface IAdminKycController {
  getKyc(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyKyc(req: Request, res: Response, next: NextFunction): Promise<void>;
  rejectKyc(
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

//  DASHBOARD / ANALYTICS INTERFACE
export interface IAdminDashboardController {
  dashboardStats(
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getUserOverview(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getEarnings(
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

//instructorControleller Admin

export interface IAdminInstructorsController {
  getInstructor(req: Request, res: Response, next: NextFunction): Promise<void>;
  getInstructors(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  getInstructorsCourses(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
}

// ------------AdminServicess interfaces-------------------

export interface IAdminCourseService {
  getInstructorsRequest(id: string): Promise<IInstructor | null>;

  getCoursesRequest(
    page: number,
    search: string,
    limit: number,
  ): Promise<{
    courses: CourseDTO[] | null;
    totalPages: number;
    currentPage: number;
  }>;

  getCourseDetailsRequest(
    courseId: string,
  ): Promise<IAdminCourseDetails | null>;

  getQuizRequest(courseId: string): Promise<IQuiz[] | null>;

  getPurchaseDetails(
    search: string,
    page: number,
  ): Promise<AdminPurchaseService | null | undefined>;

  generatePurchasesPDF(purchases: IPurchase[]): Promise<Buffer>;

  addCategoryRequest(
    category: string,
    skills: string[],
  ): Promise<ICategory | null>;

  getCategoryRequest(): Promise<CategoryDTO[] | null>;

  deleteCategoryRequest(category: string): Promise<boolean | null>;
  blockCourseRequest(courseId: string): Promise<boolean | null>;
  getReportsRequest(): Promise<ReportDTO[] | null>;
}

export interface IAdminAuthService {
  loginRequest(email: string, password: string): Promise<AdminLoginDTO>;
}

//adminInstructor services
export interface IAdminInstructorService {
  getInstructors(
    page: string,
    search: string,
  ): Promise<PaginatedInstructorsService | null>;

  getKycDetails(id: string): Promise<DTOKyc | null>;

  verifyKyc(id: string): Promise<void | null>;

  rejectKyc(id: string, reason: string): Promise<void | null>;

  getInstructorsRequest(id: string): Promise<IInstructor | null>;

  blockInstructorRequest(id: string): Promise<boolean | null>;

  getInstructorsCoursesRequest(id: string): Promise<ICourse[] | null>;
}



export interface PaginatedUsers {
  users: IUser[];
  totalPages: number;
  currentPage: number;
  totalUsers: number;
}

export interface PaginatedUsersService {
  users: UserDTO[];
  totalPages: number;
  currentPage: number;
  totalUsers: number;
}

export interface PaginatedInstructors {
  instructors: IInstructor[];
  totalPages: number;
  currentPage: number;
  totalInstructors: number;
}

export interface PaginatedInstructorsService {
  instructors: InstructorAdminDTO[];
  totalPages: number;
  currentPage: number;
  totalInstructors: number;
}

export interface PurchaseResult {
  purchases: IPurchase[];
  totalPurchases: number;
  totalPages: number;
  currentPage: number;
}

export interface ICount {
  count: number;
}

export interface IUserOverview {
  name: string; // "Oct 2025"
  count: number;
}

export interface PurchaseDTO {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  amountPaid: number;
  paymentStatus: "completed" | "pending" | "failed";
  createdAt: string;
}

export interface PaginatedPurchasesDTO {
  purchases: PurchaseDTO[];
  totalPurchases: number;
  totalPages: number;
  currentPage: number;
}

export interface IPurchase {
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseTitle: string;
  coursePrice: number;
  amountPaid: number;
  paymentStatus: "completed" | "pending" | "failed";
  createdAt: Date;
}

export interface IAdminCourseDetails {
  course: ICourse;
  instructor: IInstructor | null;
  enrolledUsers: IUser[];
  totalEnrolled: number;
}

export interface CourseDetailsServiceResult {
  course: ICourse;
  instructor: {
    _id: string;
    name: string;
    email: string;
  };
  enrolledUsers: number; // or IUser[] if needed
}

import { Types } from "mongoose";
import { UserDTO } from "./userInterfaces";

export interface CourseRaw {
  _id: Types.ObjectId;
  instructorId: string;
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
  totalEnrolled?: number;
}

export interface InstructorRaw {
  _id: Types.ObjectId;
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
}

export interface AdminCourseDetailsRaw {
  course: CourseRaw;
  instructor: InstructorRaw;
  enrolledUsers: string[];
  totalEnrolled: number;
}
