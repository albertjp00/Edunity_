import { Request, Response } from "express";
import { AuthService } from "../../services/user/authService";
import { UserRepository } from "../../repositories/userRepository";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../../middleware/authMiddleware";
import { OAuth2Client } from "google-auth-library";



const ACCESS_SECRET = process.env.SECRET_KEY || "access_secret";
const REFRESH_SECRET = process.env.REFRESH_KEY || "refresh_secret";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "");

export class AuthController {
  private authService: AuthService;

  constructor(repo = IUserRepository){
    this.authService = new AuthService(repo);
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      const result = await this.authService.loginRequest(email, password);

      if (result.success) {
        res.cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({
          message: result.message,
          user: result.user,
          accessToken: result.accessToken,
        });
      } else {
        let status = 401;
        if (result.message === "Your account is blocked") status = 403;
        if (result.message === "User not found") status = 404;

        res.status(status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({ message: "Invalid credentials" });

    }
  };


  refreshToken = (req: Request, res: Response): void => {
    try {
      console.log('refresh token ', req.cookies);
      const token = req.cookies.refreshToken;
      console.log('refresh token ', token);

      if (!token) {
        res.status(401).json({ message: "Refresh token required" });
        return;
      }

      jwt.verify(token, REFRESH_SECRET, (err: any, user: any) => {
        if (err) {
          res.status(403).json({ message: "Invalid refresh token" });
          return;
        }

        const newAccessToken = jwt.sign({ id: user.id }, ACCESS_SECRET, {
          expiresIn: "15m",
        });


        res.json({ accessToken: newAccessToken });
      });
    } catch (error) {
      console.log(error);

    }
  };

  logoutUser = async (req: Request, res: Response) => {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // use HTTPS in production
        sameSite: "strict",
        path: "/", // must match the cookie path you set when issuing it
      });

      return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
  };



  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      const result = await this.authService.registerRequest(name, email, password);

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

      await this.authService.resendOtpRequest(email);

      res.status(200).json({ success: true, message: "OTP resent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to resend OTP" });
    }
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { otp, email } = req.body;
      const result = await this.authService.verifyOtpRequest(otp, email);
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




  googleSignIn = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;
      // console.log(req.body);

      if (!token) {
        res.status(400).json({ message: "Token is required" });
        return;
      }
      const { accessToken, refreshToken, user } = await this.authService.googleLogin(token);
      // console.log(accessToken);
      if (refreshToken) {
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });
      }

      res.json({ success: true, token: accessToken });
    } catch (error: any) {
      console.error("Google Sign-In error:", error);
      res.status(500).json({ message: error.message || "Google Sign-In failed" });
    }
  };

  

  forgotPassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      const result = await this.authService.forgotPassword(email);

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

  verifyOtpForgotPass = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      console.log('verify password');

      const { email, otp } = req.body;

      const result = await this.authService.verifyForgotPasswordOtp(otp, email);
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

  resendOtpForgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;
      console.log('resend' , email);
      

      if (!email) {
        res.status(400).json({ success: false, message: "Email is required" });
        return;
      }

      await this.authService.forgotPassword(email);

      res.status(200).json({ success: true, message: "OTP resent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to resend OTP" });
    }
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email , newPassword } = req.body;
    console.log('reset pass ' , email , newPassword);

    

    // if (!req.user) {
    //   res.status(401).json({ success: false, message: "Unauthorized" });
    //   return;
    // }

    const result = await this.authService.resetPassword(
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
