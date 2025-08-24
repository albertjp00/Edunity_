import { Response , Request } from "express";
import { AdminRepository } from "../../repositories/adminRepositories.js";
import { IKyc } from "../../models/kyc.js";
import { AdminInstructorService } from "../../services/admin/instructorServices.js";

export class AdminInstructorController {
    private instructorService: AdminInstructorService

    constructor() {
        const repo = new AdminRepository();
        this.instructorService = new AdminInstructorService(repo)
    }

    getInstructors = async(req:Request , res:Response):Promise<void>=>{
        try {
            const id = req.params.id!
            const result = await this.instructorService.getInstructorsRequest(id)
            res.json({success:true , instructor:result})
        } catch (error) {
            console.log(error);
            
        }
    }
}