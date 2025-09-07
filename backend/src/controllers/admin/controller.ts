import { Response, Request } from "express";
import { AdminRepository } from "../../repositories/adminRepositories.js";
import { AdminService } from "../../services/admin/adminServices.js";
import { IKyc } from "../../models/kyc.js";
import { UserRepository } from "../../repositories/userRepository.js";
import { AdminAuthRequest } from "../../middleware/authMiddleware.js";

export class AdminController {
    private adminService: AdminService

    constructor() {
        const repo = new AdminRepository();
        const uRepo = new UserRepository()
        this.adminService = new AdminService(repo, uRepo)

    }


    adminLogin = async (req: AdminAuthRequest, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body
            console.log(email);

            const result = await this.adminService.loginRequest(email, password)
            if (result?.success) {
                res.json({ success: true, message: result.message, token: result.token })
            } else {
                res.json({ success: false, message: result?.message })
            }
        } catch (error) {
            console.log(error);

        }
    }

    getUsers = async (req: AdminAuthRequest, res: Response): Promise<void> => {
        try {
            console.log('admin userrsss');

            const users = await this.adminService.getUsers()
            res.json({ success: true, users: users })
        } catch (error) {
            console.log(error);

        }
    }

    blockUnblock = async (req: Request, res: Response): Promise<void | null> => {
        try {
            const id = req.params.id!
            console.log(id);
            console.log('block / unblock');
            

            const result = await this.adminService.blockUnblockUser(id)
            res.json({ success: true })
        } catch (error) {
            console.log(error);
            return null
        }
    }

    unblockUser = async (req: Request, res: Response): Promise<void | null> => {
        try {
            console.log('unblock user');

            const id = req.params.id!
            const result = await this.adminService.unblockUser(id)
            res.json({ success: true })
        } catch (error) {
            console.log(error);
            return null
        }
    }

    getInstructors = async (req: Request, res: Response): Promise<void> => {
        try {
            console.log('admin instrusss');

            const instructors = await this.adminService.getInstructors()
            res.json({ success: true, data: instructors })
        } catch (error) {
            console.log(error);

        }
    }

    getKyc = async (req: Request, res: Response): Promise<void | null> => {
        try {
            const id = req.params.id!
            console.log('kyc detauls ', id);

            const data = await this.adminService.getKycDetails(id)

            res.json({ success: true, data: data })
        } catch (error) {
            console.log(error);
        }
    }

    verifyKyc = async (req: Request, res: Response): Promise<void | null> => {
        try {
            const id = req.params.id!
            console.log('kyc verify ', id);

            const data = await this.adminService.verifyKyc(id)

            res.json({ success: true })
        } catch (error) {
            console.log(error);

        }
    }
    rejectKyc = async (req: AdminAuthRequest, res: Response): Promise<void | null> => {
        try {
            const id = req.params.id!
            const reason = req.body.reason
            console.log('kyc verify ', id, req.body);

            const data = await this.adminService.rejectKyc(id, reason)

            res.json({ success: true })
        } catch (error) {
            console.log(error);

        }
    }

}