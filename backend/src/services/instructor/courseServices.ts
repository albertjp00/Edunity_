import { QuizDTO } from "../../dto/instructorDTO";
import {
  CourseResult,
  IPurchaseDetails,
} from "../../interfaces/instructorInterfaces";
import {
  IInsRepository,
  IInstCourseService,
} from "../../interfacesServices.ts/instructorServiceInterface";
import {
  mapCourseDetailsToDTO,
  mapInstructorCourseToDTO,
  mapPurchaseDetailsToDTO,
  mapQuizToDTO,
} from "../../mapper/instructor.mapper";
import { ICategory } from "../../models/category";
import { ICourse } from "../../models/course";
import { IQuestion, IQuiz } from "../../models/quiz";
import { generateSignedUrl } from "../../utils/getSignedUrl";

export class CourseService implements IInstCourseService {
  constructor(private instructorRepository: IInsRepository) {}

  fetchCourses = async (
    id: string,
    search: string,
    page: number,
    limit: number,
  ): Promise<CourseResult> => {
    try {
      const skip = (page - 1) * limit;

      const [courses, totalItems] = await Promise.all([
        this.instructorRepository.getCourses(id, search, skip, limit),
        this.instructorRepository.countCourses(id),
        this.instructorRepository.findSkills(),
      ]);
      const instructor = await this.instructorRepository.findById(id);

      return {
        courses: courses?.map(mapInstructorCourseToDTO) ?? [],
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        totalItems,
        instructor,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  fetchCourseDetails = async (courseId: string) => {
    try {
      const course = await this.instructorRepository.getCourseDetails(courseId);
      if (!course) return null;
      
      

      if (course.modules && course.modules.length > 0) {
        for (const module of course.modules) {
          const rawUrl = module.videoUrl;

          if (rawUrl) {
            let key: string | undefined;

            if (rawUrl.includes(".amazonaws.com/")) {
              const parts = rawUrl.split(".amazonaws.com/");
              key = parts[1]?.split("?")[0];
            } else {
              key = rawUrl.split("?")[0];
            }
            console.log("key", key);

            if (key) {
              module.videoUrl = await generateSignedUrl(key);
            }
          }
        }
      }

      const quiz = await this.instructorRepository.getQuizByCourseId(courseId);
      const quizExists = !!quiz;

      
      return { course: mapCourseDetailsToDTO(course), quizExists };
    } catch (error) {
      console.error("❌ Error fetching course details:", error);
      return null;
    }
  };

  getPurchaseDetails = async (
    id: string,
  ): Promise<IPurchaseDetails[] | null> => {
    try {
      const details = await this.instructorRepository.purchaseDetails(id);
      if (!details) return null;

      return details?.map(mapPurchaseDetailsToDTO);
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  addCourseRequest = async (id: string, data: Partial<ICourse>) => {
    try {
      const course = await this.instructorRepository.addCourse(id, data);
      return course;
    } catch (error) {
      console.error("Add Course Error:", error);
      throw error;
    }
  };

  editCourseRequest = async (
    id: string,
    data: Partial<ICourse>,
  ): Promise<ICourse | null> => {
    try {
      return await this.instructorRepository.editCourse(id, data);
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  async addQuiz(courseId: string, title: string, questions: IQuestion[]) {
    try {
      await this.instructorRepository.addQuiz(courseId, title, questions);
    } catch (error) {
      throw new Error("Error while adding quiz: " + (error as Error).message);
    }
  }

  async getQuiz(courseId: string): Promise<QuizDTO | null> {
    try {
      const quiz = await this.instructorRepository.getQuizByCourseId(courseId);
      if (!quiz) return null;
      return mapQuizToDTO(quiz);
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateQuiz(id: string, data: Partial<IQuiz>) {
    try {
      await this.instructorRepository.editQuiz(id, data);
    } catch (error) {
      console.log(error);
    }
  }

  async getCategoryRequest(): Promise<ICategory[] | null> {
    try {
      const category = await this.instructorRepository.getCategory();
      console.log("category edit", category);

      return category;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
