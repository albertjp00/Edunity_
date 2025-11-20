import { Request, Response } from "express";
import { CourseService } from "../../services/instructor/courseServices";

import { InstAuthRequest } from "../../middleware/authMiddleware";

import logger from "../../utils/logger";
import { uploadToS3 } from "../../utils/s3Upload";
import fs from 'fs'
import { generateSignedUrl } from "../../utils/getSignedUrl";
import { IModule } from "../../models/course";
import { HttpStatus } from "../../enums/httpStatus.enums";
import { IInstCourseManageController, IInstCourseViewController, IInstQuizController } from "../../interfaces/instructorInterfaces";

// interface MulterFiles {
//   [fieldname: string]: Express.Multer.File[];
// }



export class InstCourseController implements
    IInstCourseViewController,
    IInstCourseManageController,
    IInstQuizController {
  private _courseService: CourseService;

  constructor(courseService: CourseService) {
    // const repo = new InstructorRepository();
    this._courseService = courseService
  }

  myCourses = async (req: InstAuthRequest, res: Response) => {
    try {
      const id = req.instructor?.id
      logger.info("get Courses instructor");


      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const data = await this._courseService.fetchCourses(id as string, page, limit);

      res.status(HttpStatus.OK).json({
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

  courseDetails = async (req: InstAuthRequest, res: Response) => {
    try {
      // const id = req.instructor?.id
      const courseId = req.params.id!
      const result = await this._courseService.fetchCourseDetails(courseId)
      console.log("course", result?.course.modules);

      res.status(HttpStatus.OK).json({ success: true, course: result, quiz: result?.quizExists })
    } catch (error) {
      console.log(error);
    }
  }



  refreshVideoUrl = async (req: Request, res: Response) => {
    try {
      const { key } = req.query; // frontend sends the key (filename)
      if (!key) {
        res.status(400).json({ success: false, message: "Missing key" });
        return
      }

      const signedUrl = await generateSignedUrl(key as string);
      res.status(HttpStatus.OK).json({ success: true, url: signedUrl });
    } catch (error) {
      console.error("Error refreshing video URL:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Error generating URL" });
    }
  };



  purchaseDetails = async (req: InstAuthRequest, res: Response) => {
    try {
      const courseId = req.params.id!;
      const data = await this._courseService.getPurchaseDetails(courseId);

      console.log(data);

      if (!data) {
        res.status(404).json({ success: false, message: "No purchases found" });
        return
      }

      res.status(HttpStatus.OK).json({ success: true, details: data });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Server error" });
    }
  };

  editCourse = async (req: Request, res: Response): Promise<void> => {
    try {
      const courseId = req.params.id!;
      const files = Array.isArray(req.files) ? req.files : [];
      console.log("📦 Edit Course:", courseId);
      console.log("🗂️ Multer Files:", files);

      const skills =
        typeof req.body.skills === "string"
          ? JSON.parse(req.body.skills || "[]")
          : req.body.skills || [];

      const modules =
        typeof req.body.modules === "string"
          ? JSON.parse(req.body.modules || "[]")
          : req.body.modules || [];

      const updatedModules: IModule[] = [];
      for (let index = 0; index < modules.length; index++) {
        const mod = modules[index];
        const videoFile = files.find(
          (f) => f.fieldname === `modules[${index}][video]`
        );

        let videoUrl = mod.videoUrl || "";

        if (videoFile) {
          const fileBuffer = fs.readFileSync(videoFile.path);

          videoUrl = await uploadToS3(fileBuffer, videoFile.originalname, videoFile.mimetype);
          console.log(`✅ Uploaded video for module ${index}: ${videoUrl}`);
        }

        updatedModules.push({
          ...mod,
          videoUrl,
        });
      }

      const thumbnailFile = files.find((f) => f.fieldname === "thumbnail");

      const data = {
        title: req.body.title,
        description: req.body.description,
        skills,
        price: Number(req.body.price),
        level: req.body.level,
        category: req.body.category,
        modules: updatedModules,
        thumbnail: thumbnailFile ? thumbnailFile.filename : req.body.thumbnail,
      };

      console.log("✅ Final Course Data:", data);

      const result = await this._courseService.editCourseRequest(courseId, data);

      if (!result) {
        res.status(404).json({ success: false, message: "Course not found" });
        return;
      }

      res.status(HttpStatus.OK).json({ success: true, course: result });
    } catch (error) {
      console.error("❌ Error editing course:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
    }
  };







  // interface MulterFiles {
  //   [fieldname: string]: Express.Multer.File[];
  // }






  addCourse = async (req: InstAuthRequest, res: Response): Promise<void> => {
    try {
      const id = req.instructor?.id;
      console.log("Add Course", id, req.body);
      console.log("Multer Files:", req.files);

      const files = Array.isArray(req.files) ? req.files : [];

      const moduleIndexes = new Set(
        [
          ...Object.keys(req.body).map((k) => k.match(/modules\[(\d+)\]/)?.[1]),
          ...files.map((f) => f.fieldname.match(/modules\[(\d+)\]/)?.[1]),
        ].filter(Boolean)
      );

      const modules = [];


      for (const index of moduleIndexes) {
        const title = req.body[`modules[${index}][title]`];
        const content = req.body[`modules[${index}][content]`];

        const videoFile = files.find((f) => f.fieldname === `modules[${index}][video]`);

        let videoUrl: string | undefined;

        if (videoFile) {
          const fileBuffer = fs.readFileSync(videoFile.path);

          // Upload to AWS S3
          videoUrl = await uploadToS3(fileBuffer, videoFile.originalname, videoFile.mimetype);
          console.log(`✅ Uploaded video for module ${index}: ${videoUrl}`);
        }

        modules.push({
          title,
          content,
          videoUrl,
        });
      }

      // ✅ Handle thumbnail (stored locally)
      const thumbnailFile = files.find((f) => f.fieldname === "thumbnail");

      const data = {
        title: req.body.title,
        description: req.body.description,
        skills: JSON.parse(req.body.skills || "[]"),
        price: Number(req.body.price),
        level: req.body.level,
        category: req.body.category,
        modules,
        thumbnail: thumbnailFile ? thumbnailFile.filename : undefined,
      };

      // ✅ Save course data to DB (no need to re-upload videos in service)
      const result = await this._courseService.addCourseRequest(id as string, data);

      res.status(HttpStatus.OK).json({ success: !!result, course: result });
    } catch (error) {
      console.error("❌ Error adding course:", error);
      res.status(500).json({ success: false, message: "Error adding course" });
    }
  };








  addQuiz = async (req: InstAuthRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { title, questions } = req.body;
      console.log('add quiz');


      if (!id || !title || !questions) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: "Missing required fields" });
        return;
      }

      const quiz = await this._courseService.addQuiz(id, title, questions);
      console.log(quiz);


      res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      console.error("Error adding quiz:", error);

      const message =
        error instanceof Error ? error.message : "Something went wrong";

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
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
      res.status(HttpStatus.OK).json({ success: true, quiz });
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  }

  editQuiz = async (req: Request, res: Response) => {
    try {
      console.log('edit Quiz');

      const { quizId } = req.params;
      const data = req.body
      console.log("quizId", quizId, req.body);

      await this._courseService.updateQuiz(quizId as string, data)

      res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  }


}
