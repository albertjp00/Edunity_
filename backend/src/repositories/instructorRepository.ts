import { CourseModel, ICourse } from "../models/course.js";
import { IInstructor, InstructorModel } from "../models/instructor.js";


export interface ISkills {
    uniqueSkills: string[] | null;
}


export interface IInsRepository {
    findByEmail(email: string): Promise<IInstructor | null>
    findById(id:string):Promise<IInstructor | null>
    updateProfile(id:string ,data:any):Promise<IInstructor | null>
    getCourses(id:string , skip: number, limit: number): Promise<ICourse[] | null>
    countCourses(): Promise<number>;
    findSkills():Promise<ISkills>;
}


export class InstructorRepository implements IInsRepository {
    async findByEmail(email: string): Promise<IInstructor | null> {
        const user = await InstructorModel.findOne({ email })
        return user
    }

    async findById(id: string): Promise<IInstructor | null> {
        return await InstructorModel.findById(id);
      }

    async  updateProfile(id:string , data:any):Promise<IInstructor | null>{
        return await CourseModel.findByIdAndUpdate(id,data,{new:true})
    }

    async getCourses(id :string ,skip: number, limit: number): Promise<ICourse[]> {
        const courses =  await CourseModel.find({instructorId : id}).skip(skip).limit(limit);
        console.log('courses ',courses);
        
         return courses || [];
    }

    async countCourses(): Promise<number> {
         return  await CourseModel.countDocuments();
       
    }

    async findSkills(): Promise<ISkills> {
        const result =  await CourseModel.aggregate([
            { $unwind: "$skills" },
            { $group: { _id: null, uniqueSkills: { $addToSet: "$skills" } } },
            { $project: { _id: 0, uniqueSkills: 1 } }
        ])

        return result[0]
    }
}


