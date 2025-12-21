import { InstAuthRequest } from "../middleware/authMiddleware";
import { ICourse } from "../models/course";
import { IEvent } from "../models/events";
import { IInstructor } from "../models/instructor";
import { IKyc } from "../models/kyc";
import { IMessage } from "../models/message";
import { IQuiz } from "../models/quiz";
import { ISkills } from "../repositories/instructorRepository";


export interface IInsRepository {
  findByEmail(email: string): Promise<IInstructor | null>

  create(instructor: { name: string; email: string; password: string }): Promise<IInstructor | null>

  findById(id: string): Promise<IInstructor | null>

  updateProfile(id: string, data: any): Promise<IInstructor | null>

  updatePassword(id: string, newPassword: string): Promise<IInstructor | null>

  kycSubmit(id: string, idProof: string, addressProof: string): Promise<IKyc | null>

  changePassword(id: string, password: string): Promise<IInstructor | null>

  addCourse(id: string, data: any): Promise<ICourse | null>

  getCourses(id: string, skip: number, limit: number): Promise<ICourse[] | null>

  getCourseDetails(courseId: string): Promise<ICourse | null>

  purchaseDetails(courseId: string): Promise<IPurchaseDetails[] | null>

  editCourse(id: string, data: any): Promise<ICourse | null>

  countCourses(): Promise<number>;

  findSkills(): Promise<ISkills>;

  addEvent(id: string, name: string, data: Partial<IEvent>): Promise<IEvent>

  getMyEvents(id: string): Promise<IEvent[] | null>

  getEvent(id: string): Promise<IEvent | null>

  updateEvent(id: string, data: any): Promise<IEvent | null>

  addQuiz(courseId: string, title: string, questions: any[]): Promise<IQuiz>

  getQuiz(courseId: string): Promise<IQuiz | null>

  getQuizByCourseId(courseId: string): Promise<IQuiz | null>

  editQuiz(id: string, data: any): Promise<IQuiz>

  startEventById(id: string): Promise<IEvent | null>

  endEventById(id: string): Promise<IEvent | null>


}



import { NextFunction, Request, Response } from "express";


//authCOntroller

export interface IInstLoginController {
  login(req: Request, res: Response,next: NextFunction): Promise<void>;
}


export interface IInstRegisterController {
  register(req: Request, res: Response,next: NextFunction): Promise<void>;
  resendOtp(req: Request, res: Response,next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response,next:NextFunction): Promise<void>;
}


export interface IInstPasswordResetController {
  forgotPassword(req: Request, res: Response,next: NextFunction): Promise<void>;
  verifyOtpForgotPass(req: Request, res: Response,next: NextFunction): Promise<void>;
  resendOtpForgotPassword(req: Request, res: Response,next: NextFunction): Promise<void>;
  resetPassword(req: Request, res: Response,next: NextFunction): Promise<void>;
}




//courseCOnttroller
// Instructor Course View Interfaces 
export interface IInstCourseViewController {
  myCourses(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
  courseDetails(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
  purchaseDetails(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
}

//  Course Management Interfaces 
export interface IInstCourseManageController {
  addCourse(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
  editCourse(req: Request, res: Response,next: NextFunction): Promise<void>;
  refreshVideoUrl(req: Request, res: Response,next: NextFunction): Promise<void>;
  getCategory(req: Request, res: Response,next: NextFunction): Promise<void>;
}

// Quiz Management Interfaces
export interface IInstQuizController {
  addQuiz(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
  getQuiz(req: Request, res: Response,next: NextFunction): Promise<void>;
  editQuiz(req: Request, res: Response,next: NextFunction): Promise<void>;
}







//eventInstructorController
//  Event Creation & Management 
export interface IEventManageController {
  createEvents(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
  editEvent(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
  endEvent(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
}

//  Event Retrieval
export interface IEventReadController {
  getAllEvents(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
  getEvent(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
}

//  Event Participation 
export interface IEventParticipationController {
  joinEvent(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
}



//profileCOntroller
//  Profile Read Operations 
export interface IInstProfileReadController {
  getProfile(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
  getDashboardData(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
  getNotifications(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
}


// Profile Update Operations
export interface IInstProfileUpdateController {
  editProfile(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
  changePassword(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
}


// Financial Operations 
export interface IInstFinancialController {
  getEarnings(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
  getWallet(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
}


//  KYC Operations 
export interface IInstKYCController {
  kycSubmit(req: InstAuthRequest, res: Response,next: NextFunction): Promise<void>;
}





//dto
export interface InstructorDTO {
  _id: string;
  name: string;
  email: string;
  expertise?: string | undefined;
  bio?: string | undefined;
  profileImage?: string  | undefined;
  KYCApproved: boolean;
  joinedAt: Date;
  KYCstatus: "pending" | "verified" | "rejected" | "notApplied";
  work?: string  | undefined;
  education?: string  | undefined;
  blocked?: boolean  | undefined;
}



export interface IMyEventInterface {
  events: IEvent[] | null,
  instructor: IInstructor | null
}


export interface IChatInstructor {
  _id: string;
  name: string;
}


export interface IMessagedInstructor {
  instructor: IInstructor;
  lastMessage: IMessage
}


export interface ILastMessage {
  lastMessage: IMessage | null,
  unReadCount: number | null
}


export interface IPurchaseDetails {
  name: string;          // from user
  title: string;         // from course
  thumbnail?: string;    // from course
  price?: number;        // from course
  category: string;      // from course
  amountPaid: number;    // from purchase
  paymentStatus: string; // from purchase
  createdAt: Date;       // from purchase
}



export interface IEventResult {
  events: IEvent[],
  totalPages: number,
  currentPage: number
}