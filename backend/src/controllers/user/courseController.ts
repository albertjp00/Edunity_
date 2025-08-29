import { RequestHandler, Response } from "express";
import { AuthRequest } from "../../middleware/authMiddleware.js";
import { UserRepository } from "../../repositories/userRepository.js";
import { UserCourseService } from "../../services/user/userCourseService.js";
import { InstructorRepository } from "../../repositories/instructorRepository.js";
import { AdminRepository } from "../../repositories/adminRepositories.js";

export class UserCourseController {
    private courseService: UserCourseService;

    constructor() {
        // const repo = new UserRepository();
        // this.courseService = new UserCourseService(repo);

        const userRepo = new UserRepository();
        const instructorRepo = new InstructorRepository();
        const adminRepo = new AdminRepository()

        this.courseService = new UserCourseService(userRepo, instructorRepo ,adminRepo);
    }

    // Explicitly type as Express RequestHandler
    showCourses: RequestHandler = async (req: AuthRequest, res: Response) => {
        try {
            console.log("get Courses user");

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 6;

            const data = await this.courseService.getCourses(page, limit);

            res.json({
                success: true,
                course: data.courses,
                skills: data.skills,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Failed to get courses" });
        }
    };


    courseDetails = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const id = req.user?.id!
            const courseId = req.query.id as string
            const result = await this.courseService.fetchCourseDetails(id, courseId)
            // console.log("course", result);

            res.json({ success: true, course: result })
        } catch (error) {
            console.log(error);

        }
    }

    buyCourse = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const id = req.user?.id!

            const courseId = req.params.id
            console.log('buying course', courseId);


            const response = await this.courseService.buyCourseService(id, courseId)
            res.json({ success: true })
        } catch (error) {
            console.log(error);

        }
    }

    myCourses = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const id = req.user?.id!
            console.log(id);

            const result = await this.courseService.myCoursesRequest(id)
            console.log('my courses result ');

            res.status(200).json({ success: true, course: result })

        } catch (error) {
            console.log(error);

        }
    }

    viewMyCourse = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const id = req.user?.id!
            const myCourseId = req.params.id!
            console.log('viewMyCourse', myCourseId, id);

            const result = await this.courseService.viewMyCourseRequest(id, myCourseId)

            res.json({ success: true, course: result })
        } catch (error) {
            console.log(error);
        }
    }

    // controllers/courseController.ts
    updateProgress = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id as string;
            const { courseId, moduleTitle } = req.body;

            if (!userId || !courseId || !moduleTitle) {
                res.status(400).json({ success: false, message: "Missing required fields" });
                return;
            }

            const result = await this.courseService.updateProgress(userId, courseId, moduleTitle);

            res.json({ success: true, progress: result });
        } catch (error) {
            console.error("Error updating progress:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    };

    getInstructors = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const instructor = await this.courseService.getInstructorsRequest()

            res.json({ success: true, instructors : instructor});
        } catch (error) {
            console.error("Error updating progress:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    };

}
