import { Response, Request } from "express";
import { AdminRepository, IAdminRepository } from "../../repositories/adminRepositories";
import { IKyc } from "../../models/kyc.js";
import { AdminInstructorService } from "../../services/admin/instructorServices";
import { InstructorRepository } from "../../repositories/instructorRepository";
import { AdminCourseService } from "../../services/admin/courseServices";
import { ICourse } from "../../models/course";
import { UserRepository } from "../../repositories/userRepository";
import { AdminAuthRequest } from "../../middleware/authMiddleware";
import { IUserRepository } from "../../interfaces/userInterfaces";
import { IInsRepository } from "../../interfaces/instructorInterfaces";




export class AdminCourseController {
    private _courseService: AdminCourseService

    //pass the dependencies from outside the class(DI)
    constructor(
        repo: IAdminRepository,
        Irepo: IInsRepository,
        Urepo: IUserRepository
    ) {
        this._courseService = new AdminCourseService(repo, Irepo, Urepo)
    }




    getCourses = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 6;

            const data = await this._courseService.getCoursesRequest(page, limit);
            console.log(data)
            const message = "Hello World"
            console.log(message)



            res.json({
                success: true,
                courses: data.courses,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Failed to get courses" });
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
            res.status(500).json({ success: false, message: "Failed to get course details" });
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
            // res.status(500).json({ success: false, message: err.message });
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