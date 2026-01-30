import { IInsRepository } from "../../repositories/instructorRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { otpStore } from "../../utils/otpStore";
import { generateOtp } from "../../utils/otp";
import { sendOtp } from "../../utils/sendMail";
import { StatusMessage } from "../../enums/statusMessage";
import { IInstAuthService } from "../../interfacesServices.ts/instructorServiceInterface";

dotenv.config()

const secret: string = process.env.SECRET_KEY || '';
const refresh: string = process.env.REFRESH_KEY || '';


interface LoginResult {
    success: boolean;
    message: string;
    instructor?: any;
    accessToken?: string;
    refreshToken?: string;
    statusCode?: number
}

interface RegisterResult {
    success: boolean;
    message: string;
}


export class InstAuthService implements IInstAuthService {
    constructor(private instructorRepository: IInsRepository) { }

    instructorLogin = async (email: string, password: string): Promise<LoginResult> => {
        const instructor = await this.instructorRepository.findByEmail(email);

        if (!instructor) {
            return { success: false, message: "Invalid email or password" };
        }

        if (instructor.blocked) {
            return { success: false, message: "Your account is blocked", statusCode: 403 };
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

    instructorRegister = async (
        name: string,
        email: string,
        password: string,
    ): Promise<RegisterResult> => {
        try {
            const userExists = await this.instructorRepository.findByEmail(email);
            if (userExists) {
                return { success: false, message: "Email already registered" };
            }

            const otp = generateOtp();
            const defaultEmail = "albertjpaul@gmail.com";
            await sendOtp(defaultEmail, otp);

            otpStore.set(email, {
                name,
                email,
                password,
                otp,
                expiresAt: Date.now() + 5 * 60 * 1000,
            });

            console.log("otpStore:", otpStore);

            return { success: true, message: "OTP sent to your email" };
        } catch (error) {
            console.error(error);
            throw error
        }
    };


    async resendOtpRequest(email: string): Promise<{ success: boolean }> {

        try {
            const otp = generateOtp();
            console.log('request resend otp instructor', otp, email);


            const storedData = otpStore.get(email)
            if (!storedData) {
                return { success: false }
            }
            // console.log(storedData);


            const defaultEmail = "albertjpaul@gmail.com";
            await sendOtp(defaultEmail, otp);

            otpStore.set(email, {
                ...storedData,
                otp,
                expiresAt: Date.now() + 5 * 60 * 1000,
            });
            console.log(otpStore);


            return { success: true }
        } catch (error) {
            console.log(error);
            return { success: false };
        }
    }





    async verifyOtpRequest(
        otp: string,
        email: string
    ): Promise<{ success: boolean; message: string }> {
        try {
            const storedData = otpStore.get(email);
            console.log("verify otp instructor", email);

            if (!storedData) {
                return { success: false, message: "OTP not found or expired" };
            }

            if (Date.now() > storedData.expiresAt) {
                otpStore.delete(email);
                return { success: false, message: "OTP expired" };
            }

            if (storedData.otp !== otp) {
                return { success: false, message: "Incorrect OTP" };
            }

            const existingInstructor = await this.instructorRepository.findByEmail(storedData.email);
            if (existingInstructor) {
                otpStore.delete(email); 
                return { success: false, message: "Email already registered" };
            }

            const hashedPassword = await bcrypt.hash(storedData.password, 10);

            await this.instructorRepository.create({
                name: storedData.name,
                email: storedData.email,
                password: hashedPassword,
            });

            otpStore.delete(email);

            return { success: true, message: "OTP verified, user registered successfully" };
        } catch (error) {
            console.error(error);
            return { success: false, message: "OTP verification failed" };
        }
    }







    forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
        try {
            console.log("forgotPassword user service");

            const instructor = await this.instructorRepository.findByEmail(email);
            if (!instructor) {
                return { success: false, message: "Email doesn't exist" };
            }

            const defaultEmail = 'albertjpaul@gmail.com'
            const otp = await generateOtp();
            await sendOtp(defaultEmail, otp);

            otpStore.set(email, {
                name: instructor.name,
                email: email,
                password: instructor.password,
                otp,
                expiresAt: Date.now() + 5 * 60 * 1000,
            });


            return { success: true, message: "OTP sent successfully" };
        } catch (error) {
            console.error(error);
            return { success: false, message: "Something went wrong" };
        }
    };

        verifyForgotPasswordOtp = async (otp: string, email: string): Promise<{ success: boolean; message: string }> => {
        try {
            const storedData = otpStore.get(email);

            if (!storedData) {
                return { success: false, message: StatusMessage.OTP_NOT_FOUND };
            }

            if (Date.now() > storedData.expiresAt) {
                otpStore.delete(email);
                return { success: false, message: StatusMessage.OTP_EXPIRED };
            }

            if (storedData.otp !== otp) {
                return { success: false, message: StatusMessage.INVALID_OTP };
            }

            otpStore.delete(email);

            return { success: true, message: StatusMessage.OTP_VERIFIED };
        } catch (error) {
            console.error(error);
            return { success: false, message: StatusMessage.OTP_VERIFICATION_FAILED };
        }
    };


    async resetPassword(email: string, newPassword: string): Promise<{ success: boolean; message: string }> {
        try {
            const instructor = await this.instructorRepository.findByEmail(email);
            if (!instructor) {
                return { success: false, message: "User not found" };
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await this.instructorRepository.changePassword(instructor._id as string, hashedPassword);

            return { success: true, message: "Password reset successfully" };
        } catch (error) {
            console.error(error);
            return { success: false, message: "Password reset failed" };
        }
    }



}