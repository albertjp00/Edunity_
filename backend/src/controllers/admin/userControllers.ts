import { Response , Request } from "express";
import { AdminUserService } from "../../services/admin/userServices";

export class AdminUserController {
    private _userService: AdminUserService

    constructor(
        adminUserService : AdminUserService
        ){
        this._userService = adminUserService
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