import { IUser, UserModel } from "../models/user.js";




export interface IAdminRepository{
    findUsers():Promise<IUser[] | null>

    blockUser(id:string):Promise<boolean | null>

    unblockUser(id:string):Promise<boolean | null>
}

export class AdminRepository implements IAdminRepository{
    async findUsers():Promise<IUser[] | null>{
        return UserModel.find()
    }

    async blockUser(id:string):Promise<boolean | null>{
        return await UserModel.findByIdAndUpdate(id,{blocked:true},{new:true})
    }

    async unblockUser(id:string):Promise<boolean | null>{
        return await UserModel.findById(id,{block:false},{new:true})
    }
}