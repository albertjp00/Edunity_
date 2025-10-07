import { InsAuthController } from "../controllers/instructor/authController.js"
import  express  from "express"
import { InstCourseController } from "../controllers/instructor/courseController.js"
import { instAuthMiddleware } from "../middleware/authMiddleware.js"
import { InstProfileController } from "../controllers/instructor/profileController.js"
import multer from "multer"
import { EventController } from "../controllers/instructor/eventController.js"
import { MessageController } from "../controllers/messaage/messageController.js"
import path from "path"



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
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });


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

instructor.post('/forgotPassword',authController.forgotPassword)  
instructor.post('/otpVerify',authController.verifyOtpForgotPass) 
instructor.post('/resendOtpForgotPass',authController.resendOtpForgotPassword)
instructor.put('/resetPassword',authController.resetPassword)

instructor.get('/getCourse',instAuthMiddleware,courseController.myCourses)
instructor.get('/course/:id', instAuthMiddleware, courseController.courseDetails);
instructor.patch('/course/:id', instAuthMiddleware,upload.any(), courseController.editCourse);



instructor.post(
  "/course",
  instAuthMiddleware,
  upload.any(),
  courseController.addCourse
);



instructor.get('/purchaseDetails/:id',instAuthMiddleware , courseController.purchaseDetails)

instructor.post('/event',instAuthMiddleware ,eventController.createEvents)
instructor.get('/event',instAuthMiddleware ,eventController.getMyEvents)
instructor.get('/getEvent/:id',instAuthMiddleware ,eventController.getEvent)
instructor.patch('/event/:id',instAuthMiddleware ,eventController.editEvent)


instructor.patch('/joinEvent/:eventId',instAuthMiddleware , eventController.joinEvent)
// instructor.patch("/endEvent/:id",instAuthMiddleware , eventController.endSession)


instructor.get('/getMessagedStudents',instAuthMiddleware , messageController.getMessagedStudents)
instructor.get('/messages/:receiverId',instAuthMiddleware , messageController.getMessages)
instructor.post('/sendMessage/:receiverId',instAuthMiddleware ,upload.single("attachment"), messageController.sendInstructorMessage)




instructor.post('/addQuiz/:id',instAuthMiddleware , courseController.addQuiz)
instructor.get('/quiz/:courseId',instAuthMiddleware , courseController.getQuiz)
instructor.put('/quiz/:quizId',instAuthMiddleware , courseController.editQuiz)




export default instructor