import { IAdminInstructorService, PaginatedInstructors } from "../../interfaces/adminInterfaces";
import { ICourse } from "../../models/course";
import { IInstructor } from "../../models/instructor";
import { IKyc } from "../../models/kyc";
import { IAdminRepository } from "../../repositories/adminRepositories";
import { IInsRepository } from "../../repositories/instructorRepository";
import { kycRejectMail } from "../../utils/sendMail";



export class AdminInstructorService implements IAdminInstructorService{
    constructor(
        private adminRepository : IAdminRepository,
        private instructorRepository: IInsRepository
    ){}

        getInstructors = async (page: string, search: string): Promise<PaginatedInstructors | null> => {
        try {
            const result = await this.adminRepository.findInstructors(page, search)            
            return result
        } catch (error) {
            console.log(error);
            return null
        }
    }

    getKycDetails = async (id: string): Promise<IKyc | null> => {
        try {
            const result = await this.adminRepository.getKycDetails(id)
            
            return result 
        } catch (error) {
            console.log(error);
            return null
        }
    }

    verifyKyc = async (id: string): Promise<void | null> => {
        try {
            const result = await this.adminRepository.verifyKyc(id)
            if(result){
                await this.adminRepository.verifyKycNotification(id)
            }
            return result
        } catch (error) {
            console.log(error);

        }
    }

    rejectKyc = async (id: string, reason: string): Promise<void | null> => {
        try {

            const result = await this.adminRepository.rejectKyc(id)
            const defaultEmail = 'albertjpaul@gmail.com'

            await kycRejectMail(defaultEmail, reason)
            return result
        } catch (error) {
            console.log(error);

        }
    }

    getInstructorsRequest = async(id:string):Promise<IInstructor | null>=>{
        try {
            const result = await this.instructorRepository.findById(id)
            return result
        } catch (error) {
            console.log(error); 
            return null
            
        }
    }

    blockInstructorRequest = async(id:string):Promise<boolean | null>=>{
        try {
            await this.adminRepository.blockUnblockInstructor(id)
            return true
        } catch (error) {
            console.log(error); 
            return null
        }
    }

    getInstructorsCoursesRequest = async(id:string):Promise<ICourse[] | null>=>{
        try {
            const result = await this.adminRepository.getInstructorCourses(id)
            return result
        } catch (error) {
            console.log(error); 
            return null
            
        }
    }

}