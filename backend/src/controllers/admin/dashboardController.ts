import { Response, Request, NextFunction } from "express";
import { AdminAuthRequest } from "../../middleware/authMiddleware";
import { HttpStatus } from "../../enums/httpStatus.enums";
import { IAdminDashboardController } from "../../interfaces/adminInterfaces";

import { IAdminService } from "../../interfacesServices.ts/adminServiceInterfaces";
import { mapEarningsToDTO } from "../../mapper/admin.mapper";
import { StatusMessage } from "../../enums/statusMessage";

export class AdminDashboardController implements IAdminDashboardController {
  private _adminService: IAdminService;

  constructor(adminService: IAdminService) {
    this._adminService = adminService;
  }

  dashboardStats = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const result = await this._adminService.getStats();

      res.status(HttpStatus.OK).json({ success: true, stats: result });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getUserOverview = async (req: Request, res: Response) => {
    try {
      const result = await this._adminService.getUserOverview();

      res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error("Error fetching user overview:", error);
      res.status(HttpStatus.OK).json({
        success: false,
        message: StatusMessage.FAILED_TO_FETCH_DATA,
      });
    }
  };

  getEarnings = async (
    req: AdminAuthRequest,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const page = Number(req.params.page) || 1;

      const { fromDate, toDate, sort } = req.query;
      console.log(fromDate, toDate, sort);

      const result = await this._adminService.getEarningsData(
        page,
        req.query.fromDate as string | undefined,
        req.query.toDate as string | undefined,
        req.query.sort as string | undefined,
      );
      const dto = mapEarningsToDTO(result?.earnings ?? []);

      res.status(HttpStatus.OK).json({
        success: true,
        earnings: dto,
        totalEarnings: result?.totalEarnings,
        totalPages: result?.totalPages,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}
