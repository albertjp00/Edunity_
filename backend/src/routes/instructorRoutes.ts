import { InstAuthController } from "../controllers/instructor/authController"
import  express  from "express"
import { InstCourseController } from "../controllers/instructor/courseController"
import { instAuthMiddleware } from "../middleware/authMiddleware"
import { InstProfileController } from "../controllers/instructor/profileController"
import multer from "multer"
import { EventController } from "../controllers/instructor/eventController"
import { MessageController } from "../controllers/messaage/messageController"
import { MessageRepository } from "../repositories/messageRepositories"
import { MessageService } from "../services/message/messageService"
import { InstructorRepository } from "../repositories/instructorRepository"
import { InstAuthService } from "../services/instructor/authService"
import { CourseService } from "../services/instructor/courseServices"
import { InstructorProfileService } from "../services/instructor/profileServices"
import { InstEventService } from "../services/instructor/eventService"
import { INSTRUCTOR_ROUTES } from "../routesConstants.ts/instructorRoutesContstants"



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




instructor.post(INSTRUCTOR_ROUTES.AUTH.LOGIN, authController.login);
instructor.post(INSTRUCTOR_ROUTES.AUTH.REGISTER, authController.register);
instructor.post(INSTRUCTOR_ROUTES.AUTH.RESEND_OTP, authController.resendOtp);
instructor.post(INSTRUCTOR_ROUTES.AUTH.VERIFY_OTP, authController.verifyOtp);
instructor.post(INSTRUCTOR_ROUTES.AUTH.REFRESH, authController.refreshToken);


instructor.post(INSTRUCTOR_ROUTES.AUTH.FORGOT_PASSWORD, authController.forgotPassword);
instructor.post(INSTRUCTOR_ROUTES.AUTH.OTP_VERIFY_FORGOT, authController.verifyOtpForgotPass);
instructor.post(INSTRUCTOR_ROUTES.AUTH.RESEND_FORGOT_OTP, authController.resendOtpForgotPassword);
instructor.put(INSTRUCTOR_ROUTES.AUTH.RESET_PASSWORD, authController.resetPassword);

// Profile
instructor.get(INSTRUCTOR_ROUTES.PROFILE.GET, instAuthMiddleware, profileController.getProfile);
instructor.put(
  INSTRUCTOR_ROUTES.PROFILE.UPDATE,
  instAuthMiddleware,
  upload.single("profileImage"),
  profileController.editProfile
);
instructor.put(INSTRUCTOR_ROUTES.PROFILE.CHANGE_PASSWORD, instAuthMiddleware, profileController.changePassword);

instructor.post(
  INSTRUCTOR_ROUTES.PROFILE.KYC_SUBMIT,
  instAuthMiddleware,
  upload.fields([
    { name: "idProof", maxCount: 1 },
    { name: "addressProof", maxCount: 1 },
  ]),
  profileController.kycSubmit
);

instructor.get(INSTRUCTOR_ROUTES.PROFILE.DASHBOARD, instAuthMiddleware, profileController.getDashboardData);
instructor.get(INSTRUCTOR_ROUTES.PROFILE.EARNINGS, instAuthMiddleware, profileController.getEarnings);
instructor.get(INSTRUCTOR_ROUTES.PROFILE.NOTIFICATIONS, instAuthMiddleware, profileController.getNotifications);
instructor.get(INSTRUCTOR_ROUTES.PROFILE.WALLET, instAuthMiddleware, profileController.getWallet);

// Courses
instructor.post(INSTRUCTOR_ROUTES.COURSE.GET_MY_COURSES, instAuthMiddleware, courseController.myCourses);
instructor.get(INSTRUCTOR_ROUTES.COURSE.DETAILS, instAuthMiddleware, courseController.courseDetails);
instructor.get(INSTRUCTOR_ROUTES.COURSE.REFRESH_VIDEO, instAuthMiddleware, courseController.refreshVideoUrl);
instructor.patch(
  INSTRUCTOR_ROUTES.COURSE.EDIT,
  instAuthMiddleware,
  upload.any(),
  courseController.editCourse
);

instructor.get(INSTRUCTOR_ROUTES.COURSE.CATEGORY,instAuthMiddleware,upload.any(),courseController.getCategory);
instructor.post(INSTRUCTOR_ROUTES.COURSE.ADD,instAuthMiddleware,upload.any(),courseController.addCourse);

instructor.get(INSTRUCTOR_ROUTES.COURSE.PURCHASE_DETAILS, instAuthMiddleware, courseController.purchaseDetails);

// Quiz
instructor.post(INSTRUCTOR_ROUTES.COURSE.ADD_QUIZ, instAuthMiddleware, courseController.addQuiz);

instructor.get(INSTRUCTOR_ROUTES.COURSE.GET_QUIZ, instAuthMiddleware, courseController.getQuiz);

instructor.put(INSTRUCTOR_ROUTES.COURSE.EDIT_QUIZ, instAuthMiddleware, courseController.editQuiz);

// Events
instructor.post(INSTRUCTOR_ROUTES.EVENTS.CREATE, instAuthMiddleware, eventController.createEvents);
instructor.get(INSTRUCTOR_ROUTES.EVENTS.LIST, instAuthMiddleware, eventController.getAllEvents);
instructor.get(INSTRUCTOR_ROUTES.EVENTS.GET, instAuthMiddleware, eventController.getEvent);
instructor.patch(INSTRUCTOR_ROUTES.EVENTS.EDIT, instAuthMiddleware, eventController.editEvent);
instructor.get(INSTRUCTOR_ROUTES.EVENTS.LIST_ALL, instAuthMiddleware, eventController.getAllEvents);

instructor.patch(INSTRUCTOR_ROUTES.EVENTS.JOIN_EVENT, instAuthMiddleware, eventController.joinEvent);
instructor.patch(INSTRUCTOR_ROUTES.EVENTS.END_EVENT, instAuthMiddleware, eventController.endEvent);

// Chat
instructor.get(INSTRUCTOR_ROUTES.CHAT.MESSAGED_STUDENTS, instAuthMiddleware, messageController.getMessagedStudents);
instructor.get(INSTRUCTOR_ROUTES.CHAT.MESSAGES, instAuthMiddleware, messageController.getMessages);
instructor.post(
  INSTRUCTOR_ROUTES.CHAT.SEND_MESSAGE,
  instAuthMiddleware,
  upload.single("attachment"),
  messageController.sendInstructorMessage
);





export default instructor