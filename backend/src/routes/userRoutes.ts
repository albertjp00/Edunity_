import express from "express";
import multer from "multer";
import { AuthController } from "../controllers/user/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { ProfileController } from "../controllers/user/profileController.js";
import path from "path";
import { UserCourseController } from "../controllers/user/courseController.js";
import { UserEventController } from "../controllers/user/eventController.js";
import { MessageController } from "../controllers/messaage/messageController.js";



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
const authController = new AuthController();
const profileController = new ProfileController();
const courseController = new UserCourseController()
const eventController = new UserEventController()
const messageController = new MessageController()

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


router.get('/getCourses',authMiddleware, courseController.showCourses)
router.get('/getAllCourses',authMiddleware, courseController.getAllCourses)
router.get('/courseDetails',authMiddleware,courseController.courseDetails)
router.get("/videos/refresh",authMiddleware, courseController.refreshVideoUrl);

router.get('/myCourses/:page',authMiddleware , courseController.myCourses)
router.get('/getInstructors',authMiddleware , courseController.getInstructors)
router.get('/getFavourites',authMiddleware ,courseController.getFavourites)
router.get('/addtoFavourites/:id',authMiddleware,courseController.addtoFavourites)
router.get('/FavouritesCourseDetails/:id',authMiddleware,courseController.favCourseDetails)



router.get('/buyCourse/:id',authMiddleware , courseController.buyCourse)
router.post('/payment/verify',authMiddleware , courseController.verifyPayment)


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


router.get("/instructor/:id", authMiddleware, messageController.getInstructortoMessage);


router.delete('/cancelCourse/:id',authMiddleware,courseController.cancelCourse);


export default router;
