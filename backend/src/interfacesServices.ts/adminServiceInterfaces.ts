import { AdminLoginDTO } from "../dto/adminDTO";
import { PaginatedInstructors, PaginatedUsers } from "../interfaces/adminInterfaces";
import { IMyCourses } from "../interfaces/userInterfaces";
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
    earningsData: IEarnings[] | null;
    total: number | undefined;
}





export interface IAdminService {
    loginRequest(email: string, password: string): Promise<AdminLoginDTO>;


    getStats(): Promise<{
        totalUsers: number | null;
        totalInstructors: number | null;
        totalCourses: number | null;
        totalEnrolled: number | null;
    } | undefined>;

    getUserOverview(): Promise<IUserOverviewItem[]>;

    getEarningsData(): Promise<IEarningsResult | undefined>;
}


export interface  IAdminUserServices {

    getUserRequest(id:string):Promise<IUser | null>;

        getUsers(search: string, page: number): Promise<PaginatedUsers | null>;

    blockUnblockUser(id: string): Promise<boolean | null>;

    unblockUser(id: string): Promise<boolean | null>;

    getUsersCoursesRequest(id:string):Promise<ICourse[] | null>
}
