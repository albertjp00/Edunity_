import { Response, Request, NextFunction } from "express";
import { AdminAuthRequest } from "../../middleware/authMiddleware";
import { HttpStatus } from "../../enums/httpStatus.enums";
import { IAdminAuthController, IAdminDashboardController, IAdminInstructorController,
     IAdminKycController, IAdminUserManagementController } from "../../interfaces/adminInterfaces";

import { IAdminService } from "../../interfacesServices.ts/adminServiceInterfaces";
// import { AdminService } from "../../services/admin/adminServices";  // service file



export class AdminDashboardController implements
    IAdminDashboardController {
    private _adminService: IAdminService

    constructor(adminService: IAdminService) {
        this._adminService = adminService

    }






    dashboardStats = async (req: AdminAuthRequest, res: Response,next: NextFunction) => {
        try {

            const result = await this._adminService.getStats()
            console.log(result);


            res.status(HttpStatus.OK).json({ success: true, stats: result })
        } catch (error) {
            console.log(error);
            next(error)

        }
    }



    getUserOverview = async (req: Request, res: Response,next: NextFunction) => {
        try {
            const result = await this._adminService.getUserOverview();
            console.log('overview', result);


            res.status(HttpStatus.OK).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error("Error fetching user overview:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch user overview chart data",
            });
            next(error)
        }
    };


    getEarnings = async (req: AdminAuthRequest, res: Response,next: NextFunction) => {
        try {
            const result = await this._adminService.getEarningsData()
            console.log(result);

            res.status(HttpStatus.OK).json({ success: true, earnings: result })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }



}