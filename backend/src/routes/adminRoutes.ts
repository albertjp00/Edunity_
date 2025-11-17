import express from 'express'
import { AdminController } from '../controllers/admin/controller'
import { AdminInstructorController } from '../controllers/admin/instructorController'
import { AdminUserController } from '../controllers/admin/userControllers'
import { AdminCourseController } from '../controllers/admin/adminCourseController'
import { adminAuthMiddleware } from '../middleware/authMiddleware'
import { AdminRepository } from '../repositories/adminRepositories'
import { InstructorRepository } from '../repositories/instructorRepository'
import { UserRepository } from '../repositories/userRepository'
import { AdminService } from '../services/admin/adminServices'
import { AdminCourseService } from '../services/admin/courseServices'
import { AdminInstructorService } from '../services/admin/instructorServices'
import { AdminUserService } from '../services/admin/userServices'

const admin = express.Router()


// const dashboardController = new AdminController()
const adminRepo = new AdminRepository()
const userRepo = new UserRepository()
const instructorRepo = new InstructorRepository()

const adminService = new AdminService(adminRepo , userRepo)
const dashboardController = new AdminController(adminService)



const adminInstructorService = new AdminInstructorService(adminRepo , instructorRepo)
const instructorController = new AdminInstructorController(adminInstructorService)



const adminUserService = new AdminUserService(adminRepo , userRepo)
const userController = new AdminUserController(adminUserService)



const adminCourseService = new AdminCourseService(adminRepo ,  instructorRepo , userRepo)
const courseController = new AdminCourseController(adminCourseService);


admin.post('/login',dashboardController.adminLogin)

admin.get('/getUsers',adminAuthMiddleware,dashboardController.getUsers)


admin.put('/blockUser/:id',adminAuthMiddleware ,dashboardController.blockUnblock)

// admin.put('/unblockUsers/:id',dashboardController.unblockUser)


admin.get('/getInstructors', adminAuthMiddleware ,dashboardController.getInstructors)

admin.get('/getKyc/:id' , adminAuthMiddleware ,dashboardController.getKyc)

admin.put('/verifyKyc/:id' , adminAuthMiddleware, dashboardController.verifyKyc)

admin.put('/rejectKyc/:id' , adminAuthMiddleware, dashboardController.rejectKyc)

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