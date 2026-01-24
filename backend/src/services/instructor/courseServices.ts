import { IPurchaseDetails } from "../../interfaces/instructorInterfaces";
import { IInstCourseService } from "../../interfacesServices.ts/instructorServiceInterface";
import { ICategory } from "../../models/category";
import { ICourse } from "../../models/course";
import { IInsRepository,  ISkills } from "../../repositories/instructorRepository";
import { generateSignedUrl } from "../../utils/getSignedUrl";




// Define the structure for paginated results
interface CourseResult {
  courses: ICourse[] | null;
  skills: ISkills;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  instructor: any
}



export class CourseService implements IInstCourseService {
  constructor(private instructorRepository: IInsRepository) { }

  fetchCourses = async (id: string, search: string, page: number, limit: number): Promise<CourseResult> => {
    try {
      const skip = (page - 1) * limit;

      const [courses, totalItems, skills] = await Promise.all([
        this.instructorRepository.getCourses(id, search, skip, limit),
        this.instructorRepository.countCourses(id),
        this.instructorRepository.findSkills()
      ]);
      const instructor = await this.instructorRepository.findById(id)
      const l = courses?.length

      console.log('my courses ', l , totalItems);
      
      return {
        courses,
        skills,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        totalItems,
        instructor
      };
    } catch (error) {
      console.log(error);
      throw error
    }
  };





  fetchCourseDetails = async (courseId: string) => {
    try {
      console.log("service get course details", courseId);

      const course = await this.instructorRepository.getCourseDetails(courseId);
      if (!course) return null;

      // Generate signed URLs for private videos
      if (course.modules && course.modules.length > 0) {
        for (const module of course.modules) {
          const rawUrl = module.videoUrl;

          if (rawUrl) {
            // Extract key safely and remove query params
            let key: string | undefined;

            if (rawUrl.includes(".amazonaws.com/")) {
              const parts = rawUrl.split(".amazonaws.com/");
              key = parts[1]?.split("?")[0]; // safely access
            } else {
              key = rawUrl.split("?")[0]; // fallback for direct key
            }
            console.log("key", key);

            if (key) {
              module.videoUrl = await generateSignedUrl(key);
            }
          }
        }
      }

      // console.log('course in service',course.modules);

      const quiz = await this.instructorRepository.getQuizByCourseId(courseId);
      const quizExists = !!quiz;

      return { course, quizExists };
    } catch (error) {
      console.error("❌ Error fetching course details:", error);
      return null;
    }
  };




  getPurchaseDetails = async (id: string): Promise<IPurchaseDetails[] | null> => {
    try {
      const details = await this.instructorRepository.purchaseDetails(id)
      console.log("purchaase",details);
      

      return details
    } catch (error) {
      console.log(error);
      return null
    }
  }




  addCourseRequest = async (id: string, data: any) => {
    try {
      console.log("service add course data", data);

      const instructor = await this.instructorRepository.findById(id)
      const limit = instructor?.courseLimit!


      const course = await this.instructorRepository.addCourse(id, data)

      

      return course
      
    } catch (error) {
      console.error("Add Course Error:", error);
      throw error;
    }
  };



  editCourseRequest = async (id: string, data: Partial<ICourse>): Promise<ICourse | null> => {
    try {
      // console.log(data);

      return await this.instructorRepository.editCourse(id, data);
    } catch (error) {
      console.log(error);
      return null;

    }
  };


  async addQuiz(courseId: string, title: string, questions: any[]) {
    try {
      const quiz = await this.instructorRepository.addQuiz(courseId, title, questions);
      return quiz;
    } catch (error) {
      throw new Error("Error while adding quiz: " + (error as Error).message);
    }
  }

  async getQuiz(courseId: string) {
    try {
      const quiz = await this.instructorRepository.getQuizByCourseId(courseId)
      console.log(quiz);

      return quiz
    } catch (error) {
      console.log(error);

    }
  }

  async updateQuiz(id: string, data: any) {
    try {
      const update = await this.instructorRepository.editQuiz(id, data)
      return update
    } catch (error) {
      console.log(error);

    }
  }

  async getCategoryRequest(): Promise<ICategory[] | null> {
    try {
      const category = await this.instructorRepository.getCategory()
      return category
    } catch (error) {
      console.log(error);
      return null
    }
  }


}
