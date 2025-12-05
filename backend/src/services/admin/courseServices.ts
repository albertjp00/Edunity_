import { IAdminCourseService } from "../../interfaces/adminInterfaces";
import { IUserRepository } from "../../interfaces/userInterfaces";
import { ICourse } from "../../models/course";
import { IInstructor } from "../../models/instructor";
import { IAdminRepository } from "../../repositories/adminRepositories";
import { IInsRepository, InstructorRepository } from "../../repositories/instructorRepository";
import { UserRepository } from "../../repositories/userRepository";



export class AdminCourseService implements IAdminCourseService {
    constructor(
        private adminRepository: IAdminRepository,
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

    getCoursesRequest = async (page: number, search: string, limit: number) => {
        try {
            const skip = (page - 1) * limit;

            const query:any = {}

            if (search) {
                query.$or = [
                    { title: { $regex: search, $options: "i" } },
                    { instructorName: { $regex: search, $options: "i" } }
                ];
            }

            const courses = await this.userRepository.getAllCourses(query, skip, limit, { createdAt: -1 }) || [];
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




    getPurchaseDetails = async (search: string, page: number) => {
        try {
            
            const data = await this.adminRepository.getPurchases(search, page)
            
            console.log('getting purchase detaislssssssssssssssssss',data);

            return data
        } catch (error) {
            console.log(error);

        }
    }




}