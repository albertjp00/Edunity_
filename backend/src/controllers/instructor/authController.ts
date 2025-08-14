import { InstructorRepository } from "../../repositories/instructorRepository.js"
import { InstAuthService } from "../../services/instructor/authService.js";
import { Request, Response } from 'express';





export class InsAuthController{
    private instAuthService : InstAuthService
    
    constructor (){
        const repo = new InstructorRepository();
        this.instAuthService = new InstAuthService(repo)
    }

     login = async (req : Request , res : Response): Promise<void> => {
        try {
            // console.log(req.body);
            
            const {email , password } = req.body

            const response = await this.instAuthService.login(email,password)

            res.status(200).json({success : true})
        } catch (error) {
            console.log(error);
            
        }
    }
}