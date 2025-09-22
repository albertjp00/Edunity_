import express from 'express'
import { AdminController } from '../controllers/admin/controller.js'
import { AdminInstructorController } from '../controllers/admin/instructorController.js'
import { AdminUserController } from '../controllers/admin/userControllers.js'
import { AdminCourseController } from '../controllers/admin/adminCourseController.js'
import { adminAuthMiddleware } from '../middleware/authMiddleware.js'
import { AdminRepository } from '../repositories/adminRepositories.js'
import { InstructorRepository } from '../repositories/instructorRepository.js'
import { UserRepository } from '../repositories/userRepository.js'

const admin = express.Router()


// const dashboardController = new AdminController()
const dashboardController = new AdminController(
  new AdminRepository(),
//   new InstructorRepository(),
  new UserRepository()
);



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

admin.get("/purchases", courseController.getAllPurchases);


export default admin