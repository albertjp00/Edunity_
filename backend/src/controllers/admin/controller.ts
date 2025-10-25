import { Response, Request } from "express";
import { AdminRepository, IAdminRepository } from "../../repositories/adminRepositories";
import { AdminService } from "../../services/admin/adminServices";
import { IKyc } from "../../models/kyc";
import { UserRepository } from "../../repositories/userRepository";
import { AdminAuthRequest } from "../../middleware/authMiddleware";
import { IUserRepository } from "../../interfaces/userInterfaces";
import logger from "../../utils/logger";

export class AdminController {
    private _adminService: AdminService

    constructor(
        repo: IAdminRepository,
        uRepo: IUserRepository
    ) {
        this._adminService = new AdminService(repo, uRepo)

    }


    adminLogin = async (req: AdminAuthRequest, res: Response) => {
        try {
            const { email, password } = req.body
            console.log(email);

            const result = await this._adminService.loginRequest(email, password)
            if (result?.success) {
                res.json({ success: true, message: result.message, token: result.token })
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
            let limit = 4

            const data = await this._adminService.getUsers(
                String(search),
                Number(page),
            );

            res.status(200).json(data);
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
            res.json({ success: true })
        } catch (error) {
            console.log(error);
            return null
        }
    }

    unblockUser = async (req: Request, res: Response) => {
        try {
            console.log('unblock user');

            const id = req.params.id!
            const result = await this._adminService.unblockUser(id)
            res.json({ success: true })
        } catch (error) {
            console.log(error);
            return null
        }
    }

    getInstructors = async (req: Request, res: Response) => {
        try {
            console.log('admin instrusss', req.query);
            const { page, search } = req.query

            const data = await this._adminService.getInstructors(page as string, search as string)
            // console.log(data);

            res.json({ success: true, data })
        } catch (error) {
            console.log(error);
        }
    }

    getKyc = async (req: Request, res: Response) => {
        try {
            const id = req.params.id!
            console.log('kyc detauls ', id);

            const data = await this._adminService.getKycDetails(id)

            res.json({ success: true, data: data })
        } catch (error) {
            console.log(error);
        }
    }

    verifyKyc = async (req: Request, res: Response) => {
        try {
            const id = req.params.id!
            console.log('kyc verify ', id);

            const data = await this._adminService.verifyKyc(id)

            res.json({ success: true })
        } catch (error) {
            console.log(error);

        }
    }
    rejectKyc = async (req: AdminAuthRequest, res: Response) => {
        try {
            const id = req.params.id!
            const reason = req.body.reason
            console.log('kyc verify ', id, req.body);

            const data = await this._adminService.rejectKyc(id, reason)

            res.json({ success: true })
        } catch (error) {
            console.log(error);

        }
    }



    dashboardStats = async (req: AdminAuthRequest, res: Response) => {
        try {

            const result = await this._adminService.getStats()
            console.log(result);


            res.json({ success: true, stats: result })
        } catch (error) {
            console.log(error);

        }
    }



    getUserOverview = async (req: Request, res: Response) => {
        try {
            const result = await this._adminService.getUserOverview();
            console.log('overview',result);


            res.status(200).json({
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



}