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


      register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      console.log('inst register', name , email);
      
      const result = await this.instAuthService.instructorRegister(name, email, password);

      if (result.success) {
        res.status(200).json(result); // OK
      } else {
        console.log('result', result);

        res.status(400).json(result); // Failure
      }
    } catch (error: any) {
      console.error("Register error:", error);
      res
        .status(400)
        .json({ success: false, message: error.message || "Registration failed" });
    }
  };


  resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ success: false, message: "Email is required" });
        return;
      }

      await this.instAuthService.resendOtpRequest(email);

      res.status(200).json({ success: true, message: "OTP resent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to resend OTP" });
    }
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { otp, email } = req.body;
      const result = await this.instAuthService.verifyOtpRequest(otp, email);
      console.log(result);

      if (result.success) {
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // forgotPassword = ()=>{
  //   try {
  //       const {email} = req.body

  //   } catch (error) {
  //       console.log(error);
        
  //   }
  // }




}