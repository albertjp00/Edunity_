import express from 'express'
import { AdminController } from '../controllers/admin/controller.js'
import { AdminInstructorController } from '../controllers/admin/instructorController.js'
import { AdminUserController } from '../controllers/admin/userControllers.js'
import { AdminCourseController } from '../controllers/admin/adminCourseController.js'
import { adminAuthMiddleware } from '../middleware/authMiddleware.js'

const admin = express.Router()


const dashboardController = new AdminController()
const instructorController = new AdminInstructorController()
const userController = new AdminUserController()
const courseController = new AdminCourseController()

admin.post('/login',dashboardController.adminLogin)

admin.get('/getUsers',adminAuthMiddleware,dashboardController.getUsers)

admin.put('/blockUser/:id',dashboardController.blockUser)

admin.put('/unblock-users/:id',dashboardController.unblockUser)

admin.get('/get-instructors',dashboardController.getInstructors)

admin.get('/get-kyc/:id' , dashboardController.getKyc)

admin.put('/verify-kyc/:id' , dashboardController.verifyKyc)

admin.put('/reject-kyc/:id' , dashboardController.rejectKyc)

admin.get('/instructors/:id',instructorController.getInstructors)
admin.get('/instructorsCourses/:id',instructorController.getInstructorsCourses)

admin.get('/user/:id',userController.getUser)
admin.get('/userCourses/:id',userController.getUserCourses)


admin.get('/courses',courseController.getCourses)

admin.get('/courseDetails/:id',courseController.getCourseDetails)


export default admin