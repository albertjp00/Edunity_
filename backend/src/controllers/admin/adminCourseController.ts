import { Response, Request, NextFunction } from "express";
import { AdminAuthRequest } from "../../middleware/authMiddleware";
import { HttpStatus } from "../../enums/httpStatus.enums";
import { IAdminCategoryController, IAdminCourseReadController, IAdminCourseService, IAdminPurchaseController } from "../../interfaces/adminInterfaces";
import { mapCourseDetailsToDTO, mapCourseToDTO, mapPurchaseToDTO } from "../../mapper/admin.mapper";
import { StatusMessage } from "../../enums/statusMessage";




export class AdminCourseController implements
    IAdminCourseReadController,
    IAdminPurchaseController,
    IAdminCategoryController {

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
            // console.log("courses  admin",courseDTOs);
            
            res.status(HttpStatus.OK).json({
                success: true,
                courses: courseDTOs,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
            });
        } catch (error) {
            next(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: StatusMessage.FAILED_TO_GET_COURSES });
        }
    };


    getCourseDetails = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id!;
            const data = await this._courseService.getCourseDetailsRequest(id);
            console.log('admin course details', id, data);

            // const courseDetailsDTO = mapCourseDetailsToDTO(data);

            // console.log(courseDetailsDTO);


            res.status(HttpStatus.OK).json({
                success: true,
                course: data,
            });
        } catch (error) {
            next(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: StatusMessage.FAILED_TO_GET_COURSE_DETAILS });
        }
    };


    getAllPurchases = async (req: AdminAuthRequest, res: Response, next: NextFunction) => {
        try {
            const { search, page } = req.query;
            console.log('search page  e ee ', search, page);


            const purchases = await this._courseService.getPurchaseDetails(
                search as string,
                Number(page)
            );

            console.log('dtooooooooo', purchases);


            const purchaseDTOs = (purchases.purchases ?? []).map(mapPurchaseToDTO);
            // console.log('dto result -------------', purchaseDTOs);


            res.status(HttpStatus.OK).json({
                success: true, purchases: purchaseDTOs,
                currentPage: purchases.currentPage,
                totalPages: purchases.totalPages,
                totalPurchases: purchases.totalPurchases,
            });
        } catch (err) {
            next(err);
        }
    };



    exportPurchasesPDF = async (req: AdminAuthRequest, res: Response) => {
        try {
            const result = await this._courseService.getPurchaseDetails('', 1);
            const purchases = result.purchases
            if (!purchases || purchases.length === 0) {
                return res.status(400).json({ message: "No purchase data found" });
            }

            const pdfBuffer = await this._courseService.generatePurchasesPDF(purchases);

            res.setHeader("Content-Type", "application/pdf");
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=purchase-report.pdf"
            );

            console.log(pdfBuffer);
        
            res.send(pdfBuffer);
        } catch (error) {
            console.log(error);

        }
    };





    addCategory = async (req: AdminAuthRequest, res: Response, next: NextFunction) => {
        try {
            const { category, skills } = req.body
            console.log(category, skills);

            const categories = await this._courseService.addCategoryRequest(category, skills)
            console.log('adding ------', categories);

            res.json({ success: true, category: categories })
        } catch (error) {
            console.log(error);

        }
    }

    getCategory = async (req: AdminAuthRequest, res: Response, next: NextFunction) => {
        try {
            const categories = await this._courseService.getCategoryRequest()
            console.log(categories);

            res.json({ success: true, category: categories })
        } catch (error) {
            console.log(error);

        }
    }

    deleteCategory = async (req: AdminAuthRequest, res: Response, next: NextFunction) => {
        try {
            const category = req.body.category

            const categories = await this._courseService.deleteCategoryRequest(category)
            // console.log(categories);

            res.json({ success: true })
        } catch (error) {
            console.log(error);

        }
    }

        blockCourse= async (req: AdminAuthRequest, res: Response, next: NextFunction) => {
        try {
            const courseId = req.params.id!

            const categories = await this._courseService.blockCourseRequest(courseId)

            res.json({ success: true })
        } catch (error) {
            console.log(error);

        }
    }


    getReports= async (req: AdminAuthRequest, res: Response, next: NextFunction) => {
        try {
            const reports = await this._courseService.getReportsRequest()

            res.json({ success: true , reports : reports })
        } catch (error) {
            console.log(error);

        }
    }
}
