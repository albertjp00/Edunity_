import { NextFunction, Request, Response } from "express";

import { InstAuthRequest } from "../../middleware/authMiddleware";

import { uploadToS3 } from "../../utils/s3Upload";
import fs from 'fs'
import { generateSignedUrl } from "../../utils/getSignedUrl";
import { ICourse, IModule } from "../../models/course";
import { HttpStatus } from "../../enums/httpStatus.enums";
import { IInstCourseManageController, IInstCourseViewController, IInstQuizController } from "../../interfaces/instructorInterfaces";
import { IInstCourseService } from "../../interfacesServices.ts/instructorServiceInterface";
import { mapCourseDetailsToDTO, mapInstructorCourseToDTO } from "../../mapper/instructor.mapper";
import { StatusMessage } from "../../enums/statusMessage";
// import { CourseService } from "../../services/instructor/courseServices";


// interface MulterFiles {
//   [fieldname: string]: Express.Multer.File[];
// }


export class InstCourseController implements
  IInstCourseViewController,
  IInstCourseManageController,
  IInstQuizController {
  private _courseService: IInstCourseService;

  constructor(courseService: IInstCourseService) {
    // const repo = new InstructorRepository();
    this._courseService = courseService
  }

  myCourses = async (req: InstAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.instructor?.id;
      const search = (req.body.query as string) || "";
      const page = parseInt(req.body.page as string) || 1;

      const limit = 4;
      const data = await this._courseService.fetchCourses(id as string, search, page, limit);


      if (!data || !data.courses) {
        res.status(HttpStatus.OK).json({
          success: true,
          course: [],
          skills: [],
          totalPages: 0,
          currentPage: page,
        });
        return;
      }

      const mappedCourses = data.courses.map((course: ICourse) =>
        mapInstructorCourseToDTO(course)
      );

      // console.log(data);


      res.status(HttpStatus.OK).json({
        success: true,
        course: mappedCourses,
        skills: data.skills,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      });

    } catch (error) {
      console.error(error);
      next(error);
    }
  };


  courseDetails = async (req: InstAuthRequest, res: Response, next: NextFunction) => {
    try {
      // const id = req.instructor?.id
      const courseId = req.params.id!
      const result = await this._courseService.fetchCourseDetails(courseId)
      if (!result || !result.course) {
        res.status(404).json({ success: false, message:StatusMessage.COURSE_NOT_FOUND });
        return
      }
      // console.log("coursedetails", result?.course.modules);
      // console.log(result);
      const courseDTO = mapCourseDetailsToDTO(result.course);
      console.log(courseDTO);



      res.status(HttpStatus.OK).json({ success: true, course: courseDTO, quiz: result?.quizExists })
    } catch (error) {
      console.log(error);
      next(error)
    }
  }



  refreshVideoUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { key } = req.query; // frontend sends the key (filename)
      if (!key) {
        res.status(400).json({ success: false, message: StatusMessage.MISSING_KEY });
        return
      }

      const signedUrl = await generateSignedUrl(key as string);
      res.status(HttpStatus.OK).json({ success: true, url: signedUrl });
    } catch (error) {
      console.error("Error refreshing video URL:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: StatusMessage.ERROR_LINK });
      next(error)
    }
  };



  purchaseDetails = async (req: InstAuthRequest, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.id!;
      const data = await this._courseService.getPurchaseDetails(courseId);

      console.log(data);

      if (!data) {
        res.status(404).json({ success: false, message: StatusMessage.PURCHASE_NOT_FOUND });
        return
      }

      res.status(HttpStatus.OK).json({ success: true, details: data });
    } catch (error) {
      console.error(error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: StatusMessage.INTERNAL_SERVER_ERROR });
      next(error)
    }
  };

  editCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseId = req.params.id!;
      const files = Array.isArray(req.files) ? req.files : [];
      // console.log(" Edit Course:", courseId);
      // console.log(" Multer Files:", files);

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

      // console.log("✅ Final Course Data:", data);

      const result = await this._courseService.editCourseRequest(courseId, data);

      // console.log("edited dtooo --------",result );


      if (!result) {
        res.status(404).json({ success: false, message: StatusMessage.COURSE_NOT_FOUND });
        return;
      }

      res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      console.error("❌ Error editing course:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message:StatusMessage.INTERNAL_SERVER_ERROR });
      next(error)
    }
  };







  // interface MulterFiles {
  //   [fieldname: string]: Express.Multer.File[];
  // }






  addCourse = async (req: InstAuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = req.instructor?.id;
      console.log("Add Course", id, req.body, req.body.modules);
      console.log("Multer Files:", req.files);

      const files = Array.isArray(req.files) ? req.files : [];

      const moduleIndexes = req.body.modules.map((_: any, i: number) => i);

      const modules = [];

      for (const index of moduleIndexes) {
        const title = req.body.modules?.[index]?.title;
        const content = req.body.modules?.[index]?.content;

        const videoFile = files.find(
          (f) => f.fieldname === `modules[${index}][video]`
        );

        let videoUrl: string | undefined;

        if (videoFile) {
          const fileBuffer = fs.readFileSync(videoFile.path);
          videoUrl = await uploadToS3(
            fileBuffer,
            videoFile.originalname,
            videoFile.mimetype
          );
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
        accessType : req.body.accessType,
        modules,
        thumbnail: thumbnailFile ? thumbnailFile.filename : undefined,
      };

      console.log('final data to save to db', data);


      const result = await this._courseService.addCourseRequest(id as string, data);


      res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      console.error("❌ Error adding course:", error);
      res.status(500).json({ success: false, message: StatusMessage.ERROR_ADDING_COURSE });
      next(error)
    }
  };








  addQuiz = async (req: InstAuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { title, questions } = req.body;
      console.log('add quiz');


      if (!id || !title || !questions) {
        res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: StatusMessage.MISSING_FIELDS });
        return;
      }

      const quiz = await this._courseService.addQuiz(id, title, questions);
      console.log(quiz);


      res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      console.error("Error adding quiz:", error);

      const message =
        error instanceof Error ? error.message : StatusMessage.SOMETHING_WRONG;

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message });
      next(error)
    }

  };


  getQuiz = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('get Quiz');

      const { courseId } = req.params;
      console.log(courseId);


      const result = await this._courseService.getQuiz(courseId as string)

      if (!result) {
        res.json({ success: false, message: StatusMessage.QUIZ_NOT_FOUND });
        return;
      }

      const quiz = 'quiz'
      res.status(HttpStatus.OK).json({ success: true, quiz });
    } catch (error) {
      console.error("Error fetching quiz:", error);
      next(error)
    }
  }


  editQuiz = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('edit Quiz');

      const { quizId } = req.params;
      const data = req.body
      console.log("quizId", quizId, req.body);

      await this._courseService.updateQuiz(quizId as string, data)

      res.status(HttpStatus.OK).json({ success: true });
    } catch (error) {
      console.error("Error fetching quiz:", error);
      next(error)
    }
  }


}

