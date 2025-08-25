import { Response , Request } from "express";
import { AdminRepository } from "../../repositories/adminRepositories.js";
import { IKyc } from "../../models/kyc.js";
import { AdminInstructorService } from "../../services/admin/instructorServices.js";
import { UserRepository } from "../../repositories/userRepository.js";
import { AdminUserService } from "../../services/admin/userServices.js";

export class AdminUserController {
    private userService: AdminUserService

    constructor() {
        const repo = new AdminRepository();
        const Urepo = new UserRepository()
        this.userService = new AdminUserService(repo,Urepo)
    }

    getUser = async(req:Request , res:Response):Promise<void>=>{
        try {
            const id = req.params.id!
            console.log('get user ',id);
            
            const result = await this.userService.getUserRequest(id)
            res.json({success:true , user:result})
        } catch (error) {
            console.log(error);
        }
    }

    getUserCourses = async(req:Request , res:Response):Promise<void>=>{
        try {
            const id = req.params.id!
            console.log('get instructor courses ',id);
            
            const result = await this.userService.getUsersCoursesRequest(id)
            console.log(result);
            
            res.json({success:true , courses:result})
        } catch (error) {
            console.log(error);
            
        }
    }
}