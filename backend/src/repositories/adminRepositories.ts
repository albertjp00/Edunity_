import { IAdminCourseDetails, IUserOverview, PaginatedInstructors, PaginatedUsers, PurchaseResult } from "../interfaces/adminInterfaces";
import { IEarningsResult, ITotalEnrolled } from "../interfacesServices.ts/adminServiceInterfaces";
import { CategoryModel, ICategory } from "../models/category";
import { CourseModel, ICourse } from "../models/course";
import { EarningModel} from "../models/earnings";
import { IInstructor, InstructorModel } from "../models/instructor";
import { IKyc, KycModel } from "../models/kyc";
import { IMyCourse, MyCourseModel } from "../models/myCourses";
import { INotification, NotificationModel } from "../models/notification";
import { IQuiz, QuizModel } from "../models/quiz";
import { IReport, ReportModel } from "../models/report";
import { IUser, UserModel } from "../models/user";






export interface IAdminRepository {
    findByEmail(email: string, password: string): Promise<IUser | null>

    findUsers(search: string, page: number): Promise<PaginatedUsers | null>

    blockUser(id: string): Promise<boolean | null>

    unblockUser(id: string): Promise<boolean | null>

    findUserCourses(id: string): Promise<ICourse[] | null>

    findInstructors(page: string, search: string): Promise<PaginatedInstructors | null>

    getKycDetails(id: string): Promise<IKyc | null>

    verifyKyc(id: string): Promise<void | null>

    rejectKyc(id: string): Promise<void | null>

    verifyKycNotification(id: string): Promise<INotification | null>

    getInstructorCourses(id: string): Promise<ICourse[] | null>

    getCourseDetails(courseId: string): Promise<ICourse | null>;

    findByCourseId(courseId: string): Promise<IMyCourse[] | null>

    getFullCourseDetails(courseId: string): Promise<IAdminCourseDetails | null>;

    getQuiz(courseId: string): Promise<IQuiz[] | null>

    getPurchases(search: string, page: number): Promise<PurchaseResult | null>

    addCategory(category: string, skills: string[]): Promise<ICategory | null>
    getCategory(): Promise<ICategory[] | null>
    deleteCategory(category: string): Promise<boolean | null>

    getTotalUsers(): Promise<number | null>
    getTotalInstructors(): Promise<number | null>
    getCourses(): Promise<number | null>
    getTotalEnrolled(): Promise<ITotalEnrolled[] | null>
    getUserOverview(oneYearAgo: Date): Promise<IUserOverview[]>

    getEarningsData(page: number): Promise<IEarningsResult | null>


    blockCourse(courseId: string): Promise<boolean | null>

    getReports(): Promise<IReport[] | null>

    blockUnblockInstructor(id: string): Promise<boolean>
}




export class AdminRepository implements IAdminRepository {

    async findByEmail(email: string, password: string): Promise<IUser | null> {
        const user = await UserModel.findOne({ email, password })
        console.log(user);

        return user
    }


    async findUsers(search: string, page: number): Promise<PaginatedUsers> {

        const limit: number = 5

        const query = {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ]
        };

        const totalUsers = await UserModel.countDocuments(query);

        const skip = (page - 1) * limit;

        const users = await UserModel.find(query)
            .skip(skip)
            .limit(limit);


        const totalPages = Math.ceil(totalUsers / limit);

