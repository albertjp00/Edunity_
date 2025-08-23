import { IInsRepository } from "../../repositories/instructorRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { otpStore } from "../../utils/otpStore.js";
import { generateOtp } from "../../utils/otp.js";
import { sendOtp } from "../../utils/sendMail.js";
import { InstAuthRequest } from "../../middleware/authMiddleware.js";

dotenv.config()

const secret: string = process.env.SECRET_KEY || '';
const refresh: string = process.env.REFRESH_KEY || '';


interface LoginResult {
    success: boolean;
    message: string;
    instructor?: any;
    accessToken?: string;
    refreshToken?: string;
    statusCode? : number
}


export class InstAuthService {
    constructor(private instructorRepository: IInsRepository) { }

    instructorLogin = async (email: string, password: string): Promise<LoginResult> => {
        const instructor = await this.instructorRepository.findByEmail(email);

        if (!instructor) {
            return { success: false, message: "Invalid email or password" };
        }

        if (instructor.blocked) {
            return { success: false, message: "Your account is blocked", statusCode: 403};
        }

        const isMatch = await bcrypt.compare(password, instructor.password);
        if (!isMatch) {
            return { success: false, message: "Invalid email or password" };
        }

        const accessToken = jwt.sign({ id: instructor._id }, secret, { expiresIn: "3h" });
        const refreshToken = jwt.sign({ id: instructor._id }, refresh, { expiresIn: "1d" });

        return {
            success: true,
            message: "Login successful",
            instructor,
            accessToken,
            refreshToken
        };
    };



    

}