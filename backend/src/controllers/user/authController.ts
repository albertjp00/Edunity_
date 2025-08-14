import { Request, Response } from 'express';
import { AuthService } from '../../services/user/authService.js';
import { UserRepository } from '../../repositories/userRepository.js';

export class AuthController {
  private authService: AuthService;

  constructor() {
    const repo = new UserRepository();
    this.authService = new AuthService(repo);
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log('Login request body:', req.body);

      const { email, password } = req.body;
      const result = await this.authService.login(email, password);

      if (result.success) {
        res.status(200).json({
          message: result.message,
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken
        });
      } else {
        res.status(401).json({ error: result.message });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


  register = async (req: Request, res: Response): Promise<void> => {
    try {

      const { name, email, password } = req.body

      const result = await this.authService.registerRequest(name, email, password)

      if (result) res.status(200).json({ success: true })
    } catch (error) {
      console.log(error);

    }
  }

  resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      console.log('resend otp',email);
      
      if (!email) {
        res.status(400).json({ success: false, message: "Email is required" });
        return;
      }

      const result = await this.authService.resendOtpRequest(email)

      res.status(200).json({ success: true, message: "OTP resent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to resend OTP" });
    }
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { otp, email } = req.body
      const result = await this.authService.verifyOtpRequest(otp, email)

      if (result.success) {
        res.status(200).json({ success: true })
      }else{
        res.status(400).json({success:false,message:result.message})
      }
    } catch (error) {
      console.log(error);

    }
  }
}
