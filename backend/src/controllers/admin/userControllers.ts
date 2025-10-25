import { Response , Request } from "express";
import { AdminRepository, IAdminRepository } from "../../repositories/adminRepositories";
import { IKyc } from "../../models/kyc.js";
import { AdminInstructorService } from "../../services/admin/instructorServices";
import {  UserRepository } from "../../repositories/userRepository";
import { AdminUserService } from "../../services/admin/userServices";
import { IUserRepository } from "../../interfaces/userInterfaces";

export class AdminUserController {
    private _userService: AdminUserService

    constructor(
        repo:IAdminRepository,
        Urepo:IUserRepository
    ){
        this._userService = new AdminUserService(repo,Urepo)
    }

    getUser = async(req:Request , res:Response):Promise<void>=>{
        try {
            const id = req.params.id!
            console.log('get user ',id);
            
            const result = await this._userService.getUserRequest(id)
            res.json({success:true , user:result})
        } catch (error) {
            console.log(error);
        }
    }

    getUserCourses = async(req:Request , res:Response):Promise<void>=>{
        try {
            const id = req.params.id!
            console.log('get instructor courses ',id);
            
            const result = await this._userService.getUsersCoursesRequest(id)
            console.log(result);
            
            res.json({success:true , courses:result})
        } catch (error) {
            console.log(error);
            
        }
    }
}