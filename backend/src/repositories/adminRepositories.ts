import { CourseModel, ICourse } from "../models/course.js";
import { FavouritesModel, IFavourite } from "../models/favourites.js";
import { IInstructor, InstructorModel } from "../models/instructor.js";
import { KycModel } from "../models/kyc.js";
import { IMyCourse, MyCourseModel } from "../models/myCourses.js";
import { IUser, UserModel } from "../models/user.js";




export interface IAdminRepository {
    findByEmail(email: string , password :string): Promise<IUser | null>

    findUsers(): Promise<IUser[] | null>

    blockUser(id: string): Promise<boolean | null>

    unblockUser(id: string): Promise<boolean | null>

    findInstructors(): Promise<IInstructor[] | null>

    getKycDetails(id: string): Promise<void | null>

    verifyKyc(id: string): Promise<void | null>

    rejectKyc(id: string): Promise<void | null>

    getInstructorCourses(id: string): Promise<ICourse[] | null>

    getCourseDetails(courseId: string): Promise<ICourse | null>;

    findByCourseId(courseId: string): Promise<IMyCourse[] | null>

    getFullCourseDetails(courseId: string): Promise<{
        course: ICourse;
        instructor: IInstructor | null;
        enrolledUsers: IUser[];
        totalEnrolled: number;
    } | null>;

    
}

export class AdminRepository implements IAdminRepository {

    async findByEmail(email: string , password :string): Promise<IUser | null> {
        const user = await UserModel.findOne({ email , password })
        return user
    }

    async findUsers(): Promise<IUser[] | null> {
        return UserModel.find({ name: { $ne: "admin" } });
    }


    async blockUser(id: string): Promise<boolean | null> {
        return await UserModel.findByIdAndUpdate(id, { blocked: true }, { new: true })
    }

    async unblockUser(id: string): Promise<boolean | null> {
        return await UserModel.findByIdAndUpdate(id, { blocked: false }, { new: true })
    }

    async findInstructors(): Promise<IInstructor[] | null> {
        return await InstructorModel.find()
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

    

}