import { IUserRepository } from "../../interfaces/userInterfaces.js";
import { ICourse } from "../../models/course.js";
import { IInstructor } from "../../models/instructor.js";
import { IAdminRepository } from "../../repositories/adminRepositories.js";
import { IInsRepository, InstructorRepository } from "../../repositories/instructorRepository.js";
import {  UserRepository } from "../../repositories/userRepository.js";



export class AdminCourseService {
    constructor(private adminRepository: IAdminRepository,
        private instructorRepository: IInsRepository,
        private userRepository: IUserRepository
    ) { }

    getInstructorsRequest = async (id: string): Promise<IInstructor | null> => {
        try {
            const result = await this.instructorRepository.findById(id)
            return result
        } catch (error) {
            console.log(error);
            return null

        }
    }

    getCoursesRequest = async (page: number, limit: number) => {
        try {
            const skip = (page - 1) * limit;

            const courses = await this.userRepository.getCourses(page, limit);
            const totalCourses = await this.userRepository.countCourses();


            return {
                courses,
                totalPages: Math.ceil(totalCourses / limit),
                currentPage: page,
            };
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    getCourseDetailsRequest = async (courseId: string) => {
        try {
            const details = await this.adminRepository.getFullCourseDetails(courseId);
            return details;
        } catch (err) {
            console.error("Error fetching    course details:", err);
            throw err;
        }
    };

    getPurchaseDetails = async (search:string , page:number)=>{
        try {
            const data = await this.adminRepository.getPurchases(search , page)
            return data
        } catch (error) {
            console.log(error);
            
        }
    }




}