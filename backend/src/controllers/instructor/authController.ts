import { HttpStatus } from "../../enums/httpStatus.enums";
import { StatusMessage } from "../../enums/statusMessage";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import {
  IInstLoginController,
  IInstPasswordResetController,
  IInstRegisterController,
} from "../../interfaces/instructorInterfaces";
import { IInstAuthService } from "../../interfacesServices.ts/instructorServiceInterface";

import { NextFunction, Request, Response } from "express";
import { RefreshTokenPayload } from "../../interfaces/userInterfaces";

const secret: string = process.env.SECRET_KEY || "";
const REFRESH_KEY = process.env.REFRESH_KEY || "refresh_secret";

export class InstAuthController
  implements
    IInstLoginController,
    IInstRegisterController,
    IInstPasswordResetController
{
  private _instAuthService: IInstAuthService;

  constructor(instAuthService: IInstAuthService) {
    // const repo = new InstructorRepository();
    this._instAuthService = instAuthService;
  }

  login = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const response = await this._instAuthService.instructorLogin(
        email,
        password,
      );

      if (response.success) {
        res.cookie("instructorRefreshToken", response.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(HttpStatus.OK).json({
          success: true,
          message: StatusMessage.LOGIN_SUCCESS,
          token: response.accessToken,
          refreshToken: response.refreshToken,
        });
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json({
          success: false,
          message: response.message,
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: StatusMessage.INTERNAL_SERVER_ERROR,
      });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const { name, email, password } = req.body;

      const result = await this._instAuthService.instructorRegister(
        name,
        email,
        password,
      );

      if (result.success) {
        res.status(HttpStatus.OK).json({ success: true });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json(result);
      }
    } catch (error) {
      console.error("Register error:", error);
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: StatusMessage.REGISTRATION_FAILED });
    }
  };

  resendOtp = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        res
          .status(400)
          .json({ success: false, message: StatusMessage.EMAIL_REQUIRED });
        return;
      }

      await this._instAuthService.resendOtpRequest(email);

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: StatusMessage.OTP_SENT });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: StatusMessage.OTP_RESEND_FAILED });
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp, email } = req.body;
      const result = await this._instAuthService.verifyOtpRequest(otp, email);

      if (result.success) {
        res.status(HttpStatus.OK).json({ success: true });
      } else {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: result.message });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  // reset password

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;


      const result = await this._instAuthService.forgotPassword(email);

      if (!result.success) {
        res.status(HttpStatus.BAD_REQUEST).json({ message: result.message });
        return;
      }

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: StatusMessage.OTP_SENT });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
    }
  };

  verifyOtpForgotPass = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { email, otp } = req.body;

      const result = await this._instAuthService.verifyForgotPasswordOtp(
        otp,
        email,
      );

      if (!result.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: result.message });
      }

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: StatusMessage.OTP_VERIFIED });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: StatusMessage.INTERNAL_SERVER_ERROR });
    }
  };

  resendOtpForgotPassword = async (
    req: Request,
    res: Response,
  ) => {
    try {
      const { email } = req.body;

      if (!email) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: StatusMessage.EMAIL_REQUIRED });
        return;
      }

      await this._instAuthService.forgotPassword(email);

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: StatusMessage.OTP_SENT });
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: StatusMessage.OTP_RESEND_FAILED });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { email, newPassword } = req.body;

      const result = await this._instAuthService.resetPassword(
        email,
        newPassword,
      );

      if (!result.success) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: result.message });
        return;
      }

      res
        .status(HttpStatus.OK)
        .json({ success: true, message: StatusMessage.PASSWORD_CHANGED });
    } catch (error) {
      console.error(error);
      res.json({
        success: false,
        message: StatusMessage.INTERNAL_SERVER_ERROR,
      });
      
    }
  };

  refreshToken = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const token = req.cookies.instructorRefreshToken;

      if (!token) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ message: StatusMessage.TOKEN_REQUIRED });
        return;
      }

      jwt.verify(
        token,
        REFRESH_KEY,
        (
          err: VerifyErrors | null,
          decoded: JwtPayload | string | undefined,
        ) => {
          if (err) {
            res
              .status(HttpStatus.FORBIDDEN)
              .json({ message: StatusMessage.INVALID_REFRESH_TOKEN });
            return;
          }
          if (!process.env.SECRET_KEY) throw new Error("ACCESS_SECRET not set");
          if (!process.env.REFRESH_KEY) throw new Error("REFRESH_TIME not set");

          const payload = decoded as RefreshTokenPayload;
          const newAccessToken = jwt.sign({ id: payload.id }, secret, {
            expiresIn: "5m",
          });

          res.json({ accessToken: newAccessToken });
        },
      );
    } catch (error) {
      next(error);
    }
  };
}