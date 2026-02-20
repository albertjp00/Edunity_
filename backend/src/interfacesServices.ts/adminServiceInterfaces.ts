import {
  AdminLoginDTO,
  AdminStatsDTO,
  TotalEnrolledDTO,
} from "../dto/adminDTO";
import {
  IAdminCourseDetails,
  IUserOverview,
  PaginatedInstructors,
  PaginatedUsers,
  PaginatedUsersService,
  PurchaseResult,
} from "../interfaces/adminInterfaces";
import { ICategory } from "../models/category";
import { ICourse } from "../models/course";
import { IEarnings } from "../models/earnings";
import { IKyc } from "../models/kyc";
import { IMyCourse } from "../models/myCourses";
import { INotification } from "../models/notification";
import { IQuiz } from "../models/quiz";
import { IReport } from "../models/report";
import { ISubscriptionPlan } from "../models/subscription";
import { IUser } from "../models/user";

export interface IAdminService {
  loginRequest(email: string, password: string): Promise<AdminLoginDTO | null>;

  getStats(): Promise<AdminStatsDTO>;

  getUserOverview(): Promise<IUserOverviewItem[]>;

  getEarningsData(
    page: number,
    fromDate: string | undefined,
    toDate: string | undefined,
    sort: string | undefined,
  ): Promise<IEarningsResult | null>;
}

export interface IAdminUserServices {
  getUserRequest(id: string): Promise<IUser | null>;

  getUsers(search: string, page: number): Promise<PaginatedUsersService | null>;

  blockUnblockUser(id: string): Promise<boolean | null>;

  unblockUser(id: string): Promise<boolean | null>;

  getUsersCoursesRequest(id: string): Promise<ICourse[] | null>;
}

export interface IAdminRepository {
  findByEmail(email: string, password: string): Promise<IUser | null>;

  findUsers(search: string, page: number): Promise<PaginatedUsers | null>;

  blockUser(id: string): Promise<boolean | null>;

  unblockUser(id: string): Promise<boolean | null>;

  findUserCourses(id: string): Promise<ICourse[] | null>;

  findInstructors(
    page: string,
    search: string,
  ): Promise<PaginatedInstructors | null>;

  getKycDetails(id: string): Promise<IKyc | null>;

  verifyKyc(id: string): Promise<void | null>;

  rejectKyc(id: string): Promise<void | null>;

  verifyKycNotification(id: string): Promise<INotification | null>;

  getInstructorCourses(id: string): Promise<ICourse[] | null>;

  getCourseDetails(courseId: string): Promise<ICourse | null>;

  findByCourseId(courseId: string): Promise<IMyCourse[] | null>;

  getFullCourseDetails(courseId: string): Promise<IAdminCourseDetails | null>;

  getQuiz(courseId: string): Promise<IQuiz[] | null>;

  getPurchases(search: string, page: number): Promise<PurchaseResult | null>;

  addCategory(category: string, skills: string[]): Promise<ICategory | string | null>;
  getCategory(): Promise<ICategory[] | null>;
  deleteCategory(category: string): Promise<boolean | null>;

  getTotalUsers(): Promise<number | null>;
  getTotalInstructors(): Promise<number | null>;
  getCourses(): Promise<number | null>;
  getTotalEnrolled(): Promise<TotalEnrolledDTO[] | null>;
  getUserOverview(oneYearAgo: Date): Promise<IUserOverview[]>;

  getEarningsData(page: number,
      filter : EarningsFilter,
      sortOption : EarningsSort): Promise<IEarningsResult | null>;

  blockCourse(courseId: string): Promise<boolean | null>;

  getReports(): Promise<IReport[] | null>;

  blockUnblockInstructor(id: string): Promise<boolean>;

  updateEarnings(
    courseId: string,
    coursePrice: number,
    instructorId: string,
    instructorEarning: number,
    adminEarning: number,
  ): Promise<void>;

  addSubscription(data: ISubscriptionPlan):Promise<boolean | null>

  getSubscription(): Promise<ISubscriptionPlan[] | null>

  updateSubscription(id : string , data : Partial<ISubscriptionPlan>): Promise<boolean | null>
}

export interface AdminLoginResult {
  success: boolean;
  message: string;
  token?: string;
}

export interface IUserOverviewItem {
  name: string;
  count: number;
}

export interface IEarningsResult {
  earnings: IEarnings[] | null;
  totalEarnings?: number | null;
  totalPages: number;
}

export interface ITotalEnrolled {
  month: string;
  enrolled: string;
}


export interface EarningsFilter {
  lastUpdated?: {
    $gte?: Date;
    $lte?: Date;
  };
  instructorId?: string;
  coursePrice?: {
    $gte?: number;
    $lte?: number;
  };
}


export type EarningsSort =
  | { lastUpdated: -1 }
  | { adminEarnings: -1 }
  | { adminEarnings: 1 };