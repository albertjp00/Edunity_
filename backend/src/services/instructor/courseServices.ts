import { ICourse } from "../../models/course.js";
import { IInsRepository, ISkills } from "../../repositories/instructorRepository.js";

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
  skills : ISkills;
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export class CourseService {
  constructor(private instructorRepository: IInsRepository) {}

  fetchCourses = async (id:string , page: number, limit: number): Promise<CourseResult> => {
    const skip = (page - 1) * limit;

    const [courses, totalItems , skills] = await Promise.all([
      this.instructorRepository.getCourses(id,skip, limit),
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
  };
}
