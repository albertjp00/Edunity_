import { IUser } from "../../models/user.js";
import { IAdminRepository } from "../../repositories/adminRepositories.js";






export class AdminService{
    constructor(private adminRepository : IAdminRepository){}

    getUsers = async():Promise<IUser[] | null> =>{
        try {
            const result = await this.adminRepository.findUsers()
            return result
        } catch (error) {
            console.log(error);
            return null
        }
    }

    blockUser = async(id:string):Promise<boolean | null> =>{
        try {
            console.log('admin service block');
            
            const result = await this.adminRepository.blockUser(id)
            return result
        } catch (error) {
            console.log(error);
            return null
        }
    }

    unblockUser = async(id:string):Promise<boolean | null> =>{
        try {
            const result = await this.adminRepository.unblockUser(id)
            return result
        } catch (error) {
            console.log(error);
            return null
        }
    }

}