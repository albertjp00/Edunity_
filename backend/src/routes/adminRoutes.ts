import express from 'express'
import { AdminInstructorController } from '../controllers/admin/instructorController'
import { AdminUserController } from '../controllers/admin/userControllers'
import { AdminCourseController } from '../controllers/admin/adminCourseController'
import { adminAuthMiddleware } from '../middleware/authMiddleware'
import { AdminRepository } from '../repositories/adminRepositories'
import { InstructorRepository } from '../repositories/instructorRepository'
import { UserRepository } from '../repositories/userRepository'
import { AdminService } from '../services/admin/dashboardServices'
import { AdminCourseService } from '../services/admin/courseServices'
import { AdminInstructorService } from '../services/admin/instructorServices'
import { AdminUserService } from '../services/admin/userServices'
import { AdminAuthController } from '../controllers/admin/authController'
import { AdminDashboardController } from '../controllers/admin/dashboardController'
import { ADMIN_ROUTES } from '../routesConstants.ts/adminRouteConstants'

const admin = express.Router()


// const dashboardController = new AdminController()
const adminRepo = new AdminRepository()
const userRepo = new UserRepository()
const instructorRepo = new InstructorRepository()


const adminService = new AdminService(adminRepo , userRepo)
const authController = new AdminAuthController(adminService)


const dashboardController = new AdminDashboardController(adminService)



const adminInstructorService = new AdminInstructorService(adminRepo , instructorRepo)
const instructorController = new AdminInstructorController(adminInstructorService)



const adminUserService = new AdminUserService(adminRepo , userRepo)
const userController = new AdminUserController(adminUserService)


const adminCourseService = new AdminCourseService(adminRepo ,  instructorRepo , userRepo)
const courseController = new AdminCourseController(adminCourseService);



admin.post(ADMIN_ROUTES.AUTH.LOGIN, authController.adminLogin);

admin.post(ADMIN_ROUTES.AUTH.REFRESH, authController.refreshToken);

admin.get(ADMIN_ROUTES.USERS.GET_ALL, adminAuthMiddleware, userController.getUsers);

admin.put(ADMIN_ROUTES.USERS.BLOCK_UNBLOCK, adminAuthMiddleware, userController.blockUnblock);

admin.get(ADMIN_ROUTES.INSTRUCTORS.GET_ALL, adminAuthMiddleware, instructorController.getInstructor);

admin.get(ADMIN_ROUTES.INSTRUCTORS.GET_KYC, adminAuthMiddleware, instructorController.getKyc);

admin.put(ADMIN_ROUTES.INSTRUCTORS.VERIFY_KYC, adminAuthMiddleware, instructorController.verifyKyc);

admin.put(ADMIN_ROUTES.INSTRUCTORS.REJECT_KYC, adminAuthMiddleware, instructorController.rejectKyc);

admin.get(ADMIN_ROUTES.INSTRUCTORS.GET_BY_ID, adminAuthMiddleware, instructorController.getInstructors);

admin.put(ADMIN_ROUTES.INSTRUCTORS.BLOCK_INSTRUCTOR, adminAuthMiddleware, instructorController.blockInstructor);

admin.get(ADMIN_ROUTES.INSTRUCTORS.GET_COURSES, adminAuthMiddleware, instructorController.getInstructorsCourses);

admin.get(ADMIN_ROUTES.COURSES.GET_ALL, adminAuthMiddleware, courseController.getCourses);

admin.get(ADMIN_ROUTES.COURSES.GET_DETAILS, adminAuthMiddleware, courseController.getCourseDetails);



admin.get(ADMIN_ROUTES.COURSES.BLOCK_COURSE, adminAuthMiddleware, courseController.blockCourse);

admin.get(ADMIN_ROUTES.COURSES.GET_PURCHASES, adminAuthMiddleware, courseController.getAllPurchases);

admin.get(ADMIN_ROUTES.COURSES.EXPORT_PDF, adminAuthMiddleware, courseController.exportPurchasesPDF);


admin.get(ADMIN_ROUTES.DASHBOARD.STATS, adminAuthMiddleware, dashboardController.dashboardStats);

admin.get(ADMIN_ROUTES.DASHBOARD.USER_OVERVIEW, adminAuthMiddleware, dashboardController.getUserOverview);

admin.get(ADMIN_ROUTES.DASHBOARD.EARNINGS, adminAuthMiddleware, dashboardController.getEarnings);

admin.post(ADMIN_ROUTES.CATEGORY.ADD_CATEGORY, adminAuthMiddleware, courseController.addCategory);

admin.get(ADMIN_ROUTES.CATEGORY.GET_CATEGORY, adminAuthMiddleware, courseController.getCategory);

admin.patch(ADMIN_ROUTES.CATEGORY.DELETE_CATEGORY, adminAuthMiddleware, courseController.deleteCategory);

admin.get(ADMIN_ROUTES.COURSES.GET_REPORTS, adminAuthMiddleware, courseController.getReports);

admin.post(ADMIN_ROUTES.COURSES.ADD_SUBSCRIPTION, adminAuthMiddleware, courseController.addSubscription);

admin.get(ADMIN_ROUTES.COURSES.GET_SUBSCRIPTION, adminAuthMiddleware, courseController.getSubscription);

admin.patch(ADMIN_ROUTES.COURSES.UPDATE_SUBSCRIPTION, adminAuthMiddleware, courseController.updateSubscription);




export default admin