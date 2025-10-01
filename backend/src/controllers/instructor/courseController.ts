import { Request, Response } from "express";
import { CourseService } from "../../services/instructor/courseServices.js";
import { InstructorRepository } from "../../repositories/instructorRepository.js";
import { AuthRequest, InstAuthRequest } from "../../middleware/authMiddleware.js";
import instructor from "../../routes/instructorRoutes.js";

export class InstCourseController {
  private _courseService: CourseService;

  constructor() {
    const repo = new InstructorRepository();
    this._courseService = new CourseService(repo);
  }

  myCourses = async (req: InstAuthRequest, res: Response): Promise<void> => {
    try {
      const id = req.instructor?.id
      console.log("get Courses user");


      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;

      const data = await this._courseService.fetchCourses(id, page, limit);

      res.json({
        success: true,
        course: data.courses,
        skills: data.skills,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        instructor: data.instructor
      });
    } catch (error) {
      console.error(error);

    }
  };

  courseDetails = async (req: InstAuthRequest, res: Response): Promise<void> => {
    try {
      const id = req.instructor?.id
      const courseId = req.params.id!
      const result = await this._courseService.fetchCourseDetails(courseId)
      console.log("course" ,result);


      res.json({ success: true, course: result ,quiz : result?.quizExists})
    } catch (error) {
      console.log(error);

    }
  }

purchaseDetails = async (req: InstAuthRequest, res: Response) => {
  try {
    const courseId = req.params.id!;
    const data = await this._courseService.getPurchaseDetails(courseId);

    console.log(data);
    
    if (!data) {
      return res.status(404).json({ success: false, message: "No purchases found" });
    }

    res.json({ success: true, details: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


  editCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const courseId = req.params.id!;

      const data = {
        ...req.body,
        skills: JSON.parse(req.body.skills),
        modules: JSON.parse(req.body.modules),

      };
      data.thumbnail = req.file?.filename
      console.log(courseId, data);


      const result = await this._courseService.editCourseRequest(courseId, data);

      if (!result) {
        res.status(404).json({ success: false, message: "Course not found" });
        return;
      }

      res.status(200).json({ success: true, course: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  };

  addCourse = async (req: InstAuthRequest, res: Response): Promise<void> => {
    try {
      const id = req.instructor?.id; // should be ObjectId from middleware
      console.log("add Course ", id, req.body, req.file);

      const data = {
        ...req.body,
        modules: JSON.parse(req.body.modules),
        skills: JSON.parse(req.body.skills),
        thumbnail: req.file ? req.file.filename : undefined,
      };

      const result = await this._courseService.addCourseRequest(id, data);

      res.json({ success: !!result, course: result });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Error adding course" });
    }
  };



addQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, questions } = req.body;
    console.log('add quiz');
    

    if (!id || !title || !questions) {
      res.status(400).json({ success: false, message: "Missing required fields" });
      return;
    }

    const quiz = await this._courseService.addQuiz(id, title, questions);
    console.log(quiz);
    

    res.json({ success: true });
  } catch (error: any) {
    console.error("Error adding quiz:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


 getQuiz = async (req: Request, res: Response) => {
    try {
      console.log('get Quiz');
      
      const { courseId } = req.params;
      console.log(courseId);
      
      
      const quiz = await this._courseService.getQuiz(courseId as string)

      if (!quiz) {
        res.json({ success: false, message: "Quiz not found" });
        return;
      }
      res.json({ success: true, quiz });
    } catch (error: any) {
      console.error("Error fetching quiz:", error);
    }
  }

  editQuiz = async (req: Request, res: Response) => {
    try {
      console.log('edit Quiz');
      
      const { quizId } = req.params;
      const data = req.body
      console.log("quizId",quizId,req.body);
      
      const quiz = await this._courseService.updateQuiz(quizId as string  , data)
    
      res.json({ success: true });
    } catch (error: any) {
      console.error("Error fetching quiz:", error);
    }
  }


}
