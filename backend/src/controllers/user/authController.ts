import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import { AuthRequest } from "../../middleware/authMiddleware";
import { OAuth2Client } from "google-auth-library";
import { HttpStatus } from "../../enums/httpStatus.enums";
import logger from "../../utils/logger";
import { IAuthBasicController, IAuthForgotPasswordController,
   IAuthGoogleController, IAuthRegisterController, 
   RefreshTokenPayload} from "../../interfaces/userInterfaces";
import { IUserAuthService } from "../../interfacesServices.ts/userServiceInterfaces";
import { StatusMessage } from "../../enums/statusMessage";
// import { AuthService } from "../../services/user/authService";



const SECRET_KEY = process.env.SECRET_KEY || "access_secret";
const REFRESH_KEY = process.env.REFRESH_KEY || "refresh_secret";
// const REFRESH_TIME = process.env.REFRESH_TIME

new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "");


export class AuthController 
  implements
    IAuthBasicController,
    IAuthRegisterController,
    IAuthGoogleController,
    IAuthForgotPasswordController
 {
  private _authService: IUserAuthService;

  constructor(authService: IUserAuthService) {
    this._authService = authService
  }




  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: StatusMessage.EMAIL_AND_PASWWORD });
        return;
      }

      const result = await this._authService.loginRequest(email, password);
      
    
      if (result.success) {
        res.cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, 
        });

        res.status(HttpStatus.OK).json({
          message: result.message,
          accessToken: result.accessToken,
        });
      
      }else {
        let status = HttpStatus.UNAUTHORIZED;
        if (result.message === "Your account is blocked") status = HttpStatus.FORBIDDEN;
        if (result.message === "User not found") status = HttpStatus.NOT_FOUND;
        
        res.status(status).json({ message: result.message });
      }
    } catch (error) {
      next(error)
    }
  };



  refreshToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = req.cookies.refreshToken;

      if (!token) {
        res.status(HttpStatus.UNAUTHORIZED).json({ message: StatusMessage.TOKEN_REQUIRED });
        return;
      }


      jwt.verify(token, REFRESH_KEY, (err: VerifyErrors | null, decoded : JwtPayload | string | undefined ) => {
        if (err) {
          res.status(HttpStatus.FORBIDDEN).json({ message: StatusMessage.INVALID_REFRESH_TOKEN });
          return;
        }
        if (!process.env.SECRET_KEY) throw new Error("ACCESS_SECRET not set");
        if (!process.env.REFRESH_KEY) throw new Error("REFRESH_TIME not set");

        const payload = decoded as RefreshTokenPayload;
        const newAccessToken = jwt.sign({ id: payload.id }, SECRET_KEY, {
          expiresIn: '15m',
        });

        res.json({ accessToken: newAccessToken });
      });
    } catch (error) {
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

      res.status(HttpStatus.OK).json({ success: true });
    } catch (err) {
      next(err)
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false });

    }
  };



  checkBlocked = async (req: AuthRequest, res: Response) => {
    try {
      if(!req.user) return
      const id = req.user?.id
      
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

        res.status(HttpStatus.BAD_REQUEST).json(result); // Failure
      }
    } catch (error) {
      next(error)
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: StatusMessage.REGISTRATION_FAILED });
    }
  };


  resendOtp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: StatusMessage.EMAIL_REQUIRED });
        return;
      }
      await this._authService.resendOtpRequest(email);

      res.status(HttpStatus.OK).json({ success: true, message: StatusMessage.OTP_SENT });
    } catch (error) {
      console.error(error);
      next(error)
      res.status(500).json({ success: false, message: StatusMessage.OTP_RESEND_FAILED });
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
      console.log(error);
      next(error)
    }
  };




  googleSignIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.body;
    

      if (!token) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: StatusMessage.TOKEN_REQUIRED });
        return;
      }
      const { accessToken, refreshToken } = await this._authService.googleLogin(token);
      if (refreshToken) {
        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite:"strict",
          maxAge: 60 * 60 * 1000, 
        });
      }

      res.json({ success: true, token: accessToken  });
    } catch (error) {
      next(error)
      res.status(500).json({ message:  StatusMessage.GOOGLE_SIGN_IN_FALIED });
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

      res.status(HttpStatus.OK).json({ success: true, message: StatusMessage.OTP_SENT });
    } catch (error) {
      console.error(error);
      next(error)
      res.status(500).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
    }
  };

  verifyOtpForgotPass = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {

      const { email, otp } = req.body;

      const result = await this._authService.verifyForgotPasswordOtp(otp, email);

      if (!result.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: result.message });

      }

      res.status(HttpStatus.OK).json({ success: true, message: StatusMessage.OTP_VERIFIED });
    } catch (error) {
      next(error)
      res.status(500).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
    }
  };

  resendOtpForgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;


      if (!email) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: StatusMessage.EMAIL_REQUIRED });
        return;
      }

      await this._authService.forgotPassword(email);

      res.status(HttpStatus.OK).json({ success: true, message: StatusMessage.OTP_SENT });
    } catch (error) {
      // console.error(error);
      next(error)
      res.status(500).json({ success: false, message: StatusMessage.OTP_RESEND_FAILED });
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, newPassword } = req.body;

      const result = await this._authService.resetPassword(
        email,
        newPassword
      );

      if (!result.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: result.message });
        return;
      }

      res.json({ success: true, message: StatusMessage.PASSWORD_CHANGED });
    } catch (error) {
      console.error(error);
      next(error)
      res.json({ success: false, message: StatusMessage.INTERNAL_SERVER_ERROR });
    }
  };






}
