import { ICourse } from "../models/course.js";
import { IEvent } from "../models/events.js";
import { IInstructor } from "../models/instructor.js";
import { IKyc } from "../models/kyc.js";
import { IMessage } from "../models/message.js";
import { IQuiz } from "../models/quiz.js";
import { ISkills } from "../repositories/instructorRepository.js";


export interface IInsRepository {
    findByEmail(email: string): Promise<IInstructor | null>

    create(instructor: { name: string; email: string; password: string }): Promise<IInstructor | null>

    findById(id: string): Promise<IInstructor | null>

    updateProfile(id: string, data: any): Promise<IInstructor | null>

    updatePassword(id: string, newPassword: string): Promise<IInstructor | null>

    kycSubmit(id: string, idProof: string, addressProof: string): Promise<IKyc | null>

    changePassword(id: string, password: string): Promise<IInstructor | null>

    addCourse(id: string, data: any): Promise<ICourse | null>

    getCourses(id: string, skip: number, limit: number): Promise<ICourse[] | null>

    getCourseDetails(courseId: string): Promise<ICourse | null>

    editCourse(id: string, data: any): Promise<ICourse | null>

    countCourses(): Promise<number>;

    findSkills(): Promise<ISkills>;

    addEvent(id: string, name: string, data: Partial<IEvent>): Promise<IEvent>

    getMyEvents(id: string): Promise<IEvent[] | null>

    getEvent(id: string): Promise<IEvent | null>

    updateEvent(id: string, data: any): Promise<IEvent | null>

    addQuiz(courseId: string, title: string, questions: any[]): Promise<IQuiz>

    getQuiz(courseId: string): Promise<IQuiz | null>

    getQuizByCourseId(courseId: string): Promise<IQuiz | null>

    editQuiz(id: string, data: any): Promise<IQuiz>

    startEventById(id: string): Promise<IEvent | null>

    endEventById(id: string): Promise<IEvent | null>


}






export interface IMyEventInterface{
    events:IEvent[] | null,
    instructor: IInstructor | null
}


export interface IChatInstructor {
    _id: string;
    name: string;
}


export interface IMessagedInstructor {
    instructor : IInstructor;
    lastMessage : IMessage
}




export interface IPurchaseDetails {
  name: string;          // from user
  title: string;         // from course
  thumbnail?: string;    // from course
  price?: number;        // from course
  category: string;      // from course
  amountPaid: number;    // from purchase
  paymentStatus: string; // from purchase
  createdAt: Date;       // from purchase
}

