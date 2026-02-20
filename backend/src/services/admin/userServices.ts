import {
  PaginatedUsersService,
} from "../../interfaces/adminInterfaces";
import { IUserRepository } from "../../interfaces/userInterfaces";
import { IAdminRepository, IAdminUserServices } from "../../interfacesServices.ts/adminServiceInterfaces";
import { mapUserToDTO } from "../../mapper/user.mapper";
import { ICourse } from "../../models/course";
import { IUser } from "../../models/user";

export class AdminUserService implements IAdminUserServices {
  constructor(
    private _adminRepository: IAdminRepository,
    private _userRepository: IUserRepository,
  ) {}

  getUserRequest = async (id: string): Promise<IUser | null> => {
    try {
      const result = await this._userRepository.findById(id);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getUsers = async (
    search: string,
    page: number,
  ): Promise<PaginatedUsersService | null> => {
    try {
      const result = await this._adminRepository.findUsers(search, page);
      if (!result) return null;
      return {
        users: result.users.map(mapUserToDTO),
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        totalUsers: result.totalUsers,
      };
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

  getUsersCoursesRequest = async (id: string): Promise<ICourse[] | null> => {
    try {
      // const page = 1
      const result = await this._adminRepository.findUserCourses(id);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
