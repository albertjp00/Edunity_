import { PaginatedUsers } from "../../interfaces/adminInterfaces";
import { IMyCourses, IUserRepository } from "../../interfaces/userInterfaces";
import { IAdminUserServices } from "../../interfacesServices.ts/adminServiceInterfaces";
import { ICourse } from "../../models/course";
import { IMyCourse } from "../../models/myCourses";
import { IUser } from "../../models/user";
import { IAdminRepository } from "../../repositories/adminRepositories";
import {  UserRepository } from "../../repositories/userRepository";



export class AdminUserService implements IAdminUserServices {
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

    getUsers = async (search: string, page: number): Promise<PaginatedUsers | null> => {
            try {
                const result = await this.adminRepository.findUsers(search, page)
                return result
            } catch (error) {
                console.log(error);
                return null
            }
        }
    
        blockUnblockUser = async (id: string): Promise<boolean | null> => {
            try {
                console.log('admin service block');
    
                const user = await this.userRepository.findById(id)
                if (user?.blocked) {
                    return await this.adminRepository.unblockUser(id)
                } else {
                    return await this.adminRepository.blockUser(id)
                }
            } catch (error) {
                console.log(error);
                return null
            }
        }
    
        unblockUser = async (id: string): Promise<boolean | null> => {
            try {
                const result = await this.adminRepository.unblockUser(id)
                return result
            } catch (error) {
                console.log(error);
                return null
            }
        }

    getUsersCoursesRequest = async(id:string):Promise<ICourse[] | null>=>{
        try {
        const page = 1
            const result = await this.adminRepository.findUserCourses(id , page)
            return result
        } catch (error) {
            console.log(error); 
            return null
            
        }
    }

}