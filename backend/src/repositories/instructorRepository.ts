import { CourseModel, ICourse } from "../models/course.js";
import { EventModel, IEvent } from "../models/events.js";
import { IInstructor, InstructorModel } from "../models/instructor.js";
import { IKyc, KycModel } from "../models/kyc.js";
import { IMyCourse, MyCourseModel } from "../models/myCourses.js";


export interface ISkills {
    uniqueSkills: string[] | null;
}


export interface IInsRepository {
    findByEmail(email: string): Promise<IInstructor | null>

    findById(id: string): Promise<IInstructor | null>

    updateProfile(id: string, data: any): Promise<IInstructor | null>

    updatePassword(id: string, newPassword: string): Promise<IInstructor | null>

    kycSubmit(id: string, idProof: string, addressProof: string): Promise<IKyc | null>

    addCourse(id: string, data: any): Promise<ICourse | null>

    getCourses(id: string, skip: number, limit: number): Promise<ICourse[] | null>

    getCourseDetails(courseId: string): Promise<ICourse | null>

    editCourse(id: string, data: any): Promise<ICourse | null>

    countCourses(): Promise<number>;

    findSkills(): Promise<ISkills>;

    addEvent(id: string,name:string , data: Partial<IEvent>): Promise<IEvent>

    getMyEvents(id:string):Promise<IEvent[] | null>

}


export class InstructorRepository implements IInsRepository {
    async findByEmail(email: string): Promise<IInstructor | null> {
        const user = await InstructorModel.findOne({ email })
        return user
    }



    async findById(id: string): Promise<IInstructor | null> {
        return await InstructorModel.findById(id);
    }

    async updateProfile(id: string, data: any): Promise<IInstructor | null> {
        return await InstructorModel.findByIdAndUpdate(id, data, { new: true })
    }

    async updatePassword(id: string, newPassword: string): Promise<IInstructor | null> {
        return await InstructorModel.findByIdAndUpdate(id, { password: newPassword }, { new: true })
    }

    async kycSubmit(id: string, idProof: string, addressProof: string): Promise<IKyc | null> {
        await InstructorModel.findByIdAndUpdate(id, { KYCstatus: 'pending' }, { new: true })
        return await KycModel.create({ instructorId: id, idProof: idProof, addressProof: addressProof })
    }

    async addCourse(id: string, data: any): Promise<ICourse | null> {
        return await CourseModel.create({ instructorId: id, ...data, });
    }


    async getCourses(id: string, skip: number, limit: number): Promise<ICourse[]> {
        const courses = await CourseModel.find({ instructorId: id }).skip(skip).limit(limit);
        console.log(courses);
        
        return courses || [];
    }

    async getCourseDetails(courseId: string): Promise<ICourse | null> {
        const course = await CourseModel.findById(courseId)
        return course
    }

    async editCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
        return await CourseModel.findByIdAndUpdate(id, data, { new: true });
    }


    async countCourses(): Promise<number> {
        return await CourseModel.countDocuments();

    }

    async findSkills(): Promise<ISkills> {
        const result = await CourseModel.aggregate([
            { $unwind: "$skills" },
            { $group: { _id: null, uniqueSkills: { $addToSet: "$skills" } } },
            { $project: { _id: 0, uniqueSkills: 1 } }
        ])

        return result[0]
    }

    async addEvent(id: string,name:string, data: Partial<IEvent>):Promise<IEvent>{
        return await EventModel.create({instructorId:id , instructorName:name  , ...data })
    }

    async getMyEvents(id:string):Promise<IEvent[] | null>{
        return await EventModel.find({instructorId : id})
    }

}


