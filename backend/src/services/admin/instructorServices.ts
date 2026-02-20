import { DTOKyc } from "../../dto/adminDTO";
import {
  IAdminInstructorService,
  PaginatedInstructorsService,
} from "../../interfaces/adminInterfaces";
import { IAdminRepository } from "../../interfacesServices.ts/adminServiceInterfaces";
import { IInsRepository } from "../../interfacesServices.ts/instructorServiceInterface";
import {
  mapInstructorToAdminDTO,
  mapKycToDTO,
} from "../../mapper/admin.mapper";
import { ICourse } from "../../models/course";
import { IInstructor } from "../../models/instructor";
import { kycRejectMail } from "../../utils/sendMail";

export class AdminInstructorService implements IAdminInstructorService {
  constructor(
    private _adminRepository: IAdminRepository,
    private _instructorRepository: IInsRepository,
  ) {}

  getInstructors = async (
    page: string,
    search: string,
  ): Promise<PaginatedInstructorsService | null> => {
    try {
      const result = await this._adminRepository.findInstructors(page, search);

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
      const result = await this._adminRepository.getKycDetails(id);
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
      const result = await this._adminRepository.verifyKyc(id);
      if (result) {
        await this._adminRepository.verifyKycNotification(id);
      }
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  rejectKyc = async (id: string, reason: string): Promise<void | null> => {
    try {
      const result = await this._adminRepository.rejectKyc(id);
      const defaultEmail = "albertjpaul@gmail.com";

      await kycRejectMail(defaultEmail, reason);
      return result;
    } catch (error) {
      console.log(error);
    }
  };

  getInstructorsRequest = async (id: string): Promise<IInstructor | null> => {
    try {
      const result = await this._instructorRepository.findById(id);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  blockInstructorRequest = async (id: string): Promise<boolean | null> => {
    try {
      await this._adminRepository.blockUnblockInstructor(id);
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
      const result = await this._adminRepository.getInstructorCourses(id);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  };
}
