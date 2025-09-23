import { Response, Request } from "express";
import { AdminRepository, IAdminRepository } from "../../repositories/adminRepositories.js";
import { AdminService } from "../../services/admin/adminServices.js";
import { IKyc } from "../../models/kyc.js";
import { IUserRepository, UserRepository } from "../../repositories/userRepository.js";
import { AdminAuthRequest } from "../../middleware/authMiddleware.js";

export class AdminController {
    private adminService: AdminService

    constructor( 
        repo :IAdminRepository,
        uRepo:IUserRepository
    ){
        this.adminService =new AdminService(repo, uRepo)

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

getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, page } = req.query;
    let limit = 4

    const data = await this.adminService.getUsers(
      String(search),
      Number(page),
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};


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
            console.log('admin instrusss', req.query);
            const {page , search } = req.query

            const data = await this.adminService.getInstructors(page as string , search as string)
            // console.log(data);
            
            res.json({ success: true, data})
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