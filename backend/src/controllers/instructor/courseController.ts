import { Request, Response } from "express";
import { CourseService } from "../../services/instructor/courseServices.js";
import { InstructorRepository } from "../../repositories/instructorRepository.js";
import { InstAuthRequest } from "../../middleware/authMiddleware.js";
import instructor from "../../routes/instructorRoutes.js";

export class InstCourseController {
    private courseService: CourseService;

    constructor() {
        const repo = new InstructorRepository();
        this.courseService = new CourseService(repo);
    }

    myCourses = async (req: InstAuthRequest, res: Response): Promise<void> => {
        try {
            const id = req.instructor?.id
            console.log("get Courses user");


            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 6;

            const data = await this.courseService.fetchCourses(id, page, limit);

            res.json({
                success: true,
                course: data.courses,
                skills: data.skills,
                totalPages: data.totalPages,
                currentPage: data.currentPage,
                instructor:data.instructor
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: "Failed to get courses" });
        }
    };

    courseDetails = async( req:InstAuthRequest , res:Response):Promise<void> =>{
        try {
            const id = req.instructor?.id
            const courseId = req.params.id!
            const result = await this.courseService.fetchCourseDetails(courseId)
            // console.log("course" ,result);
            
            res.json({success:true , course:result})
        } catch (error) {
            console.log(error);
            
        }
    }

    editCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const courseId = req.params.id!;

    const data = {
      ...req.body,
      skills:JSON.parse(req.body.skills),
      modules: JSON.parse(req.body.modules),

    };
    data.thumbnail = req.file?.filename
    console.log(courseId , data);
    

    const result = await this.courseService.editCourseRequest(courseId, data);

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

    const result = await this.courseService.addCourseRequest(id, data);

    res.json({ success: !!result, course: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error adding course" });
  }
};


}
