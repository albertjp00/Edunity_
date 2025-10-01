import { Response , Request } from "express";
import { AdminRepository, IAdminRepository } from "../../repositories/adminRepositories.js";
import { IKyc } from "../../models/kyc.js";
import { AdminInstructorService } from "../../services/admin/instructorServices.js";
import { IInsRepository, InstructorRepository } from "../../repositories/instructorRepository.js";

export class AdminInstructorController {
    private _instructorService: AdminInstructorService

    constructor(
        repo : IAdminRepository,
        Irepo : IInsRepository
    ){
                this._instructorService = new AdminInstructorService(repo,Irepo)
    }
    

    getInstructors = async(req:Request , res:Response):Promise<void>=>{
        try {
            const id = req.params.id!
            console.log('get instructorssssss ',id);
            
            const result = await this._instructorService.getInstructorsRequest(id)
            res.json({success:true , instructor:result})
        } catch (error) {
            console.log(error);
            
        }
    }

    getInstructorsCourses = async(req:Request , res:Response):Promise<void>=>{
        try {
            const id = req.params.id!
            console.log('get instructor courses ',id);
            
            const result = await this._instructorService.getInstructorsCoursesRequest(id)
            console.log(result);
            
            res.json({success:true , courses:result})
        } catch (error) {
            console.log(error);
            
        }
    }
}