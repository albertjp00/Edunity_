import { NextFunction, Response } from "express";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

import {
  IAdminAuthController,
  IAdminAuthService,
} from "../../interfaces/adminInterfaces";
import { AdminAuthRequest } from "../../middleware/authMiddleware";
import { HttpStatus } from "../../enums/httpStatus.enums";
import { StatusMessage } from "../../enums/statusMessage";
import { RefreshTokenPayload } from "../../interfaces/userInterfaces";

const SECRET_KEY = process.env.SECRET_KEY || "access_secret";
const REFRESH_KEY = process.env.REFRESH_KEY || "refresh_secret";

export class AdminAuthController implements IAdminAuthController {
  private _adminAuthService: IAdminAuthService;

  constructor(adminAuthService: IAdminAuthService) {
    this._adminAuthService = adminAuthService;
  }

  adminLogin = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, password } = req.body;

      const result = await this._adminAuthService.loginRequest(email, password);
      console.log("login", result);

      if (result?.success) {

        res.cookie("adminRefreshToken", result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, 
        });


        res
          .status(HttpStatus.OK)
          .json({
            success: true,
            message: StatusMessage.LOGIN_SUCCESS,
            token: result.token,
          });
      } else {
        res.json({ success: false, message: result.message });
      }
    } catch (error) {
      console.log(error);
      next(error);
    }
  };


      refreshToken = (req: AdminAuthRequest, res: Response, next: NextFunction): void => {
        try {
          const token = req.cookies.adminRefreshToken;
          console.log('admin refresh ');
          
    
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
  
}
