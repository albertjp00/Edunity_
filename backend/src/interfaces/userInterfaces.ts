import { ICourse, IReview } from "../models/course";
import { IEvent } from "../models/events";
import { IFavourite } from "../models/favourites";
import { IInstructor } from "../models/instructor";
import { IMessage } from "../models/message";
import { IMyCourse } from "../models/myCourses";
import { IMyEvent } from "../models/myEvents";
import { INotification } from "../models/notification";
import { IPayment } from "../models/payment";
import { IUser } from "../models/user";
import { IWallet } from "../models/wallet";
import { ISkills } from "../repositories/instructorRepository";
import { UserRepository } from "../repositories/userRepository";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;

  create(user: Partial<IUser>): Promise<IUser>;

  findById(id: string): Promise<IUser | null>;

  isBlocked(id: string): Promise<boolean>

  updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null>;

  changePassword(id: string, password: string): Promise<IUser | null>;

  getWallet(userId: string): Promise<IWallet | null>

  getPayment(userId: string): Promise<IPayment[] | null>

  getCourse(id: string): Promise<ICourse | null>

  buyCourse(id: string): Promise<ICourse | null>

  updateSubscription(id:string , data:any):Promise<boolean>

  getCourses(skip: number, limit: number): Promise<ICourse[] | null>

  countCourses(): Promise<number>;

  findSkills(): Promise<ISkills>;

  getAllCourses(query: any, skip: number, limit: number, sortOption: any): Promise<ICourse[] | null>

  getCourseDetails(id: string, courseId: string): Promise<IMyCourse | null>

  findInstructors(): Promise<IInstructor[] | null>

  addMyCourse(id: string, data: any): Promise<IMyCourse | null>

  sendNotification(userId: string, title: string, message: string): Promise<INotification | null>

  getNotifications(userId: string): Promise<INotification[] | null>

  notificationsMarkRead(userId: string): Promise<INotification[] | null>

  findMyCourses(id: string, page: number): Promise<IMyCourses | null>

  viewMyCourse(id: string, courseId: string): Promise<IMyCourse | null>

  updateProgress(userId: string, courseId: string, moduleTitle: string): Promise<IMyCourse | null>

  getCertificate(userId: string, courseId: string, certificate: string): Promise<IMyCourse | null>

  addReview(userId: string, userName: string, userImage: string, courseId: string, rating: number, comment: string): Promise<IReview>

  getMyEvent(id: string): Promise<IMyEvent | null>

  getEvents(): Promise<IEvent[] | null>

  getMyEvents(id: string): Promise<IEvent[] | null>

  addtoFavourites(id: string, courseId: string): Promise<IFavourite | null>

  getFavourites(userId: string): Promise<IFavourite[] | null>

  addParticipant(eventId: string, userId: string): Promise<IEvent | null>

  getSubscriptionActive(id: string): Promise<boolean>

  getSubscriptionCourses(id:string , page:number):Promise<any>

}




// controller interfaces 
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";


//authController
export interface IAuthBasicController {
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  logoutUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  refreshToken(req: Request, res: Response, next: NextFunction): void;
  checkBlocked(req: AuthRequest, res: Response): Promise<void>;
}

export interface IAuthRegisterController {
  register(req: Request, res: Response, next: NextFunction): Promise<void>;
  resendOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
  verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IAuthGoogleController {
  googleSignIn(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export interface IAuthForgotPasswordController {
  forgotPassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  verifyOtpForgotPass(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  resendOtpForgotPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
}




//profileController interfaces
export interface IProfileReadController {
  getProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}

export interface IProfileWriteController {
  editProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}

export interface IPasswordController {
  changePassword(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}

export interface IWalletController {
  getWallet(req: AuthRequest, res: Response): Promise<void>;
}

export interface IPaymentController {
  getPayment(req: AuthRequest, res: Response): Promise<void>;
}

export interface INotificationController {
  notifications(req: AuthRequest, res: Response): Promise<void>;
  notificationsMarkRead(req: AuthRequest, res: Response): Promise<void>;
}



//courseController interfaces
export interface IUserCourseReadController {
  showCourses(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  getAllCourses(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  courseDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  getInstructors(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}

export interface IUserCoursePaymentController {
  buyCourse(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  verifyPayment(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  cancelCourse(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}

export interface IUserMyCourseController {
  myCourses(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  mySubscriptionCourses(req: AuthRequest, res: Response, next: NextFunction):Promise<void>
  viewMyCourse(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  refreshVideoUrl(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  updateProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  getCertificate(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}

export interface IUserCourseReviewController {
  addReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}

export interface IUserCourseFavouriteController {
  addtoFavourites(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  getFavourites(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  favCourseDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}

export interface IUserCourseQuizController {
  getQuiz(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  submitQuiz(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}




//eventController interfaces
export interface IUserEventReadController {
  getEvents(req: AuthRequest, res: Response, next: NextFunction): Promise<void | null>;
  getEventDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void | null>;
}

export interface IUserEventEnrollmentController {
  enrollEvent(req: AuthRequest, res: Response, next: NextFunction): Promise<void | null>;
  getMyEvents(req: AuthRequest, res: Response): Promise<void | null>;
}

export interface IUserEventJoinController {
  joinUserEvent(req: AuthRequest, res: Response): Promise<void | null>;
}




//DTO
export interface UserDTO {
  id: string;
  name: string;
  email: string;
  profileImage: string;
  blocked: boolean;

  bio?: string | undefined;
  image?: string | undefined;
  gender?: string | undefined;
  dob?: string | undefined;
  location?: string | undefined;
  phone?: string | undefined;
  createdAt?: string;

}




export interface IMessagedUser {
  instructor: IUser;
  lastMessage: IMessage
}



export interface LoginResult {
  success: boolean;
  message: string;
  user?: any;
  accessToken?: string;
  refreshToken?: string;
}


export interface googleLoginResult {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}


export interface IMyCourses {
  myCourses: IMyCourse[];
  totalCount: number;
  totalPages: number;
  currentPage: number;

}


export interface WalletTransaction {
  type: "credit" | "debit";
  amount: number;
  courseId?: string;
  description?: string;
}


export interface AdminUserCourseDTO {
  id: string;
  title: string;
  thumbnail: string;
}
