import { RequestHandler, Response } from "express";
import { AuthRequest } from "../../middleware/authMiddleware.js";
import { UserRepository } from "../../repositories/userRepository.js";
import { UserCourseService } from "../../services/user/userCourseService.js";

export class UserCourseController {
    private courseService: UserCourseService;

    constructor() {
        const repo = new UserRepository();
        this.courseService = new UserCourseService(repo);
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
}
