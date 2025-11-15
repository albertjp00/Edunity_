import { ICourse } from "../../models/course";
import { IInstructor } from "../../models/instructor";
import { IAdminRepository } from "../../repositories/adminRepositories";
import { IInsRepository, InstructorRepository } from "../../repositories/instructorRepository";



export class AdminInstructorService{
    constructor(private adminRepository : IAdminRepository,
        private instructorRepository: IInsRepository
    ){}

    getInstructorsRequest = async(id:string):Promise<IInstructor | null>=>{
        try {
            const result = await this.instructorRepository.findById(id)
            return result
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