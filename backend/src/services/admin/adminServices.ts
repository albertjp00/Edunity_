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

    getInstructors = async():Promise<IUser[] | null> =>{
        try {
            const result = await this.adminRepository.findInstructors()
            return result
        } catch (error) {
            console.log(error);
            return null
        }
    }

    getKycDetails = async(id:string):Promise<void | null>=>{
        try {
            const result = await this.adminRepository.getKycDetails(id)
            return result
        } catch (error) {
            console.log(error);
            
        }
    }

    verifyKyc = async(id:string):Promise<void | null>=>{
        try {
            const result = await this.adminRepository.verifyKyc(id)
            return result
        } catch (error) {
            console.log(error);
            
        }
    }

    rejectKyc = async(id:string):Promise<void | null>=>{
        try {
            const result = await this.adminRepository.rejectKyc(id)
            return result
        } catch (error) {
            console.log(error);
            
        }
    }

}