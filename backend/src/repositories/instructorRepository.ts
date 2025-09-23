import { Types } from "mongoose";
import { CourseModel, ICourse } from "../models/course.js";
import { EventModel, IEvent } from "../models/events.js";
import { IInstructor, InstructorModel } from "../models/instructor.js";
import { IKyc, KycModel } from "../models/kyc.js";
import { IMyCourse, MyCourseModel } from "../models/myCourses.js";
import { IQuiz, QuizModel } from "../models/quiz.js";
import { IInsRepository } from "../interfaces/instructorInterfaces.js";


export interface ISkills {
    uniqueSkills: string[] | null;
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

      async changePassword(id: string, password: string): Promise<IInstructor | null> {
    
        return await InstructorModel.findByIdAndUpdate(id, { password: password })
      }

    async addCourse(id: string, data: any): Promise<ICourse | null> {
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

    async getMyEvents(id: string): Promise<IEvent[] | null> {
        return await EventModel.find({ instructorId: id })
    }

    async getEvent(id: string): Promise<IEvent | null> {
        return EventModel.findById(id)
    }


    async updateEvent(id: string, data: any): Promise<IEvent | null> {
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


    async editQuiz(id: string, data: any): Promise<IQuiz> {
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


