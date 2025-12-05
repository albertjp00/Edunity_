import { Response, Request, NextFunction } from "express";
import { AdminAuthRequest } from "../../middleware/authMiddleware";
import { HttpStatus } from "../../enums/httpStatus.enums";
import { IAdminCourseReadController, IAdminCourseService, IAdminPurchaseController } from "../../interfaces/adminInterfaces";
import { mapCourseDetailsToDTO, mapCourseToDTO, mapPurchaseToDTO } from "../../mapper/admin.mapper";




export class AdminCourseController implements
    IAdminCourseReadController,
    IAdminPurchaseController {

    private _courseService: IAdminCourseService;

    constructor(adminCourseService: IAdminCourseService) {
        this._courseService = adminCourseService;
    }


    
    getCourses = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 6;
            const search = req.query.search as string;

            const data = await this._courseService.getCoursesRequest(page, search, limit);

            const courseDTOs = (data.courses ?? []).map(mapCourseToDTO);
            res.json({
                success: true,
                courses: courseDTOs,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
            });
        } catch (error) {
            next(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to get courses" });
        }
    };


    getCourseDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id!;
            const data = await this._courseService.getCourseDetailsRequest(id);
            console.log('admin course details',data);
            
            const courseDetailsDTO = mapCourseDetailsToDTO(data);

            res.json({
                success: true,
                course: courseDetailsDTO,
            });
        } catch (error) {
            next(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to fetch course details" });
        }
    };


    getAllPurchases = async (req: AdminAuthRequest, res: Response, next: NextFunction) => {
        try {
            const { search, page } = req.query;

            const purchases = await this._courseService.getPurchaseDetails(
                search as string,
                Number(page)
            );

            console.log('dtooooooooo', purchases);


            const purchaseDTOs = (purchases.purchases ?? []).map(mapPurchaseToDTO);
            console.log('dto result -------------', purchaseDTOs);


            res.json({
                success: true, purchases: purchaseDTOs,
                currentPage: purchases.currentPage,
                totalPages: purchases.totalPages,
                totalPurchases: purchases.totalPurchases,
            });
        } catch (err) {
            next(err);
        }
    };
}
