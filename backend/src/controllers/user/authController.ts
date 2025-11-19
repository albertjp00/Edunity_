import { NextFunction, Request, Response } from "express";
import { AuthService } from "../../services/user/authService";
import { UserRepository } from "../../repositories/userRepository";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../../middleware/authMiddleware";
import { OAuth2Client } from "google-auth-library";
import { HttpStatus } from "../../enums/httpStatus.enums";
import logger from "../../utils/logger";
import { IAuthController } from "../../interfaces/userInterfaces";



const SECRET_KEY = process.env.SECRET_KEY || "access_secret";
const REFRESH_KEY = process.env.REFRESH_KEY || "refresh_secret";
// const REFRESH_TIME = process.env.REFRESH_TIME 



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "");






export class AuthController implements IAuthController {
  private _authService: AuthService;

  constructor(authService: AuthService) {
    // const repo = new UserRepository();
    this._authService = authService
  }




  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      logger.info(`Login user: ${req.body.email}`);

      if (!email || !password) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Email and password are required" });
        return;
      }


      const result = await this._authService.loginRequest(email, password);

      if (result.success) {
        res.cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(HttpStatus.OK).json({
          message: result.message,
          user: result.user,
          accessToken: result.accessToken,
        });
      } else {
        let status = HttpStatus.UNAUTHORIZED;
        if (result.message === "Your account is blocked") status = HttpStatus.FORBIDDEN;
        if (result.message === "User not found") status = HttpStatus.NOT_FOUND;

        res.status(HttpStatus.UNAUTHORIZED).json({ message: result.message });
      }
    } catch (error) {
      // console.error("Login error:", error);
      next(error)
      // res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid credentials" });
    }
  };



  refreshToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
      logger.info('refresh token ');
      const token = req.cookies.refreshToken;
      logger.info('refresh token ', token);

      if (!token) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: "Refresh token required" });
        return;
      }

      jwt.verify(token, REFRESH_KEY, (err: any, user: any) => {
        if (err) {
          res.status(HttpStatus.FORBIDDEN).json({ message: "Invalid refresh token" });
          return;
        }

        if (!process.env.ACCESS_SECRET) throw new Error("ACCESS_SECRET not set");
        if (!process.env.REFRESH_TIME) throw new Error("REFRESH_TIME not set");

        const refresh = parseInt(process.env.REFRESH_TIME!,10)

        const newAccessToken = jwt.sign({ id: user.id }, SECRET_KEY, {
          expiresIn: refresh,
        });

        res.json({ accessToken: newAccessToken });
      });
    } catch (error) {
      // console.log(error);
      next(error)
    }
  };



  logoutUser = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // use HTTPS in production
        sameSite: "strict",
        path: "/", // must match the cookie path you set when issuing it
      });

      res.status(HttpStatus.OK).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
      next(err)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Logout failed" });

    }
  };



  checkBlocked = async (req: AuthRequest, res: Response) => {
    try {
      const id = req.user?.id!
      logger.info('blocked or not ', id);

      const isBlocked = await this._authService.isBlocked(id)
      res.json({ blocked: isBlocked })
    } catch (error) {
      console.log(error);
    }
  }



  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      const result = await this._authService.registerRequest(name, email, password);

      if (result.success) {
        res.status(HttpStatus.OK).json(result); // OK
      } else {
        logger.info('result', result);

        res.status(HttpStatus.BAD_REQUEST).json(result); // Failure
      }
    } catch (error: any) {
      // console.error("Register error:", error);
      next(error)
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: error.message || "Registration failed" });
    }
  };


  resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Email is required" });
        return;
      }

      await this._authService.resendOtpRequest(email);

      res.status(HttpStatus.OK).json({ success: true, message: "OTP resent successfully" });
    } catch (error) {
      // console.error(error);
      next(error)
      res.status(500).json({ success: false, message: "Failed to resend OTP" });
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { otp, email } = req.body;
      const result = await this._authService.verifyOtpRequest(otp, email);
      logger.info(result);

      if (result.success) {
        res.status(HttpStatus.OK).json({ success: true });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: result.message });
      }
    } catch (error) {
      // console.log(error);
      next(error)
    }
  };




  googleSignIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.body;
      // console.log(req.body);

      if (!token) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: "Token is required" });
        return;
      }
      const { accessToken, refreshToken, user } = await this._authService.googleLogin(token);
      // console.log(accessToken);
      if (refreshToken) {
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 2 * 24 * 60 * 60 * 1000, // 1 day
        });
      }

      res.json({ success: true, token: accessToken });
    } catch (error: any) {
      // console.error("Google Sign-In error:", error);
      next(error)
      res.status(500).json({ message: error.message || "Google Sign-In failed" });
    }
  };

  forgotPassword = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      const result = await this._authService.forgotPassword(email);

      if (!result.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: result.message });
        return;
      }

      res.status(HttpStatus.OK).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
      // console.error(error);
      next(error)
      res.status(500).json({ message: "Internal server error" });
    }
  };

  verifyOtpForgotPass = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      console.log('verify password');

      const { email, otp } = req.body;

      const result = await this._authService.verifyForgotPasswordOtp(otp, email);
      logger.info('verification ', result.success);

      if (!result.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: result.message });

      }

      res.status(HttpStatus.OK).json({ success: true, message: "OTP verified successfully" });
    } catch (error) {
      // console.error(error);
      next(error)
      res.status(500).json({ message: "Internal server error" });
    }
  };

  resendOtpForgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      logger.info('resend', email);


      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Email is required" });
        return;
      }

      await this._authService.forgotPassword(email);

      res.status(HttpStatus.OK).json({ success: true, message: "OTP resent successfully" });
    } catch (error) {
      // console.error(error);
      next(error)
      res.status(500).json({ success: false, message: "Failed to resend OTP" });
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, newPassword } = req.body;
      logger.info('reset pass ', email, newPassword);



      // if (!req.user) {
      //   res.status(401).json({ success: false, message: "Unauthorized" });
      //   return;
      // }

      const result = await this._authService.resetPassword(
        email,
        newPassword
      );

      if (!result.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: result.message });
        return;
      }

      res.json({ success: true, message: "Password changed successfully" });
    } catch (error) {
      // console.error(error);
      next(error)
      res.json({ success: false, message: "Internal server error" });
    }
  };






}
