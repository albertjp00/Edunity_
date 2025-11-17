import { IMyCourses, IUserRepository } from "../../interfaces/userInterfaces";
import { ICourse } from "../../models/course";
import { IMyCourse } from "../../models/myCourses";
import { IUser } from "../../models/user";
import { IAdminRepository } from "../../repositories/adminRepositories";
import {  UserRepository } from "../../repositories/userRepository";



export class AdminUserService{
    constructor(
        private adminRepository : IAdminRepository,
        private userRepository: IUserRepository
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

    getUsersCoursesRequest = async(id:string):Promise<IMyCourses | null>=>{
        try {
        const page = 1
            const result = await this.userRepository.findMyCourses(id , page)
            return result
        } catch (error) {
            console.log(error); 
            return null
            
        }
    }

}