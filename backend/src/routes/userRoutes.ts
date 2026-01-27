import express from "express";
import multer from "multer";
import { AuthController } from "../controllers/user/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import { ProfileController } from "../controllers/user/profileController";
import { UserCourseController } from "../controllers/user/courseController";
import { UserEventController } from "../controllers/user/eventController";
import { MessageController } from "../controllers/messaage/messageController";
import { UserRepository } from "../repositories/userRepository";
import { AuthService } from "../services/user/authService";
import { UserCourseService } from "../services/user/userCourseService";
import { InstructorRepository } from "../repositories/instructorRepository";
import { AdminRepository } from "../repositories/adminRepositories";
import { ProfileService } from "../services/user/profileService";
import { UserEventService } from "../services/user/eventService";
import { MessageService } from "../services/message/messageService";
import { MessageRepository } from "../repositories/messageRepositories";
import { ROUTES } from "../routesConstants.ts/userRoutesConstants";



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



router.post(ROUTES.AUTH.LOGIN, authController.login);
router.post(ROUTES.AUTH.GOOGLE_LOGIN, authController.googleSignIn);
router.post(ROUTES.AUTH.REFRESH_TOKEN, authController.refreshToken);
router.post(ROUTES.AUTH.LOGOUT, authController.logoutUser);

router.get(ROUTES.AUTH.IS_BLOCKED, authMiddleware, authController.checkBlocked);

router.post(ROUTES.AUTH.FORGOT_PASSWORD, authController.forgotPassword);
router.post(ROUTES.AUTH.OTP_VERIFY, authController.verifyOtpForgotPass);
router.post(ROUTES.AUTH.RESEND_FORGOT_OTP, authController.resendOtpForgotPassword);
router.put(ROUTES.AUTH.RESET_PASSWORD, authController.resetPassword);

router.post(ROUTES.AUTH.REGISTER, authController.register);
router.post(ROUTES.AUTH.VERIFY_OTP, authController.verifyOtp);
router.post(ROUTES.AUTH.RESEND_OTP, authController.resendOtp);

// Profile
router.get(ROUTES.PROFILE.GET, authMiddleware, profileController.getProfile);
router.patch(ROUTES.PROFILE.UPDATE, authMiddleware, upload.single("profileImage"), profileController.editProfile);
router.put(ROUTES.PROFILE.CHANGE_PASSWORD, authMiddleware, profileController.changePassword);
router.get(ROUTES.PROFILE.WALLET, authMiddleware, profileController.getWallet);
router.get(ROUTES.PROFILE.PAYMENT, authMiddleware, profileController.getPayment);
router.get(ROUTES.PROFILE.NOTIFICATIONS, authMiddleware, profileController.notifications);
router.put(ROUTES.PROFILE.MARK_READ, authMiddleware, profileController.notificationsMarkRead);

// Courses
router.get(ROUTES.COURSES.GET_COURSES, authMiddleware, courseController.showCourses);
router.get(ROUTES.COURSES.GET_ALL, authMiddleware, courseController.getAllCourses);
router.get(ROUTES.COURSES.DETAILS, authMiddleware, courseController.courseDetails);
router.get(ROUTES.COURSES.REFRESH_VIDEO, authMiddleware, courseController.refreshVideoUrl);
router.get(ROUTES.COURSES.CERTIFICATE, authMiddleware, courseController.getCertificate);
router.post(ROUTES.COURSES.ADD_REVIEW, authMiddleware, courseController.addReview);

router.get(ROUTES.COURSES.MY_COURSES, authMiddleware, courseController.myCourses);
router.get(ROUTES.COURSES.GET_INSTRUCTORS, authMiddleware, courseController.getInstructors);
router.get(ROUTES.COURSES.FAVOURITES, authMiddleware, courseController.getFavourites);
router.get(ROUTES.COURSES.ADD_FAVOURITES, authMiddleware, courseController.addtoFavourites);
router.get(ROUTES.COURSES.FAV_COURSE_DETAILS, authMiddleware, courseController.favCourseDetails);

router.get(ROUTES.COURSES.BUY, authMiddleware, courseController.buyCourse);
router.post(ROUTES.COURSES.VERIFY_PAYMENT, authMiddleware, courseController.verifyPayment);
router.get(ROUTES.COURSES.CANCEL_PAYMENT, authMiddleware, courseController.cancelPayment);

router.get(ROUTES.COURSES.BUY_SUB, authMiddleware, courseController.buySubscription);
router.post(ROUTES.COURSES.VERIFY_SUBSCRIPTION_PAYMENT, authMiddleware, courseController.verifySubscriptionPayment);
router.get(ROUTES.COURSES.SUB_CHECK, authMiddleware, profileController.subscriptionCheck);
router.get(ROUTES.COURSES.SUB_COURSES, authMiddleware,courseController.mySubscriptionCourses);

router.get(ROUTES.COURSES.VIEW_MY_COURSE, authMiddleware, courseController.viewMyCourse);
router.post(ROUTES.COURSES.UPDATE_PROGRESS, authMiddleware, courseController.updateProgress);

router.get(ROUTES.COURSES.QUIZ, authMiddleware, courseController.getQuiz);
router.post(ROUTES.COURSES.SUBMIT_QUIZ, authMiddleware, courseController.submitQuiz);

router.delete(ROUTES.COURSES.CANCEL_COURSE, authMiddleware, courseController.cancelCourse);
router.post(ROUTES.COURSES.REPORT_COURSE, authMiddleware, courseController.reportCourse);

// Events
router.get(ROUTES.EVENTS.LIST, authMiddleware, eventController.getEvents);
router.get(ROUTES.EVENTS.DETAILS, authMiddleware, eventController.getEventDetails);
router.get(ROUTES.EVENTS.ENROLL, authMiddleware, eventController.enrollEvent);
router.get(ROUTES.EVENTS.MY_EVENTS, authMiddleware, eventController.getMyEvents);
router.get(ROUTES.EVENTS.JOIN, authMiddleware, eventController.joinUserEvent);


// Chat & Messages
router.post(ROUTES.CHAT.SEND, authMiddleware, upload.single("attachment"), messageController.sendMessage);
router.get(ROUTES.CHAT.GET_INSTRUCTOR, authMiddleware, messageController.getInstructor);
router.get(ROUTES.CHAT.HISTORY, authMiddleware, messageController.getChatHistory);
router.get(ROUTES.CHAT.MESSAGED_INSTRUCTORS, authMiddleware, messageController.getMessagedInstructors);
router.get(ROUTES.CHAT.UNREAD_MESSAGES, authMiddleware, messageController.getUnreadMessages);
router.get(ROUTES.CHAT.INSTRUCTOR_TO_MESSAGE, authMiddleware, messageController.getInstructorToMessage);




// router.post("/login", authController.login);
// router.post("/auth/googleLogin", authController.googleSignIn);
// router.post("/refresh-token", authController.refreshToken);
// router.post("/logout", authController.logoutUser);

// router.get('/isBlocked',authMiddleware,authController.checkBlocked)

// router.post('/forgotPassword',authController.forgotPassword)
// router.post('/otpVerify',authController.verifyOtpForgotPass)
// router.post('/resendOtpForgotPass',authController.resendOtpForgotPassword)
// router.put('/resetPassword',authController.resetPassword)

// router.post("/register", authController.register);
// router.post("/verifyOtp", authController.verifyOtp);
// router.post("/resendOtp", authController.resendOtp);

// // Profile Routes (Protected)
// router.get("/profile", authMiddleware, profileController.getProfile);
// router.patch("/profile",authMiddleware,upload.single("profileImage"),profileController.editProfile);
// router.put('/passwordChange',authMiddleware,profileController.changePassword)
// router.get('/wallet',authMiddleware , profileController.getWallet)
// router.get('/payment',authMiddleware,profileController.getPayment)
// router.get('/notifications',authMiddleware,profileController.notifications)
// router.put('/notificationsMarkRead',authMiddleware,profileController.notificationsMarkRead)


// router.get('/getCourses',authMiddleware, courseController.showCourses)
// router.get('/getAllCourses',authMiddleware, courseController.getAllCourses)
// router.get('/courseDetails',authMiddleware,courseController.courseDetails)
// router.get("/refresh",authMiddleware, courseController.refreshVideoUrl); 
// router.get('/certificate/:courseId',authMiddleware,courseController.getCertificate)
// router.post('/review',authMiddleware,courseController.addReview)


// router.get('/myCourses/:page',authMiddleware , courseController.myCourses)
// router.get('/getInstructors',authMiddleware , courseController.getInstructors)
// router.get('/getFavourites',authMiddleware ,courseController.getFavourites)
// router.get('/addtoFavourites/:id',authMiddleware,courseController.addtoFavourites)
// router.get('/favouritesCourseDetails/:id',authMiddleware,courseController.favCourseDetails)



// router.get('/buyCourse/:id',authMiddleware , courseController.buyCourse)
// router.post('/payment/verify',authMiddleware , courseController.verifyPayment)
// router.get('/cancelPayment/:courseId',authMiddleware , courseController.cancelPayment)



// router.get('/viewMyCourse/:id',authMiddleware , courseController.viewMyCourse)
// router.post("/updateProgress", authMiddleware, courseController.updateProgress);

// router.get("/quiz/:courseId",authMiddleware,courseController.getQuiz)
// router.post("/quiz/:courseId/:quizId",authMiddleware ,courseController.submitQuiz)



// router.get('/events',authMiddleware , eventController.getEvents)
// router.get('/event/:id',authMiddleware , eventController.getEventDetails)
// router.get('/eventEnroll/:id',authMiddleware , eventController.enrollEvent)
// router.get('/myEvents',authMiddleware , eventController.getMyEvents)


// router.get("/joinEvent/:eventId",authMiddleware ,eventController.joinUserEvent);


// router.post("/chat",authMiddleware ,upload.single("attachment"),messageController.sendMessage);
// router.get("/getInstructor/:instructorId",authMiddleware , messageController.getInstructor)
// router.get("/messages/:userId/:receiverId",authMiddleware , messageController.getChatHistory);
// router.get("/messagedInstructors",authMiddleware,messageController.getMessagedInstructors)
// router.get("/getUnreadMessages/:instructorId",authMiddleware,messageController.getUnreadMessages)


// router.get("/instructor/:id", authMiddleware, messageController.getInstructorToMessage);


// router.delete('/cancelCourse/:id',authMiddleware,courseController.cancelCourse);


export default router;
