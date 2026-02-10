import { FilterQuery } from "mongoose";
import { googleLoginResult, IMyCourses, IRazorpayOrder, ISubmitQuiz, ISubscriptionCoursesService, SortOption, UserDTO } from "../interfaces/userInterfaces";
import { ICourse } from "../models/course";
import { IInstructor } from "../models/instructor";
import {  IProgress } from "../models/myCourses";
import { IMyEvent } from "../models/myEvents";
import { INotification } from "../models/notification";
import { IReport } from "../models/report";
import { IReview } from "../models/review";
import { ISubscription, IUser } from "../models/user";
import { ISkills } from "../repositories/instructorRepository";
import { ICourseDetails } from "../services/user/userCourseService";
import { LoginDTO } from "../dto/adminDTO";
import { CourseDetailsDTO,  CourseViewDTO, EventDTO, FavoriteCourseDTO, MyCourseDTO, PayDto, QuizUserDTO, UserInstructorDTO } from "../dto/userDTO";

export interface LoginResult {
    success: boolean;
    message: string;
    user?: IUser;
    accessToken?: string;
    refreshToken?: string;
}

export interface RegisterResult {
    success: boolean;
    message: string;
}




// authetication servicess---------------------------------

export interface IUserAuthService {

    loginRequest(email: string, password: string): Promise<LoginDTO | LoginResult>;

    isBlocked(id: string): Promise<boolean | null>;

    registerRequest(
        name: string,
        email: string,
        password: string
    ): Promise<RegisterResult>;

    resendOtpRequest(email: string): Promise<{ success: boolean }>;

    verifyOtpRequest(
        otp: string,
        email: string
    ): Promise<{ success: boolean; message: string }>;

    googleLogin(token: string): Promise<googleLoginResult>;

    forgotPassword(
        email: string
    ): Promise<{ success: boolean; message: string }>;

    verifyForgotPasswordOtp(
        otp: string,
        email: string
    ): Promise<{ success: boolean; message: string }>;

    resetPassword(
        email: string,
        newPassword: string
    ): Promise<{ success: boolean; message: string }>;
}




//course services-----------------------------------

export interface IUserCourseService {

    getCourses(page: number,limit: number): Promise<{
        courses: ICourse[] | null;
        skills: ISkills;
        totalPages: number;
        currentPage: number;
    } | null>;

    getAllCourses(
        query: FilterQuery<ICourse>,
        page: number,
        limit: number,
        sortOption: SortOption
    ): Promise<{
        courses: CourseDetailsDTO[] | ICourse | null;
        totalCount: number;
        totalPages: number;
        currentPage: number;
    } | null>;

    fetchCourseDetails(
        userId: string,
        courseId: string
    ): Promise<ICourseDetails | string | null>;

    buyCourseRequest(
        userId: string,
        courseId: string
    ): Promise<IRazorpayOrder>; 

    cancelPayment(
        courseId: string
    ): Promise<void>;

    verifyPaymentRequest(
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string,
        courseId: string,
        userId: string
    ): Promise<{ success: boolean; message: string }>;

    buySubscriptionRequest(userId : string): Promise<IRazorpayOrder>

    verifySubscriptionPaymentRequest(   
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string,
        userId: string
    ): Promise<{ success: boolean; message: string }>;

    myCoursesRequest(
        id: string,
        page: number
    ): Promise<{ populatedCourses: MyCourseDTO[]; result: IMyCourses } | null>;

    mySubscriptionCoursesRequest(id:string , page:number):Promise<ISubscriptionCoursesService | null>

    viewMyCourseRequest(
        id: string,
        myCourseId: string
    ): Promise<IviewCourse | null>;

    updateProgress(
        userId: string,
        courseId: string,
        moduleTitle: string
    ): Promise<boolean | null>;

    getCertificateRequest(
        userId: string,
        courseId: string
    ): Promise<{ filePath?: string; success?: boolean; message?: string }>;

    addReview(
        userId: string,
        courseId: string,
        rating: number,
        review: string
    ): Promise<IReview | null | string | undefined>;

    getInstructorsRequest(): Promise<UserInstructorDTO[] | null>;

    addtoFavourites(
        userId: string,
        courseId: string
    ): Promise<string | null>;

    getFavorites(
        userId: string
    ): Promise<FavoriteCourseDTO[] | null>;

    favCourseDetails(
        userId: string,
        courseId: string
    ): Promise<ICourseDetails | boolean | null>;

    getQuiz(
        courseId: string
    ): Promise<QuizUserDTO | null>;

    submitQuiz(
        userId: string,
        courseId: string,
        answers: string
    ): Promise<ISubmitQuiz>;

    cancelCourseRequest(
        userId: string,
        courseId: string
    ): Promise<void>;

    reportCourseRequest(
        userId : string,
        courseId : string,
        report : IReport
    ):Promise<void>;
}





// event services --------------------------------



export interface IUserEventService {
  getEventsRequest(): Promise<EventDTO[] | null>;
  getIfEnrolled(id: string): Promise<IMyEvent | boolean | null>;
  getEventDetailsRequest(id: string): Promise<EventDTO | null>;
  eventEnrollRequest(id: string, eventId: string): Promise<IMyEvent | null>;
  getMyEvents(userId: string): Promise<EventDTO[] | null>;
  joinUserEventRequest(eventId: string, userId: string): Promise<{ success: boolean; message: string; meetingLink?: string } | null>;
}



export interface IUserProfileService {
  getProfile(userId: string): Promise<UserDTO | null>;
  editProfileRequest(userId: string, updateData: Partial<IUser>): Promise<UserDTO | null>;
  passwordChange(id: string, newPassword: string, oldPassword: string): Promise<boolean>;
  getWallet(userId: string): Promise<WalletDto | null>;
  getPayment(userId: string , page:number): Promise<IPaymentDetailsService | null>;
  getNotifications(userId: string , page : number): Promise<INotifications | null>;
  notificationsMarkRead(userId: string): Promise<INotification[] | null>;
  subscriptionCheckRequest(id:string):Promise<ISubscription | boolean | null>;
}


export interface INotifications {
    notifications : INotification[]
    total : number
}



export interface LoginResult {
    success: boolean;
    message: string;
    user?: IUser;
    accessToken?: string;
    refreshToken?: string;
}

export interface RegisterResult {
    success: boolean;
    message: string;
}


export interface IviewCourse {
  course: CourseViewDTO,
  instructor: IInstructor
  progress: IProgress
  cancelCourse: boolean
  quizExists: boolean
  enrolledAt: Date
  review: IReview[] | null
}



export interface IFavourites{
    _id: string,
    userId: string,
    courseId: string,
    course : ICourse
}



import { Types } from "mongoose";
import { WalletDto } from "../dto/instructorDTO";

export interface IQuizQuestion {
  _id: Types.ObjectId;
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

export interface IQuizService {
  _id: Types.ObjectId;
  courseId: string;
  title: string;
  questions: IQuizQuestion[];
}



export interface IPaymentDetailsService {
  pay: PayDto[],
  total: number,
  totalPages: number,
  currentPage: number
}




export interface ICourseModule {
  _id: Types.ObjectId;
  title: string;
  videoUrl: string;
  content: string;
}

export type  AccessType = "oneTime" | "subscription"


export interface ICourseView {
  _id: Types.ObjectId;
  instructorId: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  skills: string[];
  level: string;
  category: string;
  accessType: AccessType;   
  totalEnrolled?: number;
  onPurchase: boolean;
  blocked: boolean;
  createdAt: Date;
  modules: ICourseModule[];
}

