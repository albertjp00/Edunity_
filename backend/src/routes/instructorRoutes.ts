import { InsAuthController } from "../controllers/instructor/authController.js"
import  express  from "express"
import { InstCourseController } from "../controllers/instructor/courseController.js"
import { instAuthMiddleware } from "../middleware/authMiddleware.js"
import { InstProfileController } from "../controllers/instructor/profileController.js"
import multer from "multer"


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,'src/assets');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

const authController =new InsAuthController()
const courseController = new InstCourseController
const profileController = new InstProfileController

const instructor = express.Router()


instructor.post('/login',authController.login)
instructor.get('/getCourse',instAuthMiddleware,courseController.myCourses)
instructor.get('/profile',instAuthMiddleware,profileController.getProfile)
instructor.put('/profile',instAuthMiddleware,upload.single("profileImage"),profileController.editProfile)
instructor.put('/passwordChange',instAuthMiddleware,profileController.changePassword)
instructor.get('/courseDetails/:id', instAuthMiddleware, courseController.courseDetails);
instructor.put('/editCourse/:id', instAuthMiddleware,upload.single("thumbnail"), courseController.editCourse);
instructor.post('/addCourse',instAuthMiddleware,upload.single('thumbnail'),courseController.addCourse) 



export default instructor