import { AdminAuthRequest } from "../middleware/authMiddleware";
import { IInstructor } from "../models/instructor";
import { IUser } from "../models/user";



import { Request, Response } from "express";



// Admin Course Read Operations 

export interface IAdminCourseReadController {
  getCourses(req: Request, res: Response): Promise<void>;
  getCourseDetails(req: Request, res: Response): Promise<void>;
}


//Admin Purchase Operations

export interface IAdminPurchaseController {
  getAllPurchases(req: AdminAuthRequest, res: Response): Promise<void>;
}






//controller.ts
//  AUTH INTERFACE
export interface IAdminAuthController {
  adminLogin(req: AdminAuthRequest, res: Response): Promise<void>;
}


//  USER MANAGEMENT INTERFACE
export interface IAdminUserManagementController {
  getUsers(req: Request, res: Response): Promise<void>;
  blockUnblock(req: Request, res: Response): Promise<void>;
  unblockUser(req: Request, res: Response): Promise<void>;
}


//  INSTRUCTOR MANAGEMENT INTERFACE
export interface IAdminInstructorController {
  getInstructors(req: Request, res: Response): Promise<void>;
}


//  KYC MANAGEMENT INTERFACE
export interface IAdminKycController {
  getKyc(req: Request, res: Response): Promise<void>;
  verifyKyc(req: Request, res: Response): Promise<void>;
  rejectKyc(req: AdminAuthRequest, res: Response): Promise<void>;
}


//  DASHBOARD / ANALYTICS INTERFACE
export interface IAdminDashboardController {
  dashboardStats(req: AdminAuthRequest, res: Response): Promise<void>;
  getUserOverview(req: Request, res: Response): Promise<void>;
  getEarnings(req: AdminAuthRequest, res: Response): Promise<void>;
}




//instructorControleller Admin

export interface IAdminInstructorsController{
  getInstructors(req : Request , res : Response):Promise<void>
  getInstructorsCourses(req : Request , res : Response):Promise<void>
}




export interface IAdminUsersController{
  getUser(req : Request , res : Response):Promise<void>
  getUserCourses(req : Request , res : Response):Promise<void>
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
  count : number
}

export interface IUserOverview {
  name: string;  // "Oct 2025"
  count: number;
}


