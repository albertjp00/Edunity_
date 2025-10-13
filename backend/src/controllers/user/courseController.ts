import { NextFunction, RequestHandler, Response } from "express";
import { AuthRequest } from "../../middleware/authMiddleware.js";
import { UserRepository } from "../../repositories/userRepository.js";
import { UserCourseService } from "../../services/user/userCourseService.js";
import { InstructorRepository } from "../../repositories/instructorRepository.js";
import { AdminRepository } from "../../repositories/adminRepositories.js";
import instructor from "../../routes/instructorRoutes.js";
import { debounceCall } from "../../utils/debounce.js";

export class UserCourseController {
    private _courseService: UserCourseService;

    constructor() {
        // const repo = new UserRepository();
        // this.courseService = new UserCourseService(repo);

        const userRepo = new UserRepository();
        const instructorRepo = new InstructorRepository();
        const adminRepo = new AdminRepository()

        this._courseService = new UserCourseService(userRepo, instructorRepo, adminRepo);
    }

    // Explicitly type as Express RequestHandler
    showCourses: RequestHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            console.log("get Courses user");

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 6;

            const data = await this._courseService.getCourses(page, limit);

            res.json({
                success: true,
                course: data.courses,
                skills: data.skills,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
            });
        } catch (error) {
            // console.error(error);
            next(error)
            res.status(500).json({ success: false, message: "Failed to get courses" });
        }
    };


    getAllCourses = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            console.log("get all courses", req.query);

            const {
                categories,
                price,
                level,
                priceMin,
                priceMax,
                sortBy,
                page = 1,
                limit = 10,
                search
            } = req.query;
            // console.log("search ", search);


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

            if (search) {
                query.$or = [
                    { title: { $regex: search as string, $options: "i" } },
                    { description: { $regex: search as string, $options: "i" } }
                ];
            }

            const { courses, totalCount } = await this._courseService.getAllCourses(
                query,
                Number(page),
                Number(limit),
                sortOption
            );
            // console.log(totalCount);



            res.json({
                courses,
                totalPages: Math.ceil(totalCount / Number(limit)),
                totalCount,
            });
        } catch (error) {
            // console.log("Error in getAllCourses:", error);
            next(error)
            res.status(500).json({ message: "Failed to fetch courses" });
        }
    };




    courseDetails = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            // console.log('details');

            const id = req.user?.id!
            const courseId = req.query.id as string
            const result = await this._courseService.fetchCourseDetails(id, courseId)
            // console.log("course", result);


            res.json({ success: true, course: result })
        } catch (error) {
            // console.log(error);
            next(error)

        }
    }

    // buyCourse = async (req: AuthRequest, res: Response): Promise<void> => {
    //     try {
    //         const id = req.user?.id!

    //         const courseId = req.params.id
    //         console.log('buying course', courseId);


    //         const response = await this._courseService.buy_courseService(id, courseId)
    //         res.json({ success: true })
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }
    // controller
    buyCourse = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id!;
            const courseId = req.params.id!;
            console.log('Buy course', userId, courseId);

            // Key for debouncing (user + course)
            const key = `buyCourse_${userId}_${courseId}`;

            const order = await debounceCall(key, 2000, async () => {
                // This function runs only if user hasn't triggered in last 2s
                return await this._courseService.buyCourseRequest(userId, courseId);
            });

            res.json({
                success: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                key: process.env.RAZORPAY_KEY_ID,
                courseId,
            });

        } catch (error) {
            // console.error("Error in buyCourse:", error);
            next(error)
            res.status(500).json({ success: false, message: "Payment initiation failed" });
        }
    };


    verifyPayment = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseId } = req.body;
            const userId = req.user?.id!;
            console.log('verify pay', userId);

            const key = `verifyPayment_${userId}_${courseId}`;

            const result = await debounceCall(key, 2000, async () => {
                return await this._courseService.verifyPaymentRequest(
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                    courseId,
                    userId
                );
            });

            if (result.success) {
                return res.json(result);
            } else {
                return res.status(400).json(result);
            }

        } catch (error) {
            // console.error("Payment verification failed:", error);
            next(error)
            res.status(500).json({ success: false, message: "Payment verification failed" });
        }
    };









    myCourses = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const id = req.user?.id!

            const page = parseInt(req.params.page as string) || 1
            console.log(id, page);


            const result = await this._courseService.myCoursesRequest(id, page)
            console.log('my courses result ', result);

            if(!result) return

            const { populatedCourses, result: paginationData } = result;

            res.json({
                success: true,
                courses: populatedCourses,
                totalCount: paginationData?.totalCount,
                totalPages: paginationData?.totalPages,
                currentPage: page,
            });

        } catch (error) {
            // console.log(error);
            next(error)

        }
    }

    viewMyCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const id = req.user?.id!
            const myCourseId = req.params.id!
            console.log('viewMyCourse', myCourseId, id);

            const result = await this._courseService.viewMyCourseRequest(id, myCourseId)
            // console.log('mycourses view', result);


            res.json({ success: true, course: result, instructor: result?.instructor, quiz: result?.quizExists })
        } catch (error) {
            // console.log(error);
            next(error)
        }
    }

    // controllers/courseController.ts



    updateProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            const { courseId, moduleTitle } = req.body;
            console.log('progress', courseId, moduleTitle);

            if (!userId || !courseId || !moduleTitle) {
                res.status(400).json({ success: false, message: "Missing required fields" });
                return;
            }

            const result = await this._courseService.updateProgress(userId, courseId, moduleTitle);

            res.json({ success: true, progress: result });
        } catch (error) {
            // console.error("Error updating progress:", error);
            next(error)
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    };


    getInstructors = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const instructor = await this._courseService.getInstructorsRequest()

            res.json({ success: true, instructors: instructor });
        } catch (error) {
            // console.error("Error updating progress:", error);
            next(error)
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    };


    addtoFavourites = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id as string;
            const courseId = req.params.id!;

            const result = await this._courseService.addtoFavourites(userId, courseId);
            // console.log(result);

            if (!result.success) {
                res.json({ success: false, message: "Course already exists in favourites" });
            }

            res.json(result);
        } catch (error) {
            // console.log(error);
            next(error)
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    };

    getFavourites = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id!
            const data = await this._courseService.getFavourites(userId)
            // console.log(data);

            res.json({ success: true, favourites: data })

        } catch (error) {
            // console.log(error);
            next(error)

        }
    }

    favCourseDetails = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const id = req.user?.id!
            const courseId = req.query.id as string
            const result = await this._courseService.favCourseDetails(id, courseId)
            // console.log("course", result);

            res.json({ success: true, course: result })
        } catch (error) {
            // console.log(error);
            next(error)
        }
    }


    getQuiz = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const { courseId } = req.params
            const userId = req.user?.id
            console.log("quiz", courseId);



            const quiz = await this._courseService.getQuiz(courseId as string)
            res.json({ success: true, quiz })
        } catch (error) {
            // console.log(error);
            next(error)

        }
    }


    submitQuiz = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id!

            const { courseId, quizId } = req.params
            const answers = req.body


            // console.log("submit quiz ",userId , courseId , quizId);
            // console.log(answers);

            const data = await this._courseService.submitQuiz(userId, courseId as string, quizId as string, answers)
            // console.log('submitted ', data);

            res.json({ success: true, data })
        } catch (error) {
            // console.log(error);
            next(error)
        }
    }



}
