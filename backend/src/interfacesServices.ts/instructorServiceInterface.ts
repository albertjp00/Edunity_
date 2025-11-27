import { IEventResult, IPurchaseDetails } from "../interfaces/instructorInterfaces";
import { ICourse } from "../models/course";
import { IEvent } from "../models/events";
import { INotification } from "../models/notification";
import { IWallet } from "../models/wallet";
import { LoginResult, RegisterResult } from "./userServiceInterfaces";






// ------instructor auth service interfacesss --------------------  
export interface IInstAuthService {
    instructorLogin(email: string, password: string): Promise<LoginResult>;

    instructorRegister(
        name: string,
        email: string,
        password: string
    ): Promise<RegisterResult>;

    resendOtpRequest(email: string): Promise<{ success: boolean }>;

    verifyOtpRequest(
        otp: string,
        email: string
    ): Promise<{ success: boolean; message: string }>;

    forgotPassword(email: string): Promise<{ success: boolean; message: string }>;

    verifyForgotPasswordOtp(
        otp: string,
        email: string
    ): Promise<{ success: boolean; message: string }>;

    resetPassword(
        email: string,
        newPassword: string
    ): Promise<{ success: boolean; message: string }>;
}






// -----instructor Course services ----------------------




export interface IInstCourseService {
    fetchCourses(id: string, search: string, page: number, limit: number): Promise<{
        courses: ICourse[] | null;
        skills: any;
        totalPages: number;
        currentPage: number;
        totalItems: number;
        instructor: any;
    }>;

    fetchCourseDetails(courseId: string): Promise<{
        course: ICourse | null;
        quizExists: boolean;
    } | null>;

    getPurchaseDetails(id: string): Promise<IPurchaseDetails[] | null>;

    addCourseRequest(id: string, data: any): Promise<ICourse | null>;

    editCourseRequest(id: string, data: Partial<ICourse>): Promise<ICourse | null>;

    addQuiz(courseId: string, title: string, questions: any[]): Promise<any>;

    getQuiz(courseId: string): Promise<any>;

    updateQuiz(id: string, data: any): Promise<any>;
}



export interface IInstEventService {
    createEventRequest(id: string, data: any): Promise<IEvent | null>;

    getMyEventsRequest(id: string, search: string, page: string): Promise<IEventResult | null>;

    getEventRequest(id: string): Promise<IEvent | null>;

    updateEventRequest(id: string, data: any): Promise<IEvent | null>;

    joinEventRequest(eventId: string, instructorId: string): Promise<{ success: boolean; message: string; meetingLink?: string } | null>;

    endEventRequest(eventId: string, instructorId: string): Promise<{ success: boolean; message: string } | null>;

}



export interface IInstructorProfileService {
  getProfile(userId: string): Promise<any | null>;
  editProfileRequest(id: string, updateData: Partial<any>): Promise<boolean | null>;
  passwordChange(id: string, newPassword: string, oldPassword: string): Promise<boolean>;
  kycSubmit(id: string, idProof: string, addressProof: string): Promise<boolean | null>;
  getNotifications(id: string): Promise<INotification[] | null>;
  getDashboard(id: string): Promise<void>;
  getEarnings(id: string): Promise<{ monthlyEarnings: { month: string; earnings: number }[]; totalEarnings: number } | null>;
  getWallet(id: string): Promise<IWallet | null>;
}
