import { NextFunction , Response} from "express";
import { IAdminAuthController } from "../../interfaces/adminInterfaces";
import { IAdminService } from "../../interfacesServices.ts/adminServiceInterfaces";
import { AdminAuthRequest } from "../../middleware/authMiddleware";
import { HttpStatus } from "../../enums/httpStatus.enums";

import { AdminService } from "../../services/admin/adminServices";  
// // service file


export class AdminAuthController implements
    IAdminAuthController
 {
    private _adminAuthService: IAdminService

    constructor(adminAuthService: IAdminService) {
        this._adminAuthService = adminAuthService

    }


    adminLogin = async (req: AdminAuthRequest, res: Response,next: NextFunction) => {
        try {
            const { email, password } = req.body
            console.log(email);

            const result = await this._adminAuthService.loginRequest(email, password)
            if (result?.success) {
                res.status(HttpStatus.OK).json({ success: true, message: result.message, token: result.token })
            } else {
                res.json({ success: false, message: result?.message })
            }
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}