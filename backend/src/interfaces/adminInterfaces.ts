import { AdminAuthRequest } from "../middleware/authMiddleware";
import { ICategory } from "../models/category";
import { ICourse } from "../models/course";
import { IInstructor } from "../models/instructor";
import { IUser } from "../models/user";



import { NextFunction, Request, Response } from "express";



// Admin Course Read Operations 




export interface IAdminCourseReadController {
  getCourses(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCourseDetails(req: Request, res: Response, next: NextFunction): Promise<void>;
  blockCourse(req: Request, res: Response, next: NextFunction): Promise<void>;
}


//Admin Purchase Operations
export interface IAdminPurchaseController {
  getAllPurchases(req: AdminAuthRequest, res: Response, next: NextFunction): Promise<void>;
  // exportPurchasesPDF(req: AdminAuthRequest,res: Response , next : NextFunction):Promise<void>;
}

export interface IAdminCategoryController {
  addCategory(req: AdminAuthRequest, res: Response, next: NextFunction): Promise<void>;
  getCategory(req: AdminAuthRequest, res: Response, next: NextFunction): Promise<void>;
  deleteCategory(req: AdminAuthRequest, res: Response, next: NextFunction): Promise<void>;
}

//controller.ts
//  AUTH INTERFACE
export interface IAdminAuthController {
  adminLogin(req: AdminAuthRequest, res: Response, next: NextFunction): Promise<void>;
}


//  USER MANAGEMENT INTERFACE
export interface IAdminUserManagementController {
  getUser(req: Request, res: Response, next: NextFunction): Promise<void>
  getUserCourses(req: Request, res: Response, next: NextFunction): Promise<void>
  getUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
  blockUnblock(req: Request, res: Response, next: NextFunction): Promise<void>;
  unblockUser(req: Request, res: Response, next: NextFunction): Promise<void>;
}


//  INSTRUCTOR MANAGEMENT INTERFACE
export interface IAdminInstructorController {
  getInstructors(req: Request, res: Response, next: NextFunction): Promise<void>;
}


//  KYC MANAGEMENT INTERFACE
export interface IAdminKycController {
  getKyc(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyKyc(req: Request, res: Response, next: NextFunction): Promise<void>;
  rejectKyc(req: AdminAuthRequest, res: Response, next: NextFunction): Promise<void>;
}


//  DASHBOARD / ANALYTICS INTERFACE
export interface IAdminDashboardController {
  dashboardStats(req: AdminAuthRequest, res: Response, next: NextFunction): Promise<void>;
  getUserOverview(req: Request, res: Response, next: NextFunction): Promise<void>;
  getEarnings(req: AdminAuthRequest, res: Response, next: NextFunction): Promise<void>;
}



//instructorControleller Admin

export interface IAdminInstructorsController {
  getInstructor(req: Request, res: Response, next: NextFunction): Promise<void>
  getInstructors(req: Request, res: Response, next: NextFunction): Promise<void>
  getInstructorsCourses(req: Request, res: Response, next: NextFunction): Promise<void>
}

export interface IAdminUsersController {

}





// ------------AdminServicess interfaces-------------------


export interface IAdminCourseService {
  getInstructorsRequest(id: string): Promise<IInstructor | null>;

  getCoursesRequest(
    page: number,
    search: string,
    limit: number
  ): Promise<{
    courses: ICourse[] | null;
    totalPages: number;
    currentPage: number;
  }>;

  getCourseDetailsRequest(courseId: string): Promise<any>;

  getPurchaseDetails(search: string, page: number): Promise<any>;

  generatePurchasesPDF(purchases: any[]): Promise<Buffer>;

  addCategoryRequest(category: string, skills: string[]): Promise<ICategory | null>;
  getCategoryRequest(): Promise<any>;
  getCategoryRequest(category: string): Promise<any>;
  deleteCategoryRequest(category: string): Promise<any>;
  blockCourseRequest(courseId:string): Promise<boolean | null>;
}



export interface IAdminAuthService {
  loginRequest(
    email: string, password: string): Promise<{ success: boolean; message: string; token?: string }>;
}



//adminInstructor services

export interface IAdminInstructorService {
  getInstructors(
    page: string,
    search: string
  ): Promise<PaginatedInstructors | null>;

  getKycDetails(id: string): Promise<void | null>;

  verifyKyc(id: string): Promise<void | null>;

  rejectKyc(id: string, reason: string): Promise<void | null>;

  getInstructorsRequest(id: string): Promise<IInstructor | null>;

  getInstructorsCoursesRequest(id: string): Promise<ICourse[] | null>;
}




export interface PaginatedUsers {
  users: IUser[];
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


export interface PurchaseResult {
  purchases: any[];
  totalPurchases: number;
  totalPages: number;
  currentPage: number;
}


export interface ICount {
  count: number
}

export interface IUserOverview {
  name: string;  // "Oct 2025"
  count: number;
}