        return {
            users,
            totalPages,
            currentPage: page,
            totalUsers,
        };
    }



    async blockUser(id: string): Promise<boolean | null> {
        return await UserModel.findByIdAndUpdate(id, { blocked: true }, { new: true })
    }

    async unblockUser(id: string): Promise<boolean | null> {
        return await UserModel.findByIdAndUpdate(id, { blocked: false }, { new: true })


    }

    async findUserCourses(userId: string): Promise<ICourse[] | null> {
        try {
            const myCourses = await MyCourseModel.find({ userId });

            const courseIds = myCourses.map((c) => c.courseId);


            const courses = await CourseModel.find(
                { _id: { $in: courseIds } },
                { _id: 1, title: 1, thumbnail: 1 }
            );

            return courses;
        } catch (error) {
            console.log(error);
            return null
        }
    }



    async findInstructors(page: string, search: string): Promise<PaginatedInstructors | null> {
        const limit = 4;
        const skip = (Number(page) - 1) * limit;

        const query = { name: { $regex: search, $options: 'i' } };

        const totalInstructors = await InstructorModel.countDocuments(query);

        const instructors = await InstructorModel.find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalPages = Math.ceil(totalInstructors / limit);

        return {
            instructors,
            totalPages,
            currentPage: Number(page),
            totalInstructors,
        };
    }


    async getKycDetails(id: string): Promise<IKyc | null> {
        
        return KycModel.findOne({ instructorId: id })
    }

    async verifyKyc(id: string): Promise<void | null> {
        return await InstructorModel.findByIdAndUpdate(id, { KYCstatus: 'verified', KYCApproved: true })
    }

    async rejectKyc(id: string): Promise<void | null> {
        await InstructorModel.findByIdAndUpdate(id, { KYCstatus: 'rejected' })
        await KycModel.findOneAndDelete({ instructorId: id })
        return
    }

    async verifyKycNotification(id: string): Promise<INotification | null> {
        return await NotificationModel.create({
            recipientId: id, title: "KYC Approved",
            message: "Your KYC has been approved"
        })
    }

    async getInstructorCourses(id: string): Promise<ICourse[] | null> {
        return await CourseModel.find({ instructorId: id })
    }


    async getCourseDetails(courseId: string): Promise<ICourse | null> {
        return await CourseModel.findById(courseId);
    }


    async findByCourseId(courseId: string): Promise<IMyCourse[] | null> {
        return await MyCourseModel.find({ "course.id": courseId });
    }

    async getFullCourseDetails(courseId: string): Promise<{
        course: ICourse;
        instructor: IInstructor | null;
        enrolledUsers: IUser[];
        totalEnrolled: number;
    } | null> {

        const course = await CourseModel.findById(courseId);
        if (!course) return null;

        const instructor = await InstructorModel.findById(course.instructorId);

        const enrolledDocs = await MyCourseModel.find({ "course.id": courseId });
        const userIds = enrolledDocs.map((doc) => doc.userId);

        const enrolledUsers = await UserModel.find({ _id: { $in: userIds } }).select(
            "name email profileImage"
        );

        return {
            course,
            instructor,
            enrolledUsers,
            totalEnrolled: enrolledUsers.length,
        };
    }

    async getQuiz(courseId: string): Promise<IQuiz[] | null> {
        try {
            const quiz = await QuizModel.find({ courseId: courseId })
            return quiz
        } catch (error) {
            console.log(error);
            return null
        }
    }


    async getPurchases(search: string = "", page: number = 1): Promise<PurchaseResult | null> {
        try {
            const limit = 4;
            const skip = (page - 1) * limit;

            const purchases = await MyCourseModel.find().lean();

            type PaymentStatus = 'completed' | 'pending' | 'failed';


            const mapped = await Promise.all(
                purchases.map(async (purchase) => {
                    const user = await UserModel.findById(purchase.userId).select("name email");
                    const course = await CourseModel.findById(purchase.courseId).select("title price");

                    const paymentStatus: PaymentStatus =
                        purchase.paymentStatus === 'completed' ||
                            purchase.paymentStatus === 'pending' ||
                            purchase.paymentStatus === 'failed'
                            ? purchase.paymentStatus
                            : 'completed';


                    return {
                        _id: purchase.id,
                        userId: purchase.userId,
                        userName: user?.name || "Unknown",
                        userEmail: user?.email || "Unknown",
                        courseId: purchase.courseId,
                        courseTitle: course?.title || "Unknown",
                        coursePrice: course?.price || 0,
                        amountPaid: purchase.amountPaid ?? course?.price,
                        paymentStatus,
                        createdAt: purchase.createdAt,
                    };
                })
            );

            const filtered = mapped.filter((p) => {
                if (!search) return true;
                return (
                    p.userName.toLowerCase().includes(search.toLowerCase()) ||
                    p.userEmail.toLowerCase().includes(search.toLowerCase()) ||
                    p.courseTitle.toLowerCase().includes(search.toLowerCase())
                );
            });

            const totalPurchases = filtered.length;
            const totalPages = Math.ceil(totalPurchases / limit);

            const paginated = filtered.slice(skip, skip + limit);

            return {
                purchases: paginated,
                totalPurchases,
                totalPages,
                currentPage: page,
            };
        } catch (error) {
            console.error("Error fetching purchases:", error);
            return null;
        }
    }


    async addCategory(category: string, skills: string[]): Promise<ICategory | null> {
        return await CategoryModel.create({ name: category, skills: skills })

    }

    async getCategory(): Promise<ICategory[] | null> {
        return await CategoryModel.find()
    }

    async deleteCategory(category: string): Promise<boolean | null> {
        try {
            await CategoryModel.findOneAndDelete({ name: category })
            return true
        } catch (error) {
            console.log(error);
            return null
        }
    }



    async getTotalUsers(): Promise<number | null> {
        try {
            const users = await UserModel.countDocuments()
            return users
        } catch (error) {
            console.log(error);
            return null
        }
    }


    async getTotalInstructors(): Promise<number | null> {
        try {
            const instructors = await UserModel.countDocuments()
            return instructors
        } catch (error) {
            console.log(error);
            return null
        }
    }


    async getCourses(): Promise<number | null> {
        try {
            const courses = await CourseModel.countDocuments()
            return courses
        } catch (error) {
            console.log(error);
            return null
        }
    }


    async updateEarnings(courseId: string, coursePrice:
        number, instructorId: string, instructorEarning: number,
        adminEarning: number): Promise<void> {
        try {


            await EarningModel.findOneAndUpdate(
                { courseId: courseId },
                {
                    $inc: {
                        totalSales: 1,
                        CoursePrice: coursePrice,
                        instructorEarnings: instructorEarning,
                        adminEarnings: adminEarning,
                    },
                    instructorId: instructorId,
                    lastUpdated: new Date(),
                },
                { upsert: true, new: true }
            )

        } catch (error) {
            console.log(error);

        }
    }





    async getTotalEnrolled(): Promise<ITotalEnrolled[] | null
    > {
        try {

            const startDate = new Date("2025-01-01T00:00:00.000Z");
            const endDate = new Date("2026-12-31T23:59:59.999Z");

            const result = await MyCourseModel.aggregate([
                {
                    $match: {
                        createdAt: {
                            $gte: startDate,
                            $lte: endDate,
                        },
                        paymentStatus: "completed",
                        blocked: false,
                        // cancelCourse: false,
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                        },
                        enrolled: { $sum: 1 },
                    },
                },
                {
                    $sort: {
                        "_id.year": -1,
                        "_id.month": 1,
                    },
                },
                {
                    $project: {
                        _id: 0,
                        month: {
                            $concat: [
                                { $toString: "$_id.year" },
                                "-",
                                {
                                    $cond: [
                                        { $lt: ["$_id.month", 10] },
                                        { $concat: ["0", { $toString: "$_id.month" }] },
                                        { $toString: "$_id.month" },
                                    ],
                                },
                            ],
                        },
                        enrolled: 1,
                    },
                },
            ]);

            console.log('monthy', result);


            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }




    async getUserOverview(oneYearAgo: Date): Promise<IUserOverview[]> {
        try {
            const usersByMonth = await UserModel.aggregate([
                { $match: { createdAt: { $gte: oneYearAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        count: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]);
            console.log(usersByMonth);

            return usersByMonth;
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

    async getEarningsData(page: number): Promise<IEarningsResult | null> {
        try {
            const limit = 4
            const total = await EarningModel.countDocuments()
            const totalPages = Math.ceil(total / limit)
            const skip = (page - 1) * limit
            const earnings = await EarningModel.find().skip(skip).limit(limit)
            return { earnings, totalPages }
        } catch (error) {
            console.log(error);
            return null
        }
    }

    async blockCourse(courseId: string): Promise<boolean | null> {
        try {
            const course = await CourseModel.findById(courseId)
            console.log(course);

            if (!course?.blocked) {
                await CourseModel.findByIdAndUpdate(courseId, { blocked: true }, { new: true })
                await MyCourseModel.updateMany({ courseId: courseId }, { $set: { blocked: true } })

            } else {
                await CourseModel.findByIdAndUpdate(courseId, { blocked: false }, { new: true })
                await MyCourseModel.updateMany({ courseId: courseId }, { $set: { blocked: false } })
            }

            return true
        } catch (error) {
            console.log(error);
            return null

        }
    }

    async getReports(): Promise<IReport[] | null> {
        try {
            const report = await ReportModel.find()
            return report
        } catch (error) {
            console.log(error);
            return null
        }
    }

    async blockUnblockInstructor(id: string): Promise<boolean> {

        const instructor = await InstructorModel.findById(id)

        if (instructor?.blocked) {
            await InstructorModel.findByIdAndUpdate(id, { blocked: false }, { new: true })
        } else {
            await InstructorModel.findByIdAndUpdate(id, { blocked: true }, { new: true })
        }
        return true
    }


}