// auth.input.dto.ts

import { IReport } from "../models/report";

export interface LoginInputDto {
  email: string;
  password: string;
}

export interface RegisterInputDto {
  name: string;
  email: string;
  password: string;
}

export interface ResendOtpInputDto {
  email: string;
}

export interface VerifyOtpInputDto {
  email: string;
  otp: string;
}

export interface GoogleSignInInputDto {
  token: string;
}

export interface ForgotPasswordInputDto {
  email: string;
}

export interface VerifyForgotPasswordOtpInputDto {
  email: string;
  otp: string;
}

export interface ResendOtpForgotPasswordInputDto {
  email: string;
}

export interface ResetPasswordInputDto {
  email: string;
  newPassword: string;
}



//userCourseController


export interface ShowCoursesQueryDto {
  page?: string;
  limit?: string;
}

export interface GetAllCoursesQueryDto {
  categories?: string;
  price?: "free" | "paid";
  level?: string;
  priceMin?: string;
  priceMax?: string;
  sortBy?: "priceLowToHigh" | "priceHighToLow";
  page?: number;
  limit?: number;
  search?: string;
}

export interface CourseDetailsQueryDto {
  courseId: string;
}

export interface RefreshVideoUrlQueryDto {
  key: string;
}



export interface CourseIdParamDto {
  id: string;
}

export interface PageParamDto {
  page: string;
}

export interface MyCourseIdParamDto {
  id: string;
}

export interface CertificateParamDto {
  courseId: string;
}

export interface QuizParamDto {
  courseId: string;
}



export interface VerifyPaymentInputDto {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  courseId: string;
}

export interface VerifySubscriptionPaymentInputDto {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  planId: string;
}



export interface UpdateProgressInputDto {
  courseId: string;
  moduleTitle: string;
}



export interface AddReviewInputDto {
  courseId: string;
  rating: number;
  review: string;
}



export interface SubmitQuizInputDto {
  [questionId: string]: string;
}



export interface ReportCourseInputDto {
  courseId: string;
  report: IReport;
}


//eventsDto

export interface GetEventsInputDto {
  search?: string;
  page: number;
}


export interface JoinEventParamDto {
  eventId: string;
}


//userProfile



export interface EditProfileInputDto {
  name?: string;
  email?: string;
  bio?: string;
  phone?: string;
  location?: string;
  dob?: string;
  gender?:  'Male' | 'Female';
  profileImage?: string;
}



export interface ChangePasswordInputDto {
  oldPassword: string;
  newPassword: string;
}


