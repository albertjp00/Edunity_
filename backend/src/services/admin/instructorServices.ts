import { IInstructor } from "../../models/instructor.js";
import { IAdminRepository } from "../../repositories/adminRepositories.js";
import { InstructorRepository } from "../../repositories/instructorRepository.js";



export class AdminInstructorService{
    constructor(private adminRepository : IAdminRepository,
        private instructorRepository: InstructorRepository
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

}