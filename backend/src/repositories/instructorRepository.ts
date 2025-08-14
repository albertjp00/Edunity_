import { IInstructor, InstructorModel } from "../models/instructor.js";



export interface IInsRepository{
    findByEmail(email:string) : Promise<IInstructor | null>
}


export class InstructorRepository implements IInsRepository{
    async findByEmail(email: string): Promise<IInstructor | null> {
         const user = await InstructorModel.findOne({email}) 
         return user
    }
}


