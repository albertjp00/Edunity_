import jwt from "jsonwebtoken";
import { PaginatedUsers } from "../../interfaces/adminInterfaces";
import {
  EarningsFilter,
  EarningsSort,
  IAdminRepository,
  IAdminService,
  IEarningsResult,
} from "../../interfacesServices.ts/adminServiceInterfaces";
import { AdminLoginDTO, AdminStatsDTO } from "../../dto/adminDTO";
import { AdminLoginMapper, AdminStatsMapper } from "../../mapper/admin.mapper";
import { IUserRepository } from "../../interfaces/userInterfaces";
import { getLast12Months, MONTH_NAMES } from "../../utils/data.utils";

const refresh: string = process.env.REFRESH_KEY || "refresh_secret";


export class AdminService implements IAdminService {
  constructor(
    private _adminRepository: IAdminRepository,
    private _userRepository: IUserRepository,
  ) {}

  loginRequest = async (
    email: string,
    password: string,
  ): Promise<AdminLoginDTO> => {
    try {
      const admin = await this._adminRepository.findByEmail(email, password);

      if (!admin) {
        return {
          success: false,
          message: "Password incorrect",
        };
      }

      const token = jwt.sign(
        { id: admin._id, email: admin.email, role: "admin" },
        process.env.SECRET_KEY as string,
        { expiresIn: "1h" },
      );
      const refreshToken = jwt.sign({ id: admin._id }, refresh, { expiresIn: "2h" });

      return AdminLoginMapper({token , refreshToken});
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
      const result = await this._adminRepository.findUsers(search, page);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  blockUnblockUser = async (id: string): Promise<boolean | null> => {
    try {

      const user = await this._userRepository.findById(id);
      if (user?.blocked) {
        return await this._adminRepository.unblockUser(id);
      } else {
        return await this._adminRepository.blockUser(id);
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  unblockUser = async (id: string): Promise<boolean | null> => {
    try {
      const result = await this._adminRepository.unblockUser(id);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getStats = async (): Promise<AdminStatsDTO> => {
    try {
      const totalUsers = await this._adminRepository.getTotalUsers();
      const totalInstructors = await this._adminRepository.getTotalInstructors();
      const totalCourses = await this._adminRepository.getCourses();
      const totalEnrolled = await this._adminRepository.getTotalEnrolled();

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

getUserOverview = async (): Promise<{ name: string; count: number }[]> => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const usersByMonth =
      await this._adminRepository.getUserOverview(oneYearAgo);

    const months = getLast12Months();

    usersByMonth.forEach((item) => {
      const [year, month] = item._id.split("-");
      const monthIndex = parseInt(month || '') - 1;

      

const monthName = `${MONTH_NAMES[monthIndex]} ${year}`;


      const found = months.find(m => m.name === monthName);
      if (found) found.count = item.count;
    });

    return months; // ✅ ARRAY
  } catch (error) {
    console.error(error);
    throw error;
  }
};


  getEarningsData = async (page: number,
    fromDate: string | undefined,
    toDate: string | undefined,
    sort: string | undefined,): Promise<IEarningsResult | null> => {
    try {

      const filter :EarningsFilter = {};

    if (fromDate && toDate) {
      filter.lastUpdated = {
        $gte: new Date(fromDate as string),
        $lte: new Date(toDate as string),
      };
    }
    


    let sortOption : EarningsSort = { lastUpdated: -1 };

    if (sort === "adminHigh") sortOption = { adminEarnings: -1 };
    if (sort === "adminLow") sortOption = { adminEarnings: 1 };
    if (sort === "latest") sortOption = { lastUpdated: -1 };

      const earningsData = await this._adminRepository.getEarningsData(page ,filter , sortOption);

      const earnings = earningsData?.earnings || [];
      const totalPages = earningsData?.totalPages || 0;
      const totalEarnings = earnings
        ?.map((earning) => {
          return earning.adminEarnings;
        })
        .reduce((acc, curr) => acc + curr);

      return { earnings, totalEarnings, totalPages };
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
