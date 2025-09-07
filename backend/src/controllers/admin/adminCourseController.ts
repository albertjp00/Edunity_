import { Response, Request } from "express";
import { AdminRepository } from "../../repositories/adminRepositories.js";
import { IKyc } from "../../models/kyc.js";
import { AdminInstructorService } from "../../services/admin/instructorServices.js";
import { InstructorRepository } from "../../repositories/instructorRepository.js";
import { AdminCourseService } from "../../services/admin/courseServices.js";
import { ICourse } from "../../models/course.js";
import { UserRepository } from "../../repositories/userRepository.js";

export class AdminCourseController {
    private courseService: AdminCourseService

    constructor() {
        const repo = new AdminRepository();
        const Irepo = new InstructorRepository()
        const Urepo = new UserRepository()
        this.courseService = new AdminCourseService(repo, Irepo, Urepo)
    }

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

    getCourses = async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 6;

            const data = await this.courseService.getCoursesRequest(page, limit);
            console.log(data);
            

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

            const data = await this.courseService.getCourseDetailsRequest(id);
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



}