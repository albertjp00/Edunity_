import { Response, Request, NextFunction } from "express";
import { AdminInstructorService } from "../../services/admin/instructorServices";
import { HttpStatus } from "../../enums/httpStatus.enums";
import { IAdminInstructorController, IAdminInstructorsController, IAdminKycController } from "../../interfaces/adminInterfaces";
import { AdminAuthRequest } from "../../middleware/authMiddleware";

export class AdminInstructorController implements
    IAdminInstructorController,
    IAdminKycController {
    private _adminInstructorService: AdminInstructorService

    constructor(adminInstructorService: AdminInstructorService) {
        this._adminInstructorService = adminInstructorService
    }




    getInstructor = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log('admin instrusss', req.query);
            const { page, search } = req.query

            const data = await this._adminInstructorService.getInstructors(page as string, search as string)
            // console.log(data);

            res.status(HttpStatus.OK).json({ success: true, data })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    getKyc = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id!
            console.log('kyc detauls ', id);

            const data = await this._adminInstructorService.getKycDetails(id)

            res.status(HttpStatus.OK).json({ success: true, data: data })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    verifyKyc = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id!
            console.log('kyc verify ', id);

            const result = await this._adminInstructorService.verifyKyc(id)

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
    rejectKyc = async (req: AdminAuthRequest, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id!
            const reason = req.body.reason
            console.log('kyc verify ', id, req.body);

            await this._adminInstructorService.rejectKyc(id, reason)

            res.status(HttpStatus.OK).json({ success: true })

        } catch (error) {
            console.log(error);
            next(error)

        }
    }


    getInstructors = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id!
            console.log('get instructorssssss ', id);

            const result = await this._adminInstructorService.getInstructorsRequest(id)
            res.status(HttpStatus.OK).json({ success: true, instructor: result })
        } catch (error) {
            console.log(error);
            next(error)
        }
    }

    getInstructorsCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id!
            console.log('get instructor courses ', id);

            const result = await this._adminInstructorService.getInstructorsCoursesRequest(id)
            console.log(result);

            res.status(HttpStatus.OK).json({ success: true, courses: result })
        } catch (error) {
            console.log(error);
            next(error)

        }
    }


}