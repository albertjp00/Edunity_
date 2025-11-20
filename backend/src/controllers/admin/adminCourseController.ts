import { Response, Request } from "express";
import { AdminCourseService } from "../../services/admin/courseServices";
import { AdminAuthRequest } from "../../middleware/authMiddleware";
import { HttpStatus } from "../../enums/httpStatus.enums";
import { IAdminCourseReadController, IAdminPurchaseController } from "../../interfaces/adminInterfaces";




export class AdminCourseController implements
    IAdminCourseReadController,
    IAdminPurchaseController {
    private _courseService: AdminCourseService

    //pass the dependencies from outside the class(DI)
    constructor(adminCourseService: AdminCourseService
    ) {
        this._courseService = adminCourseService
    }




    getCourses = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 6;
            const search = req.query.search
            console.log(search);

            const data = await this._courseService.getCoursesRequest(page, search as string, limit);
            console.log(data)
            res.json({
                success: true,
                courses: data.courses,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
            });
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to get courses" });
        }
    };


    getCourseDetails = async (req: Request, res: Response) => {
        try {
            const id = req.params.id!
            console.log('course details');

            const data = await this._courseService.getCourseDetailsRequest(id);
            console.log(data);


            res.json({
                success: true,
                course: data?.course,
                instructor: data?.instructor,
                enrolledUsers: data?.enrolledUsers,
            });
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Failed to get course details" });
        }
    };



    getAllPurchases = async (req: AdminAuthRequest, res: Response) => {
        try {


            const { search, page } = req.query
            console.log("search", search);

            const data = await this._courseService.getPurchaseDetails(search as string, Number(page))
            // console.log(data);


            res.json({ success: true, purchases: data });
        } catch (err) {
            // res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: err.message });
            console.log(err);

        }
    };


    // getInstructors = async(req:Request , res:Response):Promise<void>=>{
    //     try {
    //         const id = req.params.id!
    //         console.log('get instructorssssss ',id);

    //         const result = await this.courseService.getInstructorsRequest(id)
    //         res.json({success:true , instructor:result})
    //     } catch (error) {
    //         console.log(error);

    //     }
    // }

}