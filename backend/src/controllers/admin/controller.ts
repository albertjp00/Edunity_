import { Response , Request } from "express";
import { AdminRepository } from "../../repositories/adminRepositories.js";
import { AdminService } from "../../services/admin/adminServices.js";

export class AdminController {
    private adminService: AdminService

    constructor() {
        const repo = new AdminRepository();
        this.adminService = new AdminService(repo)
    }

    getUsers = async(req:Request , res:Response ):Promise<void>=>{
        try {
            console.log('admin userrsss');
            
            const users = await this.adminService.getUsers()
            res.json({success:true , users : users})
        } catch (error) {
            console.log(error);
            
        }
    }

    blockUser = async(req:Request , res:Response):Promise<void | null> =>{
            try {
                const id = req.params.id!
                console.log(id);
                
                const result = await this.adminService.blockUser(id)
                res.json({success:true})
            } catch (error) {
                console.log(error);
                return null
            }
        }

        unblockUser = async(req:Request , res:Response):Promise<void | null> =>{
            try {
                const id = req.params.id!
                const result = await this.adminService.unblockUser(id)
                res.json({success:true})
            } catch (error) {
                console.log(error);
                return null
            }
        }
}