import { FilterQuery } from "mongoose";
import { googleLoginResult, IMyCourses, IPaymentDetails, IRazorpayOrder, ISubmitQuiz, ISubscriptionCoursesService, SortOption, UserDTO } from "../interfaces/userInterfaces";
import { ICourse } from "../models/course";
import { IEvent } from "../models/events";
import { IFavourite } from "../models/favourites";
import { IInstructor } from "../models/instructor";
import { IMyCourse } from "../models/myCourses";
import { IMyEvent } from "../models/myEvents";
import { INotification } from "../models/notification";
import { IReport } from "../models/report";
import { IReview } from "../models/review";
import { ISubscription, IUser } from "../models/user";
import { IWallet } from "../models/wallet";
import { ISkills } from "../repositories/instructorRepository";
import { ICourseDetails, IviewCourse } from "../services/user/userCourseService";
import { IQuiz } from "../models/quiz";
import { LoginDTO } from "../dto/adminDTO";
import { CourseDetailsDTO, CourseDocument, MyCourseDTO } from "../dto/userDTO";

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
        courses: ICourse[];
        skills: ISkills;
        totalPages: number;
        currentPage: number;
    }>;

    getAllCourses(
        query: FilterQuery<ICourse>,
        page: number,
        limit: number,
        sortOption: SortOption
    ): Promise<{
        courses: CourseDetailsDTO[];
        totalCount: number;
        totalPages: number;
        currentPage: number;
    }>;

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
    ): Promise<IMyCourse | null>;

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

    getInstructorsRequest(): Promise<IInstructor[] | null>;

    addtoFavourites(
        userId: string,
        courseId: string
    ): Promise<string | null>;

    getFavourites(
        userId: string
    ): Promise<IFavourite[] | null>;

    favCourseDetails(
        userId: string,
        courseId: string
    ): Promise<ICourseDetails | boolean | null>;

    getQuiz(
        courseId: string
    ): Promise<IQuiz | null>;

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
  getEventsRequest(): Promise<IEvent[] | null>;
  getIfEnrolled(id: string): Promise<IMyEvent | boolean | null>;
  getEventDetailsRequest(id: string): Promise<IEvent | null>;
  eventEnrollRequest(id: string, eventId: string): Promise<IMyEvent | null>;
  getMyEvents(userId: string): Promise<IEvent[] | null>;
  joinUserEventRequest(eventId: string, userId: string): Promise<{ success: boolean; message: string; meetingLink?: string } | null>;
}



export interface IUserProfileService {
  getProfile(userId: string): Promise<UserDTO | null>;
  editProfileRequest(userId: string, updateData: Partial<IUser>): Promise<UserDTO | null>;
  passwordChange(id: string, newPassword: string, oldPassword: string): Promise<boolean>;
  getWallet(userId: string): Promise<IWallet | null>;
  getPayment(userId: string , page:number): Promise<IPaymentDetails | null>;
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
