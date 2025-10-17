import { IPurchaseDetails } from "../../interfaces/instructorInterfaces.js";
import { ICourse } from "../../models/course.js";
import { IInsRepository, InstructorRepository, ISkills } from "../../repositories/instructorRepository.js";
import { uploadVideoToS3 } from "../../utils/s3Upload.js";

// Define what a single course looks like
interface ICourseDetails {
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
  quiz: boolean
}

// Define the structure for paginated results
interface CourseResult {
  courses: ICourse[] | null;
  skills: ISkills;
  totalPages: number;
  currentPage: number;
  totalItems: number;
  instructor: any
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
      const instructor = await this.instructorRepository.findById(id)

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
      console.log('service get course details', courseId);

      const course = await this.instructorRepository.getCourseDetails(courseId)
      // console.log(course);

      const quiz = await this.instructorRepository.getQuizByCourseId(courseId)
      let quizExists = false
      if (quiz) {
        quizExists = true
      }


      return { course, quizExists }

    } catch (error) {
      console.log(error);
      return null
    }
  }


  getPurchaseDetails = async (id:string):Promise<IPurchaseDetails[] | null>=>{
    try {
      const details = await this.instructorRepository.purchaseDetails(id)
      
      
      return details
    } catch (error) {
      console.log(error);
      return null
    }
  }

  // addCourseRequest = async (id: string, data: any): Promise<boolean> => {
  //   try {
  //     // data.category = data.trim().toLowerCase();

  //     const create = await this.instructorRepository.addCourse(id, data)
  //     return true
  //   } catch (error) {
  //     console.log(error);
  //     return false
  //   }
  // }


  addCourseRequest = async (id: string, data: any) => {
    try {
      const { title, description, modules } = data;

      // Upload videos only
      for (const module of modules) {
        if (module.video && module.video.path) {
          const videoUrl = await uploadVideoToS3(module.video);
          module.videoUrl = videoUrl; // replace local file info with S3 URL
          delete module.video; // remove the file reference
        }
      }
      console.log("service add course data",data);
    
      const create = await this.instructorRepository.addCourse(id, data)
  

      // await newCourse.save();
      return true;
    } catch (error) {
      console.error("Add Course Error:", error);
      throw error;
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

  async updateQuiz (id: string, data: any){
    try {
      const update = await this.instructorRepository.editQuiz(id , data)
      return update
    } catch (error) {
      console.log(error);

    }
  }


}
