import { AdminLoginDTO, AdminStatsDTO } from "../dto/adminDTO";
import {  PaginatedUsersService } from "../interfaces/adminInterfaces";
import { ICourse } from "../models/course";
import { IEarnings } from "../models/earnings";
import { IUser } from "../models/user";

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

export interface IAdminService {
  loginRequest(email: string, password: string): Promise<AdminLoginDTO | null>;

  getStats(): Promise<AdminStatsDTO>;

  getUserOverview(): Promise<IUserOverviewItem[]>;

  getEarningsData(page: number): Promise<IEarningsResult | null>;
}

export interface IAdminUserServices {
  getUserRequest(id: string): Promise<IUser | null>;

  getUsers(search: string, page: number): Promise<PaginatedUsersService | null>;

  blockUnblockUser(id: string): Promise<boolean | null>;

  unblockUser(id: string): Promise<boolean | null>;

  getUsersCoursesRequest(id: string): Promise<ICourse[] | null>;
}
