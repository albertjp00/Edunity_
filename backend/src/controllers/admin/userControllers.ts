import { Response, Request, NextFunction } from "express";
import { AdminUserService } from "../../services/admin/userServices";
import { HttpStatus } from "../../enums/httpStatus.enums";
import { IAdminUserManagementController } from "../../interfaces/adminInterfaces";

export class AdminUserController implements IAdminUserManagementController {
    private _userService: AdminUserService

    constructor(
        adminUserService: AdminUserService
    ) {
        this._userService = adminUserService
    }

    getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id!
            console.log('get user ', id);

            const result = await this._userService.getUserRequest(id)
            res.status(HttpStatus.OK).json({ success: true, user: result })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }


    getUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { search, page } = req.query;
            // let limit = 4

            const data = await this._userService.getUsers(
                String(search),
                Number(page),
            );

            res.status(HttpStatus.OK).json(data);
        } catch (error) {
            res.status(500).json({ message: "Error fetching users", error });
            next(error)
        }
    };


    blockUnblock = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id!
            console.log(id);
            console.log('block / unblock');


            const result = await this._userService.blockUnblockUser(id)
            if (result) {
                res.status(HttpStatus.OK).json({ success: true })
            } else {
                res.json({ success: false })
            }
        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    unblockUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('unblock user');

            const id = req.params.id!
            const result = await this._userService.unblockUser(id)

            if (result) {
                res.status(HttpStatus.OK).json({ success: true })
            } else {
                res.json({ success: false })
            }
        } catch (error) {
            console.log(error);
            next(error)

        }
    }

    getUserCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id!
            console.log('get instructor courses ', id);

            const result = await this._userService.getUsersCoursesRequest(id)
            console.log(result);

            res.status(HttpStatus.OK).json({ success: true, courses: result })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}