import { RequestHandler, Response } from "express";
import { AuthRequest } from "../../middleware/authMiddleware";
import { UserRepository } from "../../repositories/userRepository";
import { UserCourseService } from "../../services/user/userCourseService";
import { InstructorRepository } from "../../repositories/instructorRepository";
import { AdminRepository } from "../../repositories/adminRepositories";
import instructor from "../../routes/instructorRoutes.js";

export class UserCourseController {
    private courseService: UserCourseService;

    constructor() {
        // const repo = new UserRepository();
        // this.courseService = new UserCourseService(repo);

        const userRepo = new UserRepository();
        const instructorRepo = new InstructorRepository();
        const adminRepo = new AdminRepository()

        this.courseService = new UserCourseService(userRepo, instructorRepo, adminRepo);
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


    getAllCourses = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            console.log("get all courses");

            const {
                categories,
                price,
                level,
                priceMin,
                priceMax,
                sortBy,
                page = 1,
                limit = 10
            } = req.query;

            const query: any = {};

            if (categories) {
                query.category = { $in: (categories as string).split(",") };
            }



            if (price === "free") query.price = 0;
            if (price === "paid") query.price = { $gt: 0 };

            let sortOption: any = {};
            if (sortBy === "priceLowToHigh") sortOption.price = 1;
            if (sortBy === "priceHighToLow") sortOption.price = -1;

            if (priceMin || priceMax) {
                query.price = {};
                if (priceMin) query.price.$gte = Number(priceMin);
                if (priceMax) query.price.$lte = Number(priceMax);
            }

            if (level) query.level = level;

            const { courses, totalCount } = await this.courseService.getAllCourses(
                query,
                Number(page),
                Number(limit),
                sortOption
            );

            res.json({
                courses,
                totalPages: Math.ceil(totalCount / Number(limit)),
                totalCount,
            });
        } catch (error) {
            console.log("Error in getAllCourses:", error);
            res.status(500).json({ message: "Failed to fetch courses" });
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

    // buyCourse = async (req: AuthRequest, res: Response): Promise<void> => {
    //     try {
    //         const id = req.user?.id!

    //         const courseId = req.params.id
    //         console.log('buying course', courseId);


    //         const response = await this.courseService.buyCourseService(id, courseId)
    //         res.json({ success: true })
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    // controller
    buyCourse = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const id = req.user?.id!;
            const courseId = req.params.id!;

            const order = await this.courseService.buyCourseRequest(id, courseId);

            if ((order as any).existingPurchase) {
                res.json({ success: false, message: "You already purchased this course" });
                return;
            }

            if ((order as any).existingOrder) {
                res.json({
                    success: true,
                    orderId: order.orderId,
                    amount: order.amount,
                    currency: order.currency,
                    key: process.env.RAZORPAY_KEY_ID,
                    courseId,
                    status: order.status,
                    message: "Existing order found",
                });
                return;
            }

            // New order case
            res.json({
                success: true,
                orderId: order.orderId,
                amount: order.amount,
                currency: order.currency,
                key: process.env.RAZORPAY_KEY_ID,
                courseId,
                status: order.status,
            });

        } catch (error) {
            console.error("Error in buyCourse:", error);
            res.status(500).json({ success: false, message: "Payment initiation failed" });
        }
    };

    verifyPayment = async (req: AuthRequest, res: Response) => {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
            const userId = req.user?.id!;
            console.log('verify pay', userId);


            const result = await this.courseService.verifyPaymentRequest(
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                courseId,
                userId
            );


            if (result.success) {
                return res.json(result);
            } else {
                return res.status(400).json(result);
            }
        } catch (error) {
            console.error("Payment verification failed:", error);
            res.status(500).json({ success: false, message: "Payment verification failed" });
        }
    };








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
            console.log(result);


            res.json({ success: true, course: result, instructor: result?.instructor })
        } catch (error) {
            console.log(error);
        }
    }

    // controllers/courseController.ts
    updateProgress = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id as string;
            const { courseId, moduleTitle } = req.body;
            console.log('progress', courseId);


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

            res.json({ success: true, instructors: instructor });
        } catch (error) {
            console.error("Error updating progress:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    };


    addtoFavourites = async (req: AuthRequest, res: Response): Promise<void> => {
        try {
            const userId = req.user?.id as string;
            const courseId = req.params.id!;

            const result = await this.courseService.addtoFavourites(userId, courseId);
            console.log(result);

            if (!result.success) {
                res.json({ success: false, message: "Course already exists in favourites" });
            }

            res.json(result);
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    };


}
