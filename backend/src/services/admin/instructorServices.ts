import { DTOKyc } from "../../dto/adminDTO";
import {
  IAdminInstructorService,
  PaginatedInstructors,
  PaginatedInstructorsService,
} from "../../interfaces/adminInterfaces";
import {
  mapInstructorToAdminDTO,
  mapKycToDTO,
} from "../../mapper/admin.mapper";
import { ICourse } from "../../models/course";
import { IInstructor } from "../../models/instructor";
import { IKyc } from "../../models/kyc";
import { IAdminRepository } from "../../repositories/adminRepositories";
import { IInsRepository } from "../../repositories/instructorRepository";
import { kycRejectMail } from "../../utils/sendMail";

export class AdminInstructorService implements IAdminInstructorService {
  constructor(
    private adminRepository: IAdminRepository,
    private instructorRepository: IInsRepository,
  ) {}

  getInstructors = async (
    page: string,
    search: string,
  ): Promise<PaginatedInstructorsService | null> => {
    try {
      const result = await this.adminRepository.findInstructors(page, search);
      console.log("result", result);

      return {
        instructors: result?.instructors.map(mapInstructorToAdminDTO) ?? [],
        totalInstructors: result?.totalInstructors ?? 0,
        totalPages: result?.totalPages ?? 0,
        currentPage: result?.currentPage ?? Number(page),
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getKycDetails = async (id: string): Promise<DTOKyc | null> => {
    try {
      const result = await this.adminRepository.getKycDetails(id);
      if (!result) return null;
      const dto = mapKycToDTO(result);
      return dto;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  verifyKyc = async (id: string): Promise<void | null> => {
    try {
      const result = await this.adminRepository.verifyKyc(id);
      if (result) {
        await this.adminRepository.verifyKycNotification(id);
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  rejectKyc = async (id: string, reason: string): Promise<void | null> => {
    try {
      const result = await this.adminRepository.rejectKyc(id);
      const defaultEmail = "albertjpaul@gmail.com";

      await kycRejectMail(defaultEmail, reason);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  getInstructorsRequest = async (id: string): Promise<IInstructor | null> => {
    try {
      const result = await this.instructorRepository.findById(id);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  blockInstructorRequest = async (id: string): Promise<boolean | null> => {
    try {
      await this.adminRepository.blockUnblockInstructor(id);
      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  getInstructorsCoursesRequest = async (
    id: string,
  ): Promise<ICourse[] | null> => {
    try {
      const result = await this.adminRepository.getInstructorCourses(id);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
