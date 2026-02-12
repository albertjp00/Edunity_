import { NextFunction, Response } from "express";
import { InstAuthRequest } from "../../middleware/authMiddleware";
import { HttpStatus } from "../../enums/httpStatus.enums";
import {
  IInstFinancialController,
  IInstKYCController,
  IInstProfileReadController,
  IInstProfileUpdateController,
} from "../../interfaces/instructorInterfaces";
import { IInstructorProfileService } from "../../interfacesServices.ts/instructorServiceInterface";
import {mapEarningsToDTO} from "../../mapper/instructor.mapper";
import { StatusMessage } from "../../enums/statusMessage";

export class InstProfileController
  implements
    IInstProfileReadController,
    IInstProfileUpdateController,
    IInstFinancialController,
    IInstKYCController
{
  private _profileService: IInstructorProfileService;

  constructor(instProfileService: IInstructorProfileService) {
    this._profileService = instProfileService;
  }

  getProfile = async (
    req: InstAuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.instructor?.id;

      if (!userId) {
        res.status(HttpStatus.UNAUTHORIZED).json({ error: "Unauthorized" });
        return;
      }
      const profile = await this._profileService.getProfile(userId);

      if (profile) {
        res.status(HttpStatus.OK).json({ data: profile });
      } else {
        res.status(404).json({ error: "Profile not found" });
      }
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ error: "Internal server error" });
      next(error);
    }
  };

  editProfile = async (
    req: InstAuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userId = req.instructor?.id; // Assuming `req.user` is set by auth middleware
      // const updateData = req.body;

      if (req.body.skills) {
        req.body.skills = JSON.parse(req.body.skills);
      }

      const data = { ...req.body };

      const file = req.file?.filename;

      data.profileImage = file;

      if (!userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const updatedProfile = await this._profileService.editProfileRequest(
        userId,
        data,
      );

      if (updatedProfile) {
        res.status(HttpStatus.OK).json({
          success: true,
          message: StatusMessage.PROFILE_UPDATED,
        });
      } else {
        res.status(HttpStatus.NOT_FOUND).json({ error: "Profile not found" });
      }
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ error: "Internal server error" });
      next(error);
    }
  };

  changePassword = async (
    req: InstAuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.instructor?.id;
      const { newPassword, oldPassword } = req.body;

      if (!id) {
        res
          .status(401)
          .json({ success: false, message: StatusMessage.UNAUTHORIZED });
        return;
      }

      const result = await this._profileService.passwordChange(
        id,
        newPassword,
        oldPassword,
      );

      if (result) {
        res
          .status(HttpStatus.OK)
          .json({ success: true, message: StatusMessage.PASSWORD_CHANGED });
      } else {
        res
          .status(HttpStatus.FORBIDDEN)
          .json({ success: false, message: StatusMessage.INCORRECT_PASSWORD });
      }
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: StatusMessage.INTERNAL_SERVER_ERROR });
      next(error);
    }
  };

  kycSubmit = async (
    req: InstAuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.instructor?.id;

      const idProofFile = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )["idProof"]?.[0];
      const addressProofFile = (
        req.files as { [fieldname: string]: Express.Multer.File[] }
      )["addressProof"]?.[0];

      if (!id || !idProofFile || !addressProofFile) {
        res
          .status(400)
          .json({ success: false, message: StatusMessage.MISSING_FIELDS });
        return;
      }

      await this._profileService.kycSubmit(
        id,
        idProofFile.filename,
        addressProofFile.filename,
      );

      res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ success: false, message: StatusMessage.INTERNAL_SERVER_ERROR });
      next(error);
    }
  };

  getNotifications = async (
    req: InstAuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.instructor?.id;
      console.log(id);

      const notifications = await this._profileService.getNotifications(
        id as string,
      );

      res
        .status(HttpStatus.OK)
        .json({ success: true, notifications: notifications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: StatusMessage.INTERNAL_SERVER_ERROR });
      next(error);
    }
  };

  getDashboardData = async (
    req: InstAuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const instructorId = req.instructor?.id;
      const result = await this._profileService.getDashboard(
        instructorId as string,
      );
      res.status(HttpStatus.OK).json({ success: true, dashboard: result });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getEarnings = async (
    req: InstAuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const instructorId = req.instructor?.id;
      const result = await this._profileService.getEarnings(
        instructorId as string,
      );
      if(!result) return
      const earningsDTO = mapEarningsToDTO(result);

      res.status(HttpStatus.OK).json({ success: true, earnings: earningsDTO });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getWallet = async (
    req: InstAuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const id = req.instructor?.id;
      const wallet = await this._profileService.getWallet(id as string);
      res.status(HttpStatus.OK).json({ success: true, wallet });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
