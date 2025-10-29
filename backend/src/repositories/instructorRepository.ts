import { Types } from "mongoose";
import { CourseModel, ICourse } from "../models/course.js";
import { EventModel, IEvent } from "../models/events.js";
import { IInstructor, InstructorModel } from "../models/instructor.js";
import { IKyc, KycModel } from "../models/kyc.js";
import { IMyCourse, MyCourseModel } from "../models/myCourses.js";
import { IQuiz, QuizModel } from "../models/quiz.js";
import { IUser, UserModel } from "../models/user.js";
import { IEventResult, IPurchaseDetails } from "../interfaces/instructorInterfaces.js";
// import { IInsRepository } from "../interfaces/instructorInterfaces.js";


export interface ISkills {
    uniqueSkills: string[] | null;
}

export interface IInsRepository {
    findByEmail(email: string): Promise<IInstructor | null>

    create(instructor: { name: string; email: string; password: string }): Promise<IInstructor | null>

    findById(id: string): Promise<IInstructor | null>

    updateProfile(id: string, data: Partial<IInstructor>): Promise<IInstructor | null>

    updatePassword(id: string, newPassword: string): Promise<IInstructor | null>

    kycSubmit(id: string, idProof: string, addressProof: string): Promise<IKyc | null>

    changePassword(id: string, password: string): Promise<IInstructor | null>



    addCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null>

    getCourses(id: string, skip: number, limit: number): Promise<ICourse[] | null>

    getCourseDetails(courseId: string): Promise<ICourse | null>

    purchaseDetails(courseId: string): Promise<IPurchaseDetails[] | null>

    editCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null>

    countCourses(): Promise<number>;

    findSkills(): Promise<ISkills>;

    addEvent(id: string, name: string, data: Partial<IEvent>): Promise<IEvent>

    getMyEvents(id: string, search: string, page: string): Promise<IEventResult | null>

    getEvent(id: string): Promise<IEvent | null>

    updateEvent(id: string, data: any): Promise<IEvent | null>

    addQuiz(courseId: string, title: string, questions: any[]): Promise<IQuiz>

    getQuiz(courseId: string): Promise<IQuiz | null>

    getQuizByCourseId(courseId: string): Promise<IQuiz | null>

    editQuiz(id: string, data: Partial<IQuiz>): Promise<IQuiz>

    startEventById(id: string): Promise<IEvent | null>

    endEventById(id: string): Promise<IEvent | null>


}



export class InstructorRepository implements IInsRepository {
    async findByEmail(email: string): Promise<IInstructor | null> {
        const user = await InstructorModel.findOne({ email })
        return user
    }


    async create(instructor: { name: string; email: string; password: string }): Promise<IInstructor> {
        return await InstructorModel.create(instructor);
    }


    async findById(id: string): Promise<IInstructor | null> {
        return await InstructorModel.findById(id);
    }

    async updateProfile(id: string, data: Partial<IInstructor>): Promise<IInstructor | null> {
        return await InstructorModel.findByIdAndUpdate(id, data, { new: true })
    }

    async updatePassword(id: string, newPassword: string): Promise<IInstructor | null> {
        return await InstructorModel.findByIdAndUpdate(id, { password: newPassword }, { new: true })
    }

    async kycSubmit(id: string, idProof: string, addressProof: string): Promise<IKyc | null> {
        await InstructorModel.findByIdAndUpdate(id, { KYCstatus: 'pending' }, { new: true })
        return await KycModel.create({ instructorId: id, idProof: idProof, addressProof: addressProof })
    }

    async changePassword(id: string, password: string): Promise<IInstructor | null> {

        return await InstructorModel.findByIdAndUpdate(id, { password: password })
    }


    async addCourse(id: string, data: Partial<ICourse>): Promise<ICourse | null> {
        return await CourseModel.create({ instructorId: id, ...data, });
    }


    async getCourses(id: string, skip: number, limit: number): Promise<ICourse[]> {
        const courses = await CourseModel.find({ instructorId: id }).skip(skip).limit(limit);
        // console.log(courses);
        return courses || [];
    }

    async getCourseDetails(courseId: string): Promise<ICourse | null> {
        const course = await CourseModel.findById(courseId)
        return course
    }



    async purchaseDetails(courseId: string): Promise<IPurchaseDetails[] | null> {
        const course = await CourseModel.findById(courseId).lean();
        if (!course) return null;

        // get all purchases for this course
        const purchases = await MyCourseModel.find({ courseId }).lean();
        if (!purchases || purchases.length === 0) return null;

        // fetch all userIds in one go
        const userIds = purchases.map(p => p.userId);
        const users = await UserModel.find({ _id: { $in: userIds } }).lean();

        // build a map for quick lookup
        const userMap = new Map(users.map(u => [String(u._id), u]));

        // map purchases to details
        const result: IPurchaseDetails[] = purchases.map(purchase => {
            const user = userMap.get(String(purchase.userId));
            if (!user) return

            return {
                name: user.name,
                title: course.title,
                ...(course.thumbnail && { thumbnail: course.thumbnail }),
                ...(course.price !== undefined && { price: course.price }),
                category: course.category,
                amountPaid: course.price ?? 0,
                paymentStatus: purchase.paymentStatus,
                createdAt: purchase.createdAt,
            };
        }).filter(Boolean) as IPurchaseDetails[];

        return result;
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

    async addEvent(id: string, name: string, data: Partial<IEvent>): Promise<IEvent> {
        return await EventModel.create({ instructorId: id, instructorName: name, ...data })
    }


    async getMyEvents(id: string, search: string, page: string): Promise<IEventResult | null> {
        const limit = 3;
        const skip = (parseInt(page) - 1) * limit;
        console.log(search);
        
        const query: any = { instructorId: id };

        if (search && search.trim() !== "") {
            query.title = { $regex: search, $options: "i" };
        }

        const events = await EventModel.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

            console.log(events);
            

        const total = await EventModel.countDocuments(query);

        return {
            events,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
        };
    }




    async getEvent(id: string): Promise<IEvent | null> {
        return EventModel.findById(id)
    }


    async updateEvent(id: string, data: Partial<IEvent>): Promise<IEvent | null> {
        return await EventModel.findByIdAndUpdate(id, { ...data })
    }


    async addQuiz(courseId: string, title: string, questions: any[]): Promise<IQuiz> {
        return await QuizModel.create({ courseId, title, questions })
    }

    async getQuiz(courseId: string): Promise<IQuiz | null> {


        const quiz = await QuizModel.findById({ courseId: courseId })
        console.log(quiz);
        return quiz

    }

    async getQuizByCourseId(courseId: string): Promise<IQuiz | null> {
        return await QuizModel.findOne({ courseId })
    }


    async editQuiz(id: string, data: Partial<IQuiz>): Promise<IQuiz> {
        console.log(data);

        const updatedQuiz = await QuizModel.findByIdAndUpdate(

            id,
            { ...data },
            { new: true }
        );
        console.log('updated ', updatedQuiz);


        if (!updatedQuiz) {
            throw new Error("Quiz not found");
        }

        return updatedQuiz;
    }



    startEventById = async (id: string): Promise<IEvent | null> => {
        if (!Types.ObjectId.isValid(id)) return null;

        return EventModel.findByIdAndUpdate(
            id,
            { isLive: true },
            { new: true }
        ).exec();
    };

    endEventById = async (id: string): Promise<IEvent | null> => {
        if (!Types.ObjectId.isValid(id)) return null;

        return EventModel.findByIdAndUpdate(
            id,
            {
                isLive: false,
                participantsList: [],
                participants: 0,
            },
            { new: true }
        ).exec();
    };


}


