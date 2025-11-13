import { ICourse, IReview } from "../models/course.js";
import { IEvent } from "../models/events.js";
import { IFavourite } from "../models/favourites.js";
import { IInstructor } from "../models/instructor.js";
import { IMessage } from "../models/message.js";
import { IMyCourse } from "../models/myCourses.js";
import { IMyEvent } from "../models/myEvents.js";
import { INotification } from "../models/notification.js";
import { IPayment } from "../models/payment.js";
import { IUser } from "../models/user.js";
import { IWallet } from "../models/wallet.js";
import { ISkills } from "../repositories/instructorRepository.js";
import { UserRepository } from "../repositories/userRepository.js";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;

  create(user: Partial<IUser>): Promise<IUser>;

  findById(id: string): Promise<IUser | null>;

  isBlocked(id: string):Promise<boolean>

  updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null>;

  changePassword(id: string, password: string): Promise<IUser | null>;

  getWallet(userId: string):Promise<IWallet | null>

  getPayment(userId: string): Promise<IPayment[] | null>

  getCourse(id: string): Promise<ICourse | null>

  buyCourse(id: string): Promise<ICourse | null>

  getCourses(skip: number, limit: number): Promise<ICourse[] | null>

  countCourses(): Promise<number>;

  findSkills(): Promise<ISkills>;

  getAllCourses(query: any, skip: number, limit: number, sortOption: any): Promise<ICourse[] | null>

  getCourseDetails(id: string, courseId: string): Promise<IMyCourse | null>

  findInstructors():Promise<IInstructor[] | null>

  addMyCourse(id: string, data: any): Promise<IMyCourse | null>

  sendNotification(userId : string , title : string , message : string ):Promise<INotification | null>

  getNotifications(userId : string ):Promise<INotification[] | null>

  notificationsMarkRead(userId : string):Promise<INotification[] | null>

  findMyCourses(id: string , page : number): Promise<IMyCourses | null>

  viewMyCourse(id: string, courseId: string): Promise<IMyCourse | null>

  updateProgress(userId: string, courseId: string, moduleTitle: string): Promise<IMyCourse | null>

  getCertificate(userId: string , courseId : string , certificate : string) : Promise<IMyCourse | null>

  addReview(userId: string,userName : string , userImage : string , courseId: string, rating: number, comment: string): Promise<IReview>

  getMyEvent(id: string): Promise<IMyEvent | null>

  getEvents(): Promise<IEvent[] | null>

  getMyEvents(id:string):Promise<IEvent[] | null>

  addtoFavourites(id: string, courseId: string): Promise<IFavourite | null>

  getFavourites(userId: string): Promise<IFavourite[] | null>

  addParticipant(eventId: string,userId: string): Promise<IEvent | null>

}




// controller interfaces 
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";


//authController
export interface IAuthController {
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  refreshToken(req: Request, res: Response, next: NextFunction): void;
  logoutUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  checkBlocked(req: AuthRequest, res: Response): Promise<void>;
  register(req: Request, res: Response, next: NextFunction): Promise<void>;
  resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  googleSignIn(req: Request, res: Response, next: NextFunction): Promise<void>;
  forgotPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  verifyOtpForgotPass(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  resendOtpForgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
}



//profileController
export interface IProfileController {
  getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  editProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  getWallet(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  getPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  notifications(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  notificationsMarkRead(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}


//courseController


export interface IUserCourseController {
  showCourses(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  getAllCourses(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  courseDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  buyCourse(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  verifyPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  myCourses(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  viewMyCourse(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  refreshVideoUrl(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  updateProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  getCertificate(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  addReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  getInstructors(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  addtoFavourites(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  getFavourites(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  favCourseDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  getQuiz(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  submitQuiz(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  cancelCourse(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}




//eventController
export interface IUserEventController {
  getEvents(req: AuthRequest, res: Response, next: NextFunction): Promise<void | null>;
  getEventDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void | null>;
  enrollEvent(req: AuthRequest, res: Response, next: NextFunction): Promise<void | null>;
  getMyEvents(req: AuthRequest, res: Response): Promise<void | null>;
  joinUserEvent(req: AuthRequest, res: Response): Promise<void | null>;
}



export interface IMessagedUser {
    instructor : IUser;
    lastMessage : IMessage
}



export interface LoginResult {
  success: boolean;
  message: string;
  user?: any;
  accessToken?: string;
  refreshToken?: string;
}


export interface googleLoginResult{
     accessToken: string;
     refreshToken : string ; 
     user: IUser;
}


export interface IMyCourses {
  myCourses : IMyCourse[];
      totalCount : number;
      totalPages : number;
      currentPage : number; 
      
}


export interface WalletTransaction {
  type: "credit" | "debit";
  amount: number;
  courseId?: string;
  description?: string;
}