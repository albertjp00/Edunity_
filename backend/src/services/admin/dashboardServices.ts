import { IAdminRepository } from "../../repositories/adminRepositories";
import { UserRepository } from "../../repositories/userRepository";
import jwt from "jsonwebtoken";
import { PaginatedUsers } from "../../interfaces/adminInterfaces";
import {
  IAdminService,
  IEarningsResult,
} from "../../interfacesServices.ts/adminServiceInterfaces";
import { AdminLoginDTO, AdminStatsDTO } from "../../dto/adminDTO";
import { AdminLoginMapper, AdminStatsMapper, mapUserOverviewToDTO } from "../../mapper/admin.mapper";

export class AdminService implements IAdminService {
  constructor(
    private adminRepository: IAdminRepository,
    private userRepository: UserRepository,
  ) {}

  loginRequest = async (
    email: string,
    password: string,
  ): Promise<AdminLoginDTO> => {
    try {
      const admin = await this.adminRepository.findByEmail(email, password);

      if (!admin) {
        return {
          success: false,
          message: "Password incorrect",
        };
      }

      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: "admin" },
        process.env.SECRET_KEY as string,
        { expiresIn: "1d" },
      );

      return AdminLoginMapper(token);
    } catch (error) {
      console.error(error);
      return {
        success: false,
        message: "Internal server error",
      };
    }
  };

  getUsers = async (
    search: string,
    page: number,
  ): Promise<PaginatedUsers | null> => {
    try {
      const result = await this.adminRepository.findUsers(search, page);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  blockUnblockUser = async (id: string): Promise<boolean | null> => {
    try {
      console.log("admin service block");

      const user = await this.userRepository.findById(id);
      if (user?.blocked) {
        return await this.adminRepository.unblockUser(id);
      } else {
        return await this.adminRepository.blockUser(id);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  unblockUser = async (id: string): Promise<boolean | null> => {
    try {
      const result = await this.adminRepository.unblockUser(id);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getStats = async (): Promise<AdminStatsDTO> => {
    try {
      const totalUsers = await this.adminRepository.getTotalUsers();
      const totalInstructors = await this.adminRepository.getTotalInstructors();
      const totalCourses = await this.adminRepository.getCourses();
      const totalEnrolled = await this.adminRepository.getTotalEnrolled();

      return AdminStatsMapper({
        totalUsers,
        totalInstructors,
        totalCourses,
        totalEnrolled,
      });
    } catch (error) {
      console.log(error);
      return {
        totalUsers: 0,
        totalInstructors: 0,
        totalCourses: 0,
        totalEnrolled: [],
      };
    }
  };

  getUserOverview = async () => {
    try {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      const usersByMonth =
        await this.adminRepository.getUserOverview(oneYearAgo);

      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const now = new Date();
      const months: { name: string; count: number }[] = [];

      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const name = `${monthNames[month - 1]} ${year}`;
        months.push({ name, count: 0 });
      }

      usersByMonth.forEach((item: any) => {
        const [year, month] = item._id.split("-");
        const monthName = `${monthNames[parseInt(month) - 1]} ${year}`;
        const found = months.find((m) => m.name === monthName);
        if (found) found.count = item.count;
      });

      console.log('months',months);
      const dto = mapUserOverviewToDTO(months);

      return dto;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getEarningsData = async (page: number): Promise<IEarningsResult | null> => {
    try {
      const earningsData = await this.adminRepository.getEarningsData(page);

      const earnings = earningsData?.earnings || [];
      const totalPages = earningsData?.totalPages || 0;
      const totalEarnings = earnings
        ?.map((earning) => {
          return earning.adminEarnings;
        })
        .reduce((acc, curr) => acc + curr);

      // console.log('get earnings data',earningsData , total);
      return { earnings, totalEarnings, totalPages };
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
