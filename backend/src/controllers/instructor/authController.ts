import { HttpStatus } from "../../enums/httpStatus.enums";
import { StatusMessage } from "../../enums/statusMessage";
import {
  IInstLoginController,
  IInstPasswordResetController,
  IInstRegisterController,
} from "../../interfaces/instructorInterfaces";
import { IInstAuthService } from "../../interfacesServices.ts/instructorServiceInterface";

import { NextFunction, Request, Response } from "express";

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
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const response = await this._instAuthService.instructorLogin(
        email,
        password,
      );

      if (response.success) {
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
      next(error);
    }
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const result = await this._instAuthService.instructorRegister(
        name,
        email,
        password,
      );



      if (result.success) {
        res.status(HttpStatus.OK).json({success:true});
      } else {
        res.status(HttpStatus.BAD_REQUEST).json(result);
      }
    } catch (error) {
      console.error("Register error:", error);
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: StatusMessage.REGISTRATION_FAILED });
      next(error);
    }
  };

  resendOtp = async (req: Request, res: Response, next: NextFunction) => {
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
      next(error);
    }
  };

  verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { otp, email } = req.body;
      const result = await this._instAuthService.verifyOtpRequest(otp, email);
      console.log(result);

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

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      console.log(email);

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
      next(error);
    }
  };

  verifyOtpForgotPass = async (
    req: Request,
    res: Response,
    next: NextFunction,
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
      next(error);
    }
  };

  resendOtpForgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
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
      next(error);
    }
  };

  resetPassword = async (req: Request, res: Response, next: NextFunction) => {
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
      next(error);
    }
  };
}
