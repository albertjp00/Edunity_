import { googleLoginResult, IMyCourses } from "../interfaces/userInterfaces";
import { ICourse, IReview } from "../models/course";
import { IEvent } from "../models/events";
import { IFavourite } from "../models/favourites";
import { IInstructor } from "../models/instructor";
import { IMyCourse } from "../models/myCourses";
import { IMyEvent } from "../models/myEvents";
import { INotification } from "../models/notification";
import { IPayment } from "../models/payment";
import { IUser } from "../models/user";
import { IWallet } from "../models/wallet";
import { ICourseDetails, IviewCourse } from "../services/user/userCourseService";

export interface LoginResult {
    success: boolean;
    message: string;
    user?: any;
    accessToken?: string;
    refreshToken?: string;
}

export interface RegisterResult {
    success: boolean;
    message: string;
}


// authetication servicess---------------------------------

export interface IUserAuthService {

    loginRequest(email: string, password: string): Promise<LoginResult>;

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
        courses: any;
        skills: any;
        totalPages: number;
        currentPage: number;
    }>;

    getAllCourses(
        query: any,
        page: number,
        limit: number,
        sortOption: any
    ): Promise<{
        courses: any;
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
    ): Promise<any>; // Razorpay order

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

    buySubscriptionRequest(userId : string):Promise<any>
    verifySubscriptionPaymentRequest(   
        razorpay_order_id: string,
        razorpay_payment_id: string,
        razorpay_signature: string,
        userId: string
    ): Promise<{ success: boolean; message: string }>;

    myCoursesRequest(
        id: string,
        page: number
    ): Promise<{ populatedCourses: IMyCourse[]; result: IMyCourses } | null>;

    mySubscriptionCoursesRequest(id:string , page:number):Promise<any>

    viewMyCourseRequest(
        id: string,
        myCourseId: string
    ): Promise<IviewCourse | null>;

    updateProgress(
        userId: string,
        courseId: string,
        moduleTitle: string
    ): Promise<any>;

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
    ): Promise<any>;

    submitQuiz(
        userId: string,
        courseId: string,
        quizId: string,
        answers: any
    ): Promise<{ score: number; totalPoints: number }>;

    cancelCourseRequest(
        userId: string,
        courseId: string
    ): Promise<void>;
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


//profile services ----------------------------



export interface IUserProfileService {
  getProfile(userId: string): Promise<any | null>;
  editProfileRequest(userId: string, updateData: Partial<any>): Promise<any | null>;
  passwordChange(id: string, newPassword: string, oldPassword: string): Promise<boolean>;
  getWallet(userId: string): Promise<IWallet | null>;
  getPayment(userId: string): Promise<IPayment[] | null>;
  getNotifications(userId: string): Promise<INotification[] | null>;
  notificationsMarkRead(userId: string): Promise<INotification[] | null>;
  subscriptionCheckRequest(id:string):Promise<boolean | null>;
}
