import { ICourse } from "../../models/course.js";
import { IMyCourse } from "../../models/myCourses.js";
import { IUser } from "../../models/user.js";
import { IAdminRepository } from "../../repositories/adminRepositories.js";
import { UserRepository } from "../../repositories/userRepository.js";



export class AdminUserService{
    constructor(private adminRepository : IAdminRepository,
        private userRepository: UserRepository
    ){}

    getUserRequest = async(id:string):Promise<IUser | null>=>{
        try {
            const result = await this.userRepository.findById(id)
            return result
        } catch (error) {
            console.log(error); 
            return null
            
        }
    }

    getUsersCoursesRequest = async(id:string):Promise<IMyCourse[] | null>=>{
        try {
            const result = await this.userRepository.findMyCourses(id)
            return result
        } catch (error) {
            console.log(error); 
            return null
            
        }
    }

}