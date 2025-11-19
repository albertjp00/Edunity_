import { Response , Request } from "express";

import { AdminInstructorService } from "../../services/admin/instructorServices";
import { HttpStatus } from "../../enums/httpStatus.enums";

export class AdminInstructorController {
    private _adminInstructorService: AdminInstructorService

    constructor(adminInstructorService : AdminInstructorService){
            this._adminInstructorService = adminInstructorService
    }
    

    getInstructors = async(req:Request , res:Response):Promise<void>=>{
        try {
            const id = req.params.id!
            console.log('get instructorssssss ',id);
            
            const result = await this._adminInstructorService.getInstructorsRequest(id)
            res.status(HttpStatus.OK).json({success:true , instructor:result})
        } catch (error) {
            console.log(error);
            
        }
    }

    getInstructorsCourses = async(req:Request , res:Response):Promise<void>=>{
        try {
            const id = req.params.id!
            console.log('get instructor courses ',id);
            
            const result = await this._adminInstructorService.getInstructorsCoursesRequest(id)
            console.log(result);
            
            res.status(HttpStatus.OK).json({success:true , courses:result})
        } catch (error) {
            console.log(error);
            
        }
    }
}