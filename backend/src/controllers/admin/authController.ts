import { NextFunction, Response } from "express";
import { IAdminAuthController, IAdminAuthService } from "../../interfaces/adminInterfaces";
import { AdminAuthRequest } from "../../middleware/authMiddleware";
import { HttpStatus } from "../../enums/httpStatus.enums";
import { AdminLoginDTO } from "../../dto/adminDTO";
import { StatusMessage } from "../../enums/statusMessage";


export class AdminAuthController implements
    IAdminAuthController {
    private _adminAuthService: IAdminAuthService

    constructor(adminAuthService: IAdminAuthService) {
        this._adminAuthService = adminAuthService

    }


    adminLogin = async (req: AdminAuthRequest, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body

            const result: AdminLoginDTO = await this._adminAuthService.loginRequest(email, password)

            if (result?.success) {
                res.status(HttpStatus.OK).json({ success: true, message: StatusMessage.LOGIN_SUCCESS, token: result.token })
            } else {
                res.json({ success: false, message: StatusMessage.INTERNAL_SERVER_ERROR })
            }
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}