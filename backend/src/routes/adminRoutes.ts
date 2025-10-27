import express from 'express'
import { AdminController } from '../controllers/admin/controller.js'
import { AdminInstructorController } from '../controllers/admin/instructorController.js'
import { AdminUserController } from '../controllers/admin/userControllers.js'
import { AdminCourseController } from '../controllers/admin/adminCourseController.js'
import { adminAuthMiddleware } from '../middleware/authMiddleware.js'
import { AdminRepository } from '../repositories/adminRepositories.js'
import { InstructorRepository } from '../repositories/instructorRepository.js'
import { UserRepository } from '../repositories/userRepository.js'
import { AdminService } from '../services/admin/adminServices.js'

const admin = express.Router()


// const dashboardController = new AdminController()
const adminRepo = new AdminRepository()
const userRepo = new UserRepository()
const adminService = new AdminService(adminRepo , userRepo)
const dashboardController = new AdminController(adminService)


// const instructorController = new AdminInstructorController()
const instructorController = new AdminInstructorController(
    new AdminRepository(),
    new InstructorRepository()
)

// const userController = new AdminUserController()
const userController = new AdminUserController(
    new AdminRepository(),
    new UserRepository()
)



// const courseController = new AdminCourseController()
const courseController = new AdminCourseController(
  new AdminRepository(),
  new InstructorRepository(),
  new UserRepository()
);

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


export default admin