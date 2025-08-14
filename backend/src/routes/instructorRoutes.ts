import { InsAuthController } from "../controllers/instructor/authController.js"
import  express  from "express"



const authController =new InsAuthController()

const instructor = express.Router()


instructor.post('/login',authController.login)


export default instructor