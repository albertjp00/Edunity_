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

admin.put('/blockUser/:id',dashboardController.blockUnblock)

// admin.put('/unblockUsers/:id',dashboardController.unblockUser)

admin.get('/getInstructors',dashboardController.getInstructors)

admin.get('/getKyc/:id' , dashboardController.getKyc)

admin.put('/verifyKyc/:id' , dashboardController.verifyKyc)

admin.put('/rejectKyc/:id' , dashboardController.rejectKyc)

admin.get('/instructors/:id',instructorController.getInstructors)
admin.get('/instructorsCourses/:id',instructorController.getInstructorsCourses)

admin.get('/user/:id',userController.getUser)
admin.get('/userCourses/:id',userController.getUserCourses)


admin.get('/courses',courseController.getCourses)

admin.get('/courseDetails/:id',courseController.getCourseDetails)


export default admin