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



import { Request, Response } from "express";


//authCOntroller
export interface IInstAuthController {
  login(req: Request, res: Response): Promise<void>;
  register(req: Request, res: Response): Promise<void>;
  resendOtp(req: Request, res: Response): Promise<void>;
  verifyOtp(req: Request, res: Response): Promise<void>;

  forgotPassword(req: Request, res: Response): Promise<void>;
  verifyOtpForgotPass(req: Request, res: Response): Promise<void>;
  resendOtpForgotPassword(req: Request, res: Response): Promise<void>;
  resetPassword(req: Request, res: Response): Promise<void>;
}



//courseCOnttroller
export interface IInstCourseController {
  myCourses(req: InstAuthRequest, res: Response): Promise<void>;
  courseDetails(req: InstAuthRequest, res: Response): Promise<void>;
  refreshVideoUrl(req: Request, res: Response): Promise<void>;
  purchaseDetails(req: InstAuthRequest, res: Response): Promise<void>;
  editCourse(req: Request, res: Response): Promise<void>;
  addCourse(req: InstAuthRequest, res: Response): Promise<void>;
  addQuiz(req: InstAuthRequest, res: Response): Promise<void>;
  getQuiz(req: Request, res: Response): Promise<void>;
  editQuiz(req: Request, res: Response): Promise<void>;
}





export interface IEventController {
  createEvents(req: InstAuthRequest, res: Response): Promise<void>;
  getAllEvents(req: InstAuthRequest, res: Response): Promise<void>;
  getEvent(req: InstAuthRequest, res: Response): Promise<void>;
  editEvent(req: InstAuthRequest, res: Response): Promise<void>;
  joinEvent(req: InstAuthRequest, res: Response): Promise<void>;
  endEvent(req: InstAuthRequest, res: Response): Promise<void>;
}


//profileCOntroller


export interface IInstProfileController {
  getProfile(req: InstAuthRequest, res: Response): Promise<void>;
  editProfile(req: InstAuthRequest, res: Response): Promise<void>;
  changePassword(req: InstAuthRequest, res: Response): Promise<void>;
  kycSubmit(req: InstAuthRequest, res: Response): Promise<void>;
  getNotifications(req: InstAuthRequest, res: Response): Promise<void>;
  getDashboardData(req: InstAuthRequest, res: Response): Promise<void>;
  getEarnings(req: InstAuthRequest, res: Response): Promise<void>;
  getWallet(req: InstAuthRequest, res: Response): Promise<void>;
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