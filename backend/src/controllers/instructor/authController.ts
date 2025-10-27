import { InstAuthRequest } from "../../middleware/authMiddleware.js";
import { InstructorRepository } from "../../repositories/instructorRepository.js"
import { InstAuthService } from "../../services/instructor/authService.js";
import { Request, Response } from 'express';





export class InstAuthController {
  private _instAuthService: InstAuthService

  
  constructor(instAuthService : InstAuthService) {
    // const repo = new InstructorRepository();
    this._instAuthService = instAuthService
  }


  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const response = await this._instAuthService.instructorLogin(email, password);

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


  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;
      console.log('inst register', name, email);

      const result = await this._instAuthService.instructorRegister(name, email, password);

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


  resendOtp = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ success: false, message: "Email is required" });
        return;
      }

      await this._instAuthService.resendOtpRequest(email);

      res.status(200).json({ success: true, message: "OTP resent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to resend OTP" });
    }
  };

  verifyOtp = async (req: Request, res: Response) => {
    try {
      const { otp, email } = req.body;
      const result = await this._instAuthService.verifyOtpRequest(otp, email);
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





  // reset password 

  forgotPassword = async (req: Request, res: Response) => {
    try {

      const { email } = req.body;
      console.log(email);


      const result = await this._instAuthService.forgotPassword(email);

      if (!result.success) {
        res.status(400).json({ message: result.message });
        return;
      }

      res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  verifyOtpForgotPass = async (req: Request, res: Response) => {
    try {
      console.log('verify password');

      const { email, otp } = req.body;

      const result = await this._instAuthService.verifyForgotPasswordOtp(otp, email);
      console.log('verification ', result.success);

      if (!result.success) {
        res.status(400).json({ success: false, message: result.message });

      }

      res.status(200).json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  resendOtpForgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      console.log('resend', email);


      if (!email) {
        res.status(400).json({ success: false, message: "Email is required" });
        return;
      }

      await this._instAuthService.forgotPassword(email);

      res.status(200).json({ success: true, message: "OTP resent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to resend OTP" });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { email, newPassword } = req.body;
      console.log('reset pass ', email, newPassword);



      // if (!req.user) {
      //   res.status(401).json({ success: false, message: "Unauthorized" });
      //   return;
      // }

      const result = await this._instAuthService.resetPassword(
        email,
        newPassword
      );

      if (!result.success) {
        res.status(400).json({ success: false, message: result.message });
        return;
      }

      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: "Internal server error" });
    }
  };






}