import { InstAuthController } from "../controllers/instructor/authController.js"
import  express  from "express"
import { InstCourseController } from "../controllers/instructor/courseController.js"
import { instAuthMiddleware } from "../middleware/authMiddleware.js"
import { InstProfileController } from "../controllers/instructor/profileController.js"
import multer from "multer"
import { EventController } from "../controllers/instructor/eventController.js"
import { MessageController } from "../controllers/messaage/messageController.js"
import path from "path"
import { MessageRepository } from "../repositories/messageRepositories.js"
import { MessageService } from "../services/message/messageService.js"
import { InstructorRepository } from "../repositories/instructorRepository.js"
import { InstAuthService } from "../services/instructor/authService.js"
import { CourseService } from "../services/instructor/courseServices.js"
import { InstructorProfileService } from "../services/instructor/profileServices.js"
import { InstEventService } from "../services/instructor/eventService.js"



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Different folders for videos and thumbnails (recommended)
    if (file.fieldname === "thumbnail") {
      cb(null, "src/assets");
    } else if (file.fieldname.startsWith("modules")) {
      cb(null, "src/assets");
    } else {
      cb(null, "src/assets");
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  },
});


export const upload = multer({ storage });


const instRepo =  new InstructorRepository() 


const instService = new InstAuthService(instRepo)
const authController =new InstAuthController(instService)


const courseService = new CourseService(instRepo)
const courseController = new InstCourseController(courseService)


const profileService = new InstructorProfileService(instRepo)
const profileController = new InstProfileController(profileService)



const eventService = new InstEventService(instRepo)
const eventController = new EventController(eventService)



const messageRepo = new MessageRepository()
const messageService = new MessageService(messageRepo)
const messageController = new MessageController(messageService)

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

instructor.get('/dashboard',instAuthMiddleware,profileController.getDashboardData)
instructor.get('/earnings',instAuthMiddleware,profileController.getEarnings)

instructor.get('/notifications',instAuthMiddleware,profileController.getNotifications)

instructor.post('/forgotPassword',authController.forgotPassword)  
instructor.post('/otpVerify',authController.verifyOtpForgotPass) 
instructor.post('/resendOtpForgotPass',authController.resendOtpForgotPassword)
instructor.put('/resetPassword',authController.resetPassword)

instructor.get('/wallet',instAuthMiddleware,profileController.getWallet)


instructor.get('/getCourse',instAuthMiddleware,courseController.myCourses)
instructor.get('/course/:id', instAuthMiddleware, courseController.courseDetails);
instructor.get("/videos/refresh",instAuthMiddleware, courseController.refreshVideoUrl);

instructor.patch('/course/:id', instAuthMiddleware,upload.any(), courseController.editCourse);

instructor.post("/course",instAuthMiddleware,upload.any(),courseController.addCourse);


instructor.get('/purchaseDetails/:id',instAuthMiddleware , courseController.purchaseDetails)



instructor.post('/event',instAuthMiddleware ,eventController.createEvents)
instructor.get('/event',instAuthMiddleware ,eventController.getAllEvents)
instructor.get('/getEvent/:id',instAuthMiddleware ,eventController.getEvent)
instructor.patch('/event/:id',instAuthMiddleware ,eventController.editEvent)
instructor.get('/allEvents',instAuthMiddleware ,eventController.getAllEvents)


instructor.patch('/joinEvent/:eventId',instAuthMiddleware , eventController.joinEvent)
// instructor.patch("/endEvent/:id",instAuthMiddleware , eventController.endSession)


instructor.get('/getMessagedStudents',instAuthMiddleware , messageController.getMessagedStudents)
instructor.get('/messages/:receiverId',instAuthMiddleware , messageController.getMessages)
instructor.post('/sendMessage/:receiverId',instAuthMiddleware ,upload.single("attachment"), messageController.sendInstructorMessage)




instructor.post('/addQuiz/:id',instAuthMiddleware , courseController.addQuiz)
instructor.get('/quiz/:courseId',instAuthMiddleware , courseController.getQuiz)
instructor.put('/quiz/:quizId',instAuthMiddleware , courseController.editQuiz)




export default instructor