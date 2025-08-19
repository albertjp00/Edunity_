import express from 'express'
import { AdminController } from '../controllers/admin/controller.js'

const admin = express.Router()


const dashboardController = new AdminController()

admin.get('/get-users',dashboardController.getUsers)

admin.put('/block-user/:id',dashboardController.blockUser)

admin.put('/unblock-users/:id',dashboardController.unblockUser)

export default admin