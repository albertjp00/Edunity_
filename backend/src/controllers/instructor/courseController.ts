import { Request, Response } from "express";
import { CourseService } from "../../services/instructor/courseServices.js";
import { InstructorRepository } from "../../repositories/instructorRepository.js";
import { InstAuthRequest } from "../../middleware/authMiddleware.js";

export class InstCourseController {
    private courseService: CourseService;

    constructor() {
        const repo = new InstructorRepository();
        this.courseService = new CourseService(repo);
    }

    myCourses = async (req: InstAuthRequest, res: Response): Promise<void> => {
        try {
            const id = req.instructor?.id
            console.log("get Courses user");


            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 6;

            const data = await this.courseService.fetchCourses(id, page, limit);

            res.json({
                success: true,
                course: data.courses,
                skills: data.skills,
                totalPages: data.totalPages,
                currentPage: data.currentPage
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Failed to get courses" });
        }
    };

    courseDetails = async( req:InstAuthRequest , res:Response):Promise<void> =>{
        try {
            const id = req.instructor?.id
            const courseId = req.params.id!
            const result = await this.courseService.fetchCourseDetails(id , courseId)
            console.log("course" ,result);
            
            res.json({success:true , course:result})
        } catch (error) {
            console.log(error);
            
        }
    }
}
