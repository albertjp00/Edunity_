import { InstructorModel } from "../models/instructor.js";
import { KycModel } from "../models/kyc.js";
import { IUser, UserModel } from "../models/user.js";




export interface IAdminRepository{
    findUsers():Promise<IUser[] | null>

    blockUser(id:string):Promise<boolean | null>

    unblockUser(id:string):Promise<boolean | null>

    findInstructors():Promise<IUser[] | null>

    getKycDetails(id:string):Promise<void | null>

    verifyKyc(id:string):Promise<void | null>

    rejectKyc(id:string):Promise<void | null>

}

export class AdminRepository implements IAdminRepository{
    async findUsers():Promise<IUser[] | null>{
        return UserModel.find()
    }

    async blockUser(id:string):Promise<boolean | null>{
        return await UserModel.findByIdAndUpdate(id,{blocked:true},{new:true})
    }

    async unblockUser(id:string):Promise<boolean | null>{
        return await UserModel.findByIdAndUpdate(id,{blocked:false},{new:true})
    }

    async findInstructors():Promise<IUser[] | null>{
        return InstructorModel.find()
    }

    async getKycDetails(id:string):Promise<void | null>{
        return KycModel.findOne({instructorId : id})
    }

    async verifyKyc(id:string):Promise<void | null>{
        return await InstructorModel.findByIdAndUpdate(id,{KYCstatus:'verified' , KYCApproved:true})
    }

    async rejectKyc(id:string):Promise<void | null>{
        const update = await InstructorModel.findByIdAndUpdate(id,{KYCstatus:'rejected'})
        const deleteKyc = await KycModel.findOneAndDelete({instructorId : id})
        return
    }

}