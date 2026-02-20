import {
  IInstructorProfileDTO,
  INotificationDTO,
  InstructorDashboardRaw,
  WalletDto,
} from "../../dto/instructorDTO";
import { IInsRepository, IInstructorProfileService } from "../../interfacesServices.ts/instructorServiceInterface";
import {
  mapDashboardToDTO,
  mapEarningsToDTO,
  mapInstructorProfileToDTO,
  mapNotificationToDTO,
  walleToDto,
} from "../../mapper/instructor.mapper";
import { IInstructor } from "../../models/instructor";
import bcrypt from "bcrypt";

export class InstructorProfileService implements IInstructorProfileService {
  private _instructorRepository: IInsRepository;

  constructor(instructorRepository: IInsRepository) {
    this._instructorRepository = instructorRepository;
  }
  async getProfile(userId: string): Promise<IInstructorProfileDTO | null> {
    try {
      const user = await this._instructorRepository.findById(userId);
      if (!user) return null;

      return mapInstructorProfileToDTO(user);
    } catch (error) {
      console.error("ProfileService.getProfile error:", error);
      throw new Error("Failed to get profile");
    }
  }

  async editProfileRequest(id: string, updateData: Partial<IInstructor>) {
    try {
      console.log("id data", id, updateData);

      const updatedUser = await this._instructorRepository.updateProfile(
        id,
        updateData,
      );
      if (!updatedUser) return null;

      return true;
    } catch (error) {
      console.error("ProfileService.updateProfile error:", error);
      throw new Error("Failed to update profile");
    }
  }

  async passwordChange(
    id: string,
    newPassword: string,
    oldPassword: string,
  ): Promise<boolean> {
    try {
      const instructor = await this._instructorRepository.findById(id);
      if (!instructor) return false;

      const isMatch = await bcrypt.compare(oldPassword, instructor.password);
      if (!isMatch) return false;

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this._instructorRepository.updatePassword(id, hashedPassword);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  kycSubmit = async (
    id: string,
    idProof: string,
    addressProof: string,
  ): Promise<boolean | null> => {
    try {
      await this._instructorRepository.kycSubmit(id, idProof, addressProof);
      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getNotifications = async (id: string): Promise<INotificationDTO[] | null> => {
    try {
      const notifications =
        await this._instructorRepository.getNotifications(id);
      if (!notifications) return null;
      return notifications?.map(mapNotificationToDTO);
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getDashboard = async (id: string): Promise<InstructorDashboardRaw | null> => {
    try {
      const data = await this._instructorRepository.getDashboard(id);
      if (!data) return null;
      return mapDashboardToDTO(data);
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getEarnings = async (
    id: string,
  ): Promise<{
    monthlyEarnings: { month: string; earnings: number }[];
    totalEarnings: number;
  } | null> => {
    try {
      const monthlyEarnings =
        await this._instructorRepository.getMonthlyEarnings(id);
      const totalEarnings =
        (await this._instructorRepository.totalEarnings(id)) ?? 0;

      const mapped = mapEarningsToDTO({ monthlyEarnings, totalEarnings });

      return mapped;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getWallet = async (id: string): Promise<WalletDto | null> => {
    try {
      const wallet = await this._instructorRepository.getWallet(id);
      if (!wallet) return null;

      return walleToDto(wallet);
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
