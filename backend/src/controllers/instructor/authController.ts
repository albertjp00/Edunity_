import { InstAuthRequest } from "../../middleware/authMiddleware.js";
import { InstructorRepository } from "../../repositories/instructorRepository.js"
import { InstAuthService } from "../../services/instructor/authService.js";
import { Request, Response } from 'express';





export class InsAuthController {
    private instAuthService: InstAuthService

    constructor() {
        const repo = new InstructorRepository();
        this.instAuthService = new InstAuthService(repo)
    }

    login = async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            const response = await this.instAuthService.instructorLogin(email, password);

            if (response.success) {
                res.status(200).json({
                    success: true,
                    message: response.message,
                    instructor: response.instructor,
                    token: response.accessToken,
                    refreshToken: response.refreshToken
                });
            } else {
                res.status(response.statusCode || 401).json({
                    success: false,
                    message: response.message
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: "Server error"
            });
        }
    };

    logout = async (req:InstAuthRequest , res:Response):Promise<void> =>{
        try {
            
            const id = req.instructor?.id
            const result = await this.instAuthService.instLogout(id)

        } catch (error) {
            console.log(error);
            
        }
    }


}