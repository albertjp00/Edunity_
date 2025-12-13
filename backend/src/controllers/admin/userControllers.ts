import { Response, Request, NextFunction } from "express";
import { HttpStatus } from "../../enums/httpStatus.enums";
import { IAdminUserManagementController } from "../../interfaces/adminInterfaces";
import { mapAdminUserCourseToDTO, mapUserToDTO } from "../../mapper/admin.mapper";
import { IAdminUserServices } from "../../interfacesServices.ts/adminServiceInterfaces";
import { StatusMessage } from "../../enums/statusMessage";
// import { AdminUserService } from "../../services/admin/userServices";


export class AdminUserController implements IAdminUserManagementController {
    private _userService: IAdminUserServices

    constructor(adminUserService: IAdminUserServices) 
    {
        this._userService = adminUserService
    }

    getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id!
            console.log('get user ', id);

            const result = await this._userService.getUserRequest(id)
            // const mapped = mapUserToDTO(result)
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
            
            if(!data) return 
            const mappedUsers = data.users.map(mapUserToDTO);

            

            res.status(HttpStatus.OK).json({ success: true,
                users: mappedUsers,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
                totalUsers: data.totalUsers
            });
        } catch (error) {
            res.status(500).json({ message: StatusMessage.FAILED_TO_FETCH_DATA, error });
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
                res.status(HttpStatus.OK).json({ success: false })
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
            console.log('get user courses ', id);

            const result = await this._userService.getUsersCoursesRequest(id)
            // console.log(result);
            if(!result) return
            const mapped = result.map(mapAdminUserCourseToDTO)
            
            

            res.status(HttpStatus.OK).json({ success: true, courses: mapped })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }
}