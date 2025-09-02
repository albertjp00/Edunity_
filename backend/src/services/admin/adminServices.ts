import { IInstructor } from "../../models/instructor.js";
import { IUser } from "../../models/user.js";
import { IAdminRepository } from "../../repositories/adminRepositories.js";
import { IUserRepository } from "../../repositories/userRepository.js";
import { kycRejectMail } from "../../utils/sendMail.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

interface adminLoginResult {
    success: boolean;
    message: string;
    token?: string
}
const secret: string = process.env.SECRET_KEY || '';



export class AdminService {
    constructor(private adminRepository: IAdminRepository, private userRepository: IUserRepository) { }

    loginRequest = async (email: string, password: string): Promise<adminLoginResult | null> => {
        try {
            const admin = await this.adminRepository.findByEmail(email, password)
            console.log(admin);

            if (!admin) {
                return { success: false, message: 'password incorrect' }
            }

            const token = jwt.sign(
                { id: admin._id, email: admin.email, role: "admin" }, // 👈 add role
                process.env.SECRET_KEY as string,
                { expiresIn: "1d" }
            );

            return { success: true, message: 'Login success', token: token }
        } catch (error) {
            console.log(error);
            return null
        }
    }

    getUsers = async (): Promise<IUser[] | null> => {
        try {
            const result = await this.adminRepository.findUsers()
            return result
        } catch (error) {
            console.log(error);
            return null
        }
    }

    blockUser = async (id: string): Promise<boolean | null> => {
        try {
            console.log('admin service block');

            const user = await this.userRepository.findById(id)
            if (user?.blocked) {
                return await this.adminRepository.unblockUser(id)
            } else {
                return await this.adminRepository.blockUser(id)
            }
        } catch (error) {
            console.log(error);
            return null
        }
    }

    unblockUser = async (id: string): Promise<boolean | null> => {
        try {
            const result = await this.adminRepository.unblockUser(id)
            return result
        } catch (error) {
            console.log(error);
            return null
        }
    }

    getInstructors = async (): Promise<IInstructor[] | null> => {
        try {
            const result = await this.adminRepository.findInstructors()
            return result
        } catch (error) {
            console.log(error);
            return null
        }
    }

    getKycDetails = async (id: string): Promise<void | null> => {
        try {
            const result = await this.adminRepository.getKycDetails(id)
            return result
        } catch (error) {
            console.log(error);

        }
    }

    verifyKyc = async (id: string): Promise<void | null> => {
        try {
            const result = await this.adminRepository.verifyKyc(id)
            return result
        } catch (error) {
            console.log(error);

        }
    }

    rejectKyc = async (id: string, reason: string): Promise<void | null> => {
        try {

            const result = await this.adminRepository.rejectKyc(id)
            let defaultEmail = 'albertjpaul@gmail.com'

            await kycRejectMail(defaultEmail, reason)
            return result
        } catch (error) {
            console.log(error);

        }
    }

}