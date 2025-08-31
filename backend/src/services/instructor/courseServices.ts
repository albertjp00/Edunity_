import { ICourse } from "../../models/course.js";
import { IInsRepository, InstructorRepository, ISkills } from "../../repositories/instructorRepository.js";

// Define what a single course looks like
interface Course {
  _id: string;
  instructorId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  skills?: string[];
  level?: string;
  modules?: {
    title?: string;
    videoUrl?: string;
    content?: string;
  }[];
  createdAt: Date;
  totalEnrolled: number;
}

// Define the structure for paginated results
interface CourseResult {
  courses: ICourse[] | null;
  skills: ISkills;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

interface CourseDetails {
  course: ICourse | null;
}

export class CourseService {
  constructor(private instructorRepository: IInsRepository) { }

  fetchCourses = async (id: string, page: number, limit: number): Promise<CourseResult> => {
    try {
      const skip = (page - 1) * limit;

      const [courses, totalItems, skills] = await Promise.all([
        this.instructorRepository.getCourses(id, skip, limit),
        this.instructorRepository.countCourses(),
        this.instructorRepository.findSkills()
      ]);

      return {
        courses,
        skills,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        totalItems
      };
    } catch (error) {
      console.log(error);
      throw error
    }
  };




  fetchCourseDetails = async (courseId: string): Promise<ICourse | null> => {
    try {
      console.log('service get course details', courseId);

      const course = await this.instructorRepository.getCourseDetails(courseId)
      // console.log(course);


      return course

    } catch (error) {
      console.log(error);
      return null
    }
  }

  addCourseRequest = async (id:string , data : any):Promise<boolean> =>{
    try {
      const create = await this.instructorRepository.addCourse(id , data)
      return true
    } catch (error) {
      console.log(error);
      return false
    }
  }

  editCourseRequest = async (id: string, data: Partial<ICourse>): Promise<ICourse | null> => {
    try {
      console.log(data);
      
      return await this.instructorRepository.editCourse(id, data);
    } catch (error) {
      console.log(error);
      return null;
    }
  };

}
