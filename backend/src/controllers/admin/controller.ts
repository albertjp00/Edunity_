import { Response, Request } from "express";
import { AdminService } from "../../services/admin/adminServices";
import { AdminAuthRequest } from "../../middleware/authMiddleware";
import { HttpStatus } from "../../enums/httpStatus.enums";
import { IAdminAuthController, IAdminDashboardController, IAdminInstructorController, IAdminKycController, IAdminUserManagementController } from "../../interfaces/adminInterfaces";


export class AdminController implements
    IAdminAuthController,
    IAdminUserManagementController,
    IAdminInstructorController,
    IAdminKycController,
    IAdminDashboardController {
    private _adminService: AdminService

    constructor(adminService: AdminService) {
        this._adminService = adminService

    }


    adminLogin = async (req: AdminAuthRequest, res: Response) => {
        try {
            const { email, password } = req.body
            console.log(email);

            const result = await this._adminService.loginRequest(email, password)
            if (result?.success) {
                res.status(HttpStatus.OK).json({ success: true, message: result.message, token: result.token })
            } else {
                res.json({ success: false, message: result?.message })
            }
        } catch (error) {
            console.log(error);

        }
    }

    getUsers = async (req: Request, res: Response) => {
        try {
            const { search, page } = req.query;
            // let limit = 4

            const data = await this._adminService.getUsers(
                String(search),
                Number(page),
            );

            res.status(HttpStatus.OK).json(data);
        } catch (error) {
            res.status(500).json({ message: "Error fetching users", error });
        }
    };


    blockUnblock = async (req: Request, res: Response) => {
        try {
            const id = req.params.id!
            console.log(id);
            console.log('block / unblock');


            const result = await this._adminService.blockUnblockUser(id)
            if (result) {
                res.status(HttpStatus.OK).json({ success: true })
            } else {
                res.json({ success: false })
            }
        } catch (error) {
            console.log(error);
        
        }
    }

    unblockUser = async (req: Request, res: Response) => {
        try {
            console.log('unblock user');

            const id = req.params.id!
            const result = await this._adminService.unblockUser(id)

            if (result) {
                res.status(HttpStatus.OK).json({ success: true })
            } else {
                res.json({ success: false })
            }
        } catch (error) {
            console.log(error);
        
        }
    }

    getInstructors = async (req: Request, res: Response) => {
        try {
            console.log('admin instrusss', req.query);
            const { page, search } = req.query

            const data = await this._adminService.getInstructors(page as string, search as string)
            // console.log(data);

            res.status(HttpStatus.OK).json({ success: true, data })
        } catch (error) {
            console.log(error);
        }
    }

    getKyc = async (req: Request, res: Response) => {
        try {
            const id = req.params.id!
            console.log('kyc detauls ', id);

            const data = await this._adminService.getKycDetails(id)

            res.status(HttpStatus.OK).json({ success: true, data: data })
        } catch (error) {
            console.log(error);
        }
    }

    verifyKyc = async (req: Request, res: Response) => {
        try {
            const id = req.params.id!
            console.log('kyc verify ', id);

            const result = await this._adminService.verifyKyc(id)

            if (result) {
                res.status(HttpStatus.OK).json({ success: true })
            } else {
                res.json({ success: false })
            }
        } catch (error) {
            console.log(error);

        }
    }
    rejectKyc = async (req: AdminAuthRequest, res: Response) => {
        try {
            const id = req.params.id!
            const reason = req.body.reason
            console.log('kyc verify ', id, req.body);

            await this._adminService.rejectKyc(id, reason)

            res.status(HttpStatus.OK).json({ success: true })

        } catch (error) {
            console.log(error);

        }
    }



    dashboardStats = async (req: AdminAuthRequest, res: Response) => {
        try {

            const result = await this._adminService.getStats()
            console.log(result);


            res.status(HttpStatus.OK).json({ success: true, stats: result })
        } catch (error) {
            console.log(error);

        }
    }



    getUserOverview = async (req: Request, res: Response) => {
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
        }
    };


    getEarnings = async (req: AdminAuthRequest, res: Response) => {
        try {
            const result = await this._adminService.getEarningsData()
            console.log(result);

            res.status(HttpStatus.OK).json({ success: true, earnings: result })
        } catch (error) {
            console.log(error);
        }
    }



}