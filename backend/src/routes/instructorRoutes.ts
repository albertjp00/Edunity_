import { InsAuthController } from "../controllers/instructor/authController.js"
import  express  from "express"
import { InstCourseController } from "../controllers/instructor/courseController.js"
import { instAuthMiddleware } from "../middleware/authMiddleware.js"
import { InstProfileController } from "../controllers/instructor/profileController.js"



const authController =new InsAuthController()
const courseController = new InstCourseController
const profileController = new InstProfileController

const instructor = express.Router()


instructor.post('/login',authController.login)
instructor.get('/getCourse',instAuthMiddleware,courseController.myCourses)
instructor.get('/profile',instAuthMiddleware,profileController.getProfile)
instructor.put('/profile',instAuthMiddleware,profileController.editProfile)


export default instructor