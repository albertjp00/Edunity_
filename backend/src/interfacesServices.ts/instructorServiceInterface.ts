import { Types } from "mongoose";
import {
    IInstructorDashboardDTO,
  IInstructorProfileDTO,
  INotificationDTO,
  InstructorDashboardRaw,
  QuizDTO,
  WalletDto,
} from "../dto/instructorDTO";
import {
  CourseResult,
  ICourseDetailsResult,
  IEventDetailsService,
  IEventResult,
  IEventResultService,
  IPurchaseDetails,
} from "../interfaces/instructorInterfaces";
import { ICategory } from "../models/category";
import { ICourse, IModule } from "../models/course";
import { IEvent } from "../models/events";
import { IInstructor } from "../models/instructor";
import { IKyc } from "../models/kyc";
import { INotification } from "../models/notification";
import { IQuestion, IQuiz } from "../models/quiz";
import { IWallet } from "../models/wallet";
import { ISkills } from "../repositories/instructorRepository";
import { LoginResult, RegisterResult } from "./userServiceInterfaces";
import { IReview } from "../models/review";

// ------instructor auth service interfacesss --------------------
export interface IInstAuthService {
  instructorLogin(email: string, password: string): Promise<LoginResult>;

  instructorRegister(
    name: string,
    email: string,
    password: string,
  ): Promise<RegisterResult>;

  resendOtpRequest(email: string): Promise<{ success: boolean }>;

  verifyOtpRequest(
    otp: string,
    email: string,
  ): Promise<{ success: boolean; message: string }>;

  forgotPassword(email: string): Promise<{ success: boolean; message: string }>;

  verifyForgotPasswordOtp(
    otp: string,
    email: string,
  ): Promise<{ success: boolean; message: string }>;

  resetPassword(
    email: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string }>;
}

// -----instructor Course services ----------------------

export interface IInstCourseService {
  fetchCourses(
    id: string,
    search: string,
    page: number,
    limit: number,
  ): Promise<CourseResult>;

  fetchCourseDetails(courseId: string): Promise<ICourseDetailsResult | null>;

  getPurchaseDetails(id: string): Promise<IPurchaseDetails[] | null>;

  addCourseRequest(
    id: string,
    data: Partial<ICourse>,
  ): Promise<ICourse | string | null>;

  editCourseRequest(
    id: string,
    data: Partial<ICourse>,
  ): Promise<ICourse | null>;

  addQuiz(
    courseId: string,
    title: string,
    questions: IQuestion[],
  ): Promise<void>;

  getQuiz(courseId: string): Promise<QuizDTO | null>;

  updateQuiz(id: string, data: Partial<IQuiz>): Promise<void>;

  getCategoryRequest(): Promise<ICategory[] | null>;
}

export interface IInstEventService {
  createEventRequest(id: string, data: Partial<IEvent>): Promise<IEvent | null>;

  getMyEventsRequest(
    id: string,
    search: string,
    page: string,
  ): Promise<IEventResultService | null>;

  getEventRequest(id: string): Promise<IEventDetailsService | null>;

  updateEventRequest(id: string, data: Partial<IEvent>): Promise<IEvent | null>;

  joinEventRequest(
    eventId: string,
    instructorId: string,
  ): Promise<{
    success: boolean;
    message: string;
    meetingLink?: string;
  } | null>;

  endEventRequest(
    eventId: string,
    instructorId: string,
  ): Promise<{ success: boolean; message: string } | null>;
}

export interface IInstructorProfileService {
  getProfile(userId: string): Promise<IInstructorProfileDTO | null>;

  editProfileRequest(
    id: string,
    updateData: Partial<IInstructor>,
  ): Promise<boolean | null>;

  passwordChange(
    id: string,
    newPassword: string,
    oldPassword: string,
  ): Promise<boolean>;

  kycSubmit(
    id: string,
    idProof: string,
    addressProof: string,
  ): Promise<boolean | null>;

  getNotifications(id: string): Promise<INotificationDTO[] | null>;

  getDashboard(id: string): Promise<InstructorDashboardRaw | null>;

  getEarnings(
    id: string,
  ): Promise<{
    monthlyEarnings: { month: string; earnings: number }[];
    totalEarnings: number;
  } | null>;

  getWallet(id: string): Promise<WalletDto | null>;
}




export interface IInsRepository {
  findByEmail(email: string): Promise<IInstructor | null>;

  create(instructor: {
    name: string;
    email: string;
    password: string;
  }): Promise<IInstructor | null>;

  findById(id: string): Promise<IInstructor | null>;

  updateProfile(
    id: string,
    data: Partial<IInstructor>,
  ): Promise<IInstructor | null>;

  updatePassword(id: string, newPassword: string): Promise<IInstructor | null>;

  kycSubmit(
    id: string,
    idProof: string,
    addressProof: string,
  ): Promise<IKyc | null>;

  changePassword(id: string, password: string): Promise<IInstructor | null>;

  addCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null>;

  getCourses(
    id: string,
    search: string,
    skip: number,
    limit: number,
  ): Promise<ICourse[] | null>;

  getCourseDetails(courseId: string): Promise<ICourse | null>;

  purchaseDetails(courseId: string): Promise<IPurchaseDetails[] | null>;

  editCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null>;

  countCourses(id: string): Promise<number>;

  findSkills(): Promise<ISkills>;

  addEvent(id: string, name: string, data: Partial<IEvent>): Promise<IEvent>;

  getMyEvents(
    id: string,
    search: string,
    page: string,
  ): Promise<IEventResult | null>;

  getEvent(id: string): Promise<IEvent | null>;

  updateEvent(id: string, data: Partial<IEvent>): Promise<IEvent | null>;

  addQuiz(courseId: string, title: string, questions: IQuestion[]): Promise<IQuiz>;

  getQuiz(courseId: string): Promise<IQuiz | null>;

  getQuizByCourseId(courseId: string): Promise<IQuiz | null>;

  editQuiz(id: string, data: Partial<IQuiz>): Promise<IQuiz>;

  startEventById(id: string): Promise<IEvent | null>;

  endEventById(id: string): Promise<IEvent | null>;

  totalCourses(id: string): Promise<number | null>;

  // getMyCourses(id : string):Promise<string[] | null>

  getDashboard(instructorId: string): Promise<IInstructorDashboardDTO | null>;

  getCategory(): Promise<ICategory[] | null>;

  getMonthlyEarnings(instructorId: string,): Promise<{ month: string; earnings: number }[]>

  totalEarnings(id: string): Promise<number | null>

  getWallet(id: string): Promise<IWallet | null>

  getNotifications(id: string): Promise<INotification[] | null>
}













export interface LoginResultService{
    success: boolean;
    message: string;
    accessToken?: string;
    refreshToken?: string;
    statusCode?: number
}

export interface RegisterResultService {
    success: boolean;
    message: string;
}

export interface ICourseService{
_id: Types.ObjectId; 
  instructorId?: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  skills?: string[];
  level?: string;
  modules?: IModule[];
  createdAt?: Date;
  totalEnrolled?: number;
  category: string;
  onPurchase:boolean;
  averageRating?: number;
  accessType : string;
  blocked : boolean
  review : IReview[]
}