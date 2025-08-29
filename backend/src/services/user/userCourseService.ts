import { ICourse } from '../../models/course.js';
import { IInstructor } from '../../models/instructor.js';
import { IMyCourse } from '../../models/myCourses.js';
import { IUser } from '../../models/user.js';
import { AdminRepository } from '../../repositories/adminRepositories.js';
import { InstructorRepository } from '../../repositories/instructorRepository.js';
import { UserRepository } from '../../repositories/userRepository.js';


export interface ICourseDetails extends ICourse {
  instructor: IInstructor | null;
  hasAccess: boolean;
  completedModules: string[];
}



export class UserCourseService {
  private userRepository: UserRepository;
  private instructorRepository: InstructorRepository;
  private adminRepository: AdminRepository;

  constructor(userRepository: UserRepository, instructorRepository: InstructorRepository , adminRepository : AdminRepository) {
    this.userRepository = userRepository;
    this.instructorRepository = instructorRepository;
    this.adminRepository = adminRepository

  }

  async getCourses(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const courses = await this.userRepository.getCourses(skip, limit);
    const totalCourses = await this.userRepository.countCourses();
    const skills = await this.userRepository.findSkills();

    return {
      courses,
      skills,
      totalPages: Math.ceil(totalCourses / limit),
      currentPage: page,
    };
  }

  fetchCourseDetails = async (userId: string, courseId: string): Promise<ICourseDetails | null> => {
    try {
      console.log("service get course details");
      let hasAccess = false
      const course: any = await this.userRepository.getCourse(courseId);
      const myCourse = await this.userRepository.getCourseDetails(userId, courseId);
      console.log('myCoursessss', myCourse);

      if (myCourse) {
        hasAccess = true
      }

      const instructor = await this.instructorRepository.findById(course.instructorId);

      return {
        ...(course.toObject?.() || course),
        instructor,
        hasAccess,
        completedModules: myCourse?.progress?.completedModules || []
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  buyCourseService = async (userId: string, courseId: any): Promise<boolean> => {
    try {

      const course = await this.userRepository.getCourse(courseId)
      const data = course
      const myCourse = await this.userRepository.addMyCourse(userId, data);
      return !myCourse;
    } catch (error) {
      console.error(error);
      return false;
    }
  };


  myCoursesRequest = async (id: string): Promise<IMyCourse[] | null> => {
    try {


      const myCourses = await this.userRepository.findMyCourses(id)

      return myCourses

    } catch (error) {
      console.log(error);
      return null
    }
  }

  viewMyCourseRequest = async (id: string, myCourseId: string): Promise<IMyCourse | null> => {
    try {


      const myCourse = await this.userRepository.viewMyCourse(id, myCourseId)
      // const progress = await this.userRepository.getProgress(id)

      return myCourse

    } catch (error) {
      console.log(error);
      return null
    }
  }

  async updateProgress(userId: string, courseId: string, moduleTitle: string) {

   try {
     const update = await this.userRepository.updateProgress(userId , courseId , moduleTitle)
    
    return update
   } catch (error) {
    console.log(error);
    
   }
  }


  async getInstructorsRequest():Promise<IInstructor[] | null> {

   try {
     const update = await this.adminRepository.findInstructors()
    
    return update
   } catch (error) {
    console.log(error);
    return null
   }
  }



}
