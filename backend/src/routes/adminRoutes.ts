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
import { AdminDashboardController } from '../controllers/admin/dashboard'

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


admin.post('/login',authController.adminLogin)

admin.get('/getUsers',adminAuthMiddleware,userController.getUsers)


admin.put('/blockUser/:id',adminAuthMiddleware ,userController.blockUnblock)

// admin.put('/unblockUsers/:id',dashboardController.unblockUser)


admin.get('/getInstructors', adminAuthMiddleware ,instructorController.getInstructor)

admin.get('/getKyc/:id' , adminAuthMiddleware ,instructorController.getKyc)

admin.put('/verifyKyc/:id' , adminAuthMiddleware, instructorController.verifyKyc)

admin.put('/rejectKyc/:id' , adminAuthMiddleware, instructorController.rejectKyc)

admin.get('/instructors/:id', adminAuthMiddleware,instructorController.getInstructors)

admin.get('/instructorsCourses/:id', adminAuthMiddleware,instructorController.getInstructorsCourses)

admin.get('/user/:id',userController.getUser)

admin.get('/userCourses/:id', adminAuthMiddleware,userController.getUserCourses)


admin.get('/courses', adminAuthMiddleware,courseController.getCourses)

admin.get('/courseDetails/:id', adminAuthMiddleware,courseController.getCourseDetails)

admin.get("/purchases", adminAuthMiddleware, courseController.getAllPurchases);


admin.get('/stats',adminAuthMiddleware , dashboardController.dashboardStats)
admin.get('/userOverview',adminAuthMiddleware,dashboardController.getUserOverview)

admin.get('/getEarnings',adminAuthMiddleware,dashboardController.getEarnings)

export default admin