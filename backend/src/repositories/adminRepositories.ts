import { ICount, IUserOverview, PaginatedInstructors, PaginatedUsers, PurchaseResult } from "../interfaces/adminInterfaces.js";
import { CourseModel, ICourse } from "../models/course.js";
import { EarningModel, IEarnings } from "../models/earnings.js";
import { FavouritesModel, IFavourite } from "../models/favourites.js";
import { IInstructor, InstructorModel } from "../models/instructor.js";
import { KycModel } from "../models/kyc.js";
import { IMyCourse, MyCourseModel } from "../models/myCourses.js";
import { INotification, NotificationModel } from "../models/notification.js";
import { IUser, UserModel } from "../models/user.js";





export interface IAdminRepository {
    findByEmail(email: string, password: string): Promise<IUser | null>

    findUsers(search: string, page: number): Promise<PaginatedUsers | null>

    blockUser(id: string): Promise<boolean | null>

    unblockUser(id: string): Promise<boolean | null>

    findInstructors(page: string, search: string): Promise<PaginatedInstructors | null>

    getKycDetails(id: string): Promise<void | null>

    verifyKyc(id: string): Promise<void | null>

    rejectKyc(id: string): Promise<void | null>

    verifyKycNotification(id: string): Promise<INotification | null>

    getInstructorCourses(id: string): Promise<ICourse[] | null>

    getCourseDetails(courseId: string): Promise<ICourse | null>;

    findByCourseId(courseId: string): Promise<IMyCourse[] | null>

    getFullCourseDetails(courseId: string): Promise<{
        course: ICourse;
        instructor: IInstructor | null;
        enrolledUsers: IUser[];
        totalEnrolled: number;
    } | null>;

    getPurchases(search: string, page: number): Promise<PurchaseResult | null>

    getTotalUsers(): Promise<number | null>
    getTotalInstructors(): Promise<number | null>
    getCourses(): Promise<number | null>
    getTotalEnrolled(): Promise<number | null>
    getUserOverview(oneYearAgo: Date): Promise<IUserOverview[]>

    getEarningsData():Promise<IEarnings[] | null>


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


    async getKycDetails(id: string): Promise<void | null> {
        return KycModel.findOne({ instructorId: id })
    }

    async verifyKyc(id: string): Promise<void | null> {
        return await InstructorModel.findByIdAndUpdate(id, { KYCstatus: 'verified', KYCApproved: true })
    }

    async rejectKyc(id: string): Promise<void | null> {
        const update = await InstructorModel.findByIdAndUpdate(id, { KYCstatus: 'rejected' })
        const deleteKyc = await KycModel.findOneAndDelete({ instructorId: id })
        return
    }

    async verifyKycNotification(id: string): Promise<INotification | null>{
        return await NotificationModel.create({recipientId : id , title : "KYC Approved",
            message : "Your KYC has been approved"
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
    

    async getPurchases(search: string = "", page: number = 1): Promise<PurchaseResult | null> {
        try {
            const limit = 4;
            const skip = (page - 1) * limit;

            // 1. Build search filter for DB query
            const searchFilter: any = {};
            if (search) {
                // Search needs to happen on user or course → so we need lookup
                // Simpler: fetch all purchases, then filter by joining user/course
                // ✅ Better approach: pre-populate user & course
            }

            // 2. Fetch ALL purchases (no skip/limit yet) to apply search properly
            const purchases = await MyCourseModel.find().lean();

            // 3. Map purchases with user & course info
            const mapped = await Promise.all(
                purchases.map(async (purchase) => {
                    const user = await UserModel.findById(purchase.userId).select("name email");
                    const course = await CourseModel.findById(purchase.courseId).select("title price");

                    return {
                        _id: purchase._id,
                        userId: purchase.userId,
                        userName: user?.name || "Unknown",
                        userEmail: user?.email || "Unknown",
                        courseId: purchase.courseId,
                        courseTitle: course?.title || "Unknown",
                        coursePrice: course?.price || 0,
                        amountPaid: (purchase as any).amountPaid ?? course?.price,
                        paymentStatus: (purchase as any).paymentStatus ?? "completed",
                        createdAt: purchase.createdAt,
                    };
                })
            );

            // 4. Apply search filter
            const filtered = mapped.filter((p) => {
                if (!search) return true;
                return (
                    p.userName.toLowerCase().includes(search.toLowerCase()) ||
                    p.userEmail.toLowerCase().includes(search.toLowerCase()) ||
                    p.courseTitle.toLowerCase().includes(search.toLowerCase())
                );
            });

            // 5. Apply pagination AFTER filtering
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
        number,instructorId : string , instructorEarning: number, 
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





    async getTotalEnrolled(): Promise<number | null> {
        try {
            const enrolled = await MyCourseModel.countDocuments()
            return enrolled
        } catch (error) {
            console.log(error);
            return null
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

    async getEarningsData():Promise<IEarnings[] | null>{
        try {
            const earnings = await EarningModel.find()
            return earnings
        } catch (error) {
            console.log(error);
            return null
        }
    }


}