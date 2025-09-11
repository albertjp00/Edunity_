import { InsAuthController } from "../controllers/instructor/authController.js"
import  express  from "express"
import { InstCourseController } from "../controllers/instructor/courseController.js"
import { instAuthMiddleware } from "../middleware/authMiddleware.js"
import { InstProfileController } from "../controllers/instructor/profileController.js"
import multer from "multer"
import { EventController } from "../controllers/instructor/eventController.js"
import { MessageController } from "../controllers/messaage/messageController.js"


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

const authController =new InsAuthController
const courseController = new InstCourseController
const profileController = new InstProfileController
const eventController = new EventController
const messageController = new MessageController

const instructor = express.Router()


instructor.post('/login',authController.login)
instructor.post('/register',authController.register)
instructor.post("/resendOtp", authController.resendOtp);
instructor.post("/verifyOtp", authController.verifyOtp);
instructor.get('/profile',instAuthMiddleware,profileController.getProfile)
instructor.put('/profile',instAuthMiddleware,upload.single("profileImage"),profileController.editProfile)
instructor.put('/passwordChange',instAuthMiddleware,profileController.changePassword)
instructor.post('/kycSubmit' ,instAuthMiddleware ,
  upload.fields([
    { name: 'idProof', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 }
  ]),
  profileController.kycSubmit
);

instructor.get('/getCourse',instAuthMiddleware,courseController.myCourses)
instructor.get('/course/:id', instAuthMiddleware, courseController.courseDetails);
instructor.put('/course/:id', instAuthMiddleware,upload.single("thumbnail"), courseController.editCourse);
instructor.post('/course',instAuthMiddleware,upload.single('thumbnail'),courseController.addCourse) 

instructor.post('/event',instAuthMiddleware ,eventController.createEvents)
instructor.get('/event',instAuthMiddleware ,eventController.getMyEvents)
instructor.get('/getEvent/:id',instAuthMiddleware ,eventController.getEvent)
instructor.patch('/event/:id',instAuthMiddleware ,eventController.editEvent)

instructor.get('/getMessagedStudents',instAuthMiddleware , messageController.getMessagedStudents)



export default instructor