import { ICourse } from "../models/course";
import { IEvent } from "../models/events";
import { IFavourite } from "../models/favourites";
import { IInstructor } from "../models/instructor";
import { IMessage } from "../models/message";
import { IMyCourse } from "../models/myCourses";
import { IMyEvent } from "../models/myEvents";
import { INotification } from "../models/notification";
import { IPayment } from "../models/payment";
import { ISubscription, IUser } from "../models/user";
import { IWallet } from "../models/wallet";
import { ISkills } from "../repositories/instructorRepository";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;

  create(user: Partial<IUser>): Promise<IUser>;

  findById(id: string): Promise<IUser | null>;

  isBlocked(id: string): Promise<boolean>

  updateProfile(id: string, data: Partial<IUser>): Promise<IUser | null>;

  changePassword(id: string, password: string): Promise<IUser | null>;

  getWallet(userId: string): Promise<IWallet | null>

  getPayment(userId: string, page: number): Promise<IPaymentDetails | null>

  getCourse(id: string): Promise<ICourse | null>

  onPurchase(id: string, value: boolean ): Promise<ICourse | null>

  cancelPurchase(id: string): Promise<ICourse | null>

  buyCourse(id: string): Promise<ICourse | null>

  updateSubscription(id: string, data: Partial<ISubscription>): Promise<boolean>

  getCourses(skip: number, limit: number): Promise<ICourse[] | null>

  countCourses(): Promise<number>;

  findSkills(): Promise<ISkills>;

  getAllCourses(query: FilterQuery<ICourse>,skip: number,limit: number,sortOption: SortOption): Promise< CourseListAggregation[] | null>

  getCourseDetails(id: string, courseId: string): Promise<IMyCourse | null>

  findInstructors(): Promise<IInstructor[] | null>

  addMyCourse(id: string, data: Partial<ICourse>): Promise<IMyCourse | null>

  sendNotification(userId: string, title: string, message: string): Promise<INotification | null>

  getNotifications(userId: string, page: number): Promise<INotifications | null>

  notificationsMarkRead(userId: string): Promise<INotification[] | null>

  findMyCourses(id: string, page: number): Promise<IMyCourses | null>

  viewMyCourse(id: string, courseId: string): Promise<IMyCourse | null>

  updateProgress(userId: string, courseId: string, moduleTitle: string): Promise<boolean | null>

  getCertificate(userId: string, courseId: string, certificate: string): Promise<IMyCourse | null>

  addReview(userId: string, userName: string, userImage: string, courseId: string, rating: number, comment: string): Promise<IReview>

  getMyEvent(id: string): Promise<IMyEvent | null>

  getEvents(): Promise<IEvent[] | null>

  enrollEvent(userId: string, eventId: string): Promise<IMyEvent>

  getMyEvents(id: string): Promise<IEvent[] | null>

  addtoFavourites(id: string, courseId: string): Promise<string | null>

  getFavourites(userId: string): Promise<IFavourite[] | null>

  addParticipant(eventId: string, userId: string): Promise<IEvent | null>

  getSubscriptionActive(id: string): Promise<ISubscription | boolean>

  getSubscriptionCourses(id: string, page: number): Promise<ISubscriptionCourses | null>

  reportCourse(userId: string, courseId: string, report: IReport): Promise<boolean | null>

  countAllCourses(query: FilterQuery<ICourse>): Promise<number>

  userPayment(userId: string,courseId: string,courseName: string,coursePrice: number,): Promise<IPayment | null>

  getQuiz(courseId: string): Promise<IQuiz | null>

  getReview(userId: string, courseId: string): Promise<IReview[] | null>

  findUserCourse(userId: string, courseId: string):Promise<IMyCourse | null>

  getFavCourseDetails(userId: string,courseId: string,): Promise<IFavourite | null>

  submitQuiz(userId: string, courseId: string, score: number):Promise<IMyCourse>

  addTransaction(userId: string,transaction: WalletTransaction,): Promise<void>

  removeUserCourse(userId: string, courseId: string):Promise<boolean>

  decreaseCourseEnrollment(courseId: string):Promise<boolean>

}




// controller interfaces 
import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/authMiddleware.js";
import { IReview } from "../models/review";
import { IReport } from "../models/report";
import { INotifications } from "../interfacesServices.ts/userServiceInterfaces";
import { JwtPayload } from "jsonwebtoken";
import { FilterQuery, SortOrder } from "mongoose";
import { CourseListAggregation } from "../dto/adminDTO";
import { SubscriptionCourseDTO } from "../dto/userDTO";
import { IQuiz } from "../models/quiz";


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
  mySubscriptionCourses(req: AuthRequest, res: Response, next: NextFunction): Promise<void>
  viewMyCourse(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  refreshVideoUrl(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  updateProgress(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  getCertificate(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  reportCourse(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}

export interface IUserCourseReviewController {
  addReview(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
}

export interface IUserCourseFavoriteController {
  addtoFavourites(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
  getFavorites(req: AuthRequest, res: Response, next: NextFunction): Promise<void>;
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
export interface  UserDTO {
  id: string;
  name: string;
  email: string;
  profileImage: string | undefined;
  blocked: boolean;
  bio?: string | undefined;
  image?: string | undefined;
  gender?: string | undefined;
  dob?: string | undefined;
  location?: string | undefined;
  phone?: string | undefined;
  createdAt?: Date;
  provider?: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  id: string;
}



export interface IMessagedUser {
  instructor: IUser;
  lastMessage: IMessage
}



export interface LoginResult {
  success: boolean;
  message: string;
  user?: UserDTO;
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

export interface ISubscriptionCoursesService {
  courses: SubscriptionCourseDTO[]; 
  totalPages: number;
}

export interface ISubscriptionCourses {
  courses: ICourse[];
  totalPages: number;
}


export interface ISubmitQuiz {
  score: number,
  totalPoints: number
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


export interface IPaymentDetails {
  pay: IPayment[],
  total: number,
  totalPages: number,
  currentPage: number
}



export interface SortOption {
  price?: SortOrder
  createdAt ?:number
}

export interface IRazorpayOrder {
  id: string;
  amount: number | string;
  currency: string;
  receipt?: string;
  status: string;
  created_at: number;
}