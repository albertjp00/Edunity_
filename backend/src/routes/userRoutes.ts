import express from "express";
import multer from "multer";
import { AuthController } from "../controllers/user/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import { ProfileController } from "../controllers/user/profileController";
import path from "path";
import { UserCourseController } from "../controllers/user/courseController";
import { UserEventController } from "../controllers/user/eventController";
import { MessageController } from "../controllers/messaage/messageController";
import { UserRepository } from "../repositories/userRepository";
import { AuthService } from "../services/user/authService";
import { CourseRepository } from "../repositories/courserRepository";
import { UserCourseService } from "../services/user/userCourseService";
import { InstructorRepository } from "../repositories/instructorRepository";
import { AdminRepository } from "../repositories/adminRepositories";
import { ProfileService } from "../services/user/profileService";
import { UserEventService } from "../services/user/eventService";
import { MessageService } from "../services/message/messageService";
import { MessageRepository } from "../repositories/messageRepositories";
import { profile } from "console";



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

const router = express.Router();


//auth routes
const userRepository = new UserRepository()
const authService = new AuthService(userRepository)
const authController = new AuthController(authService)


//course routes 
const userRepo = new UserRepository()
const instructorRepo = new InstructorRepository()
const adminRepo = new AdminRepository()

const courseService = new UserCourseService(userRepo , instructorRepo , adminRepo)
const courseController = new UserCourseController(courseService)


//profile routes
const userRepos = new UserRepository
const profileService = new ProfileService(userRepos)
const profileController = new ProfileController(profileService);



const eventService = new  UserEventService(userRepo , instructorRepo)
const eventController = new UserEventController(eventService)


const messageRepo = new MessageRepository()
const messageService = new MessageService(messageRepo)
const messageController = new MessageController(messageService)



// Auth Routes
router.post("/login", authController.login);
router.post("/auth/googleLogin", authController.googleSignIn);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logoutUser);

router.get('/isBlocked',authMiddleware,authController.checkBlocked)

router.post('/forgotPassword',authController.forgotPassword)
router.post('/otpVerify',authController.verifyOtpForgotPass)
router.post('/resendOtpForgotPass',authController.resendOtpForgotPassword)
router.put('/resetPassword',authController.resetPassword)

router.post("/register", authController.register);
router.post("/verifyOtp", authController.verifyOtp);
router.post("/resendOtp", authController.resendOtp);

// Profile Routes (Protected)
router.get("/profile", authMiddleware, profileController.getProfile);
router.patch("/profile",authMiddleware,upload.single("profileImage"),profileController.editProfile);
router.put('/passwordChange',authMiddleware,profileController.changePassword)
router.get('/wallet',authMiddleware , profileController.getWallet)
router.get('/payment',authMiddleware,profileController.getPayment)
router.get('/notifications',authMiddleware,profileController.notifications)
router.put('/notificationsMarkRead',authMiddleware,profileController.notificationsMarkRead)


router.get('/getCourses',authMiddleware, courseController.showCourses)
router.get('/getAllCourses',authMiddleware, courseController.getAllCourses)
router.get('/courseDetails',authMiddleware,courseController.courseDetails)
router.get("/refresh",authMiddleware, courseController.refreshVideoUrl); 
router.get('/certificate/:courseId',authMiddleware,courseController.getCertificate)
router.post('/review',authMiddleware,courseController.addReview)


router.get('/myCourses/:page',authMiddleware , courseController.myCourses)
router.get('/getInstructors',authMiddleware , courseController.getInstructors)
router.get('/getFavourites',authMiddleware ,courseController.getFavourites)
router.get('/addtoFavourites/:id',authMiddleware,courseController.addtoFavourites)
router.get('/FavouritesCourseDetails/:id',authMiddleware,courseController.favCourseDetails)



router.get('/buyCourse/:id',authMiddleware , courseController.buyCourse)
router.post('/payment/verify',authMiddleware , courseController.verifyPayment)
router.get('/cancelPayment/:courseId',authMiddleware , courseController.cancelPayment)



router.get('/viewMyCourse/:id',authMiddleware , courseController.viewMyCourse)
router.post("/updateProgress", authMiddleware, courseController.updateProgress);

router.get("/quiz/:courseId",authMiddleware,courseController.getQuiz)
router.post("/quiz/:courseId/:quizId",authMiddleware ,courseController.submitQuiz)



router.get('/events',authMiddleware , eventController.getEvents)
router.get('/event/:id',authMiddleware , eventController.getEventDetails)
router.get('/eventEnroll/:id',authMiddleware , eventController.enrollEvent)
router.get('/myEvents',authMiddleware , eventController.getMyEvents)


router.get("/joinEvent/:eventId",authMiddleware ,eventController.joinUserEvent);


router.post("/chat",authMiddleware ,upload.single("attachment"),messageController.sendMessage);
router.get("/getInstructor/:instructorId",authMiddleware , messageController.getInstructor)
router.get("/messages/:userId/:receiverId",authMiddleware , messageController.getChatHistory);
router.get("/messagedInstructors",authMiddleware,messageController.getMessagedInstructors)
router.get("/getUnreadMessages/:instructorId",authMiddleware,messageController.getUnreadMessages)


router.get("/instructor/:id", authMiddleware, messageController.getInstructorToMessage);


router.delete('/cancelCourse/:id',authMiddleware,courseController.cancelCourse);


export default router;
