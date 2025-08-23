import { IUserRepository } from "../../repositories/userRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { otpStore } from "../../utils/otpStore.js";
import { generateOtp } from "../../utils/otp.js";
import { sendOtp } from "../../utils/sendMail.js";

dotenv.config();

const secret: string = process.env.SECRET_KEY || "";
const refresh: string = process.env.REFRESH_KEY || "";

// Interfaces
interface LoginResult {
    success: boolean;
    message: string;
    user?: any;
    accessToken?: string;
    refreshToken?: string;
}

interface RegisterResult {
    success: boolean;
    message: string;
}

interface OtpData {
    name: string;
    email: string;
    password: string;
    otp: string;
    expiresAt: string;
}

interface RegisterRequestPayload {
    name: string;
    email: string;
    password: string;
}

// Main Auth Service
export class AuthService {
    constructor(private userRepository: IUserRepository) { }

    loginRequest = async (email: string, password: string): Promise<LoginResult> => {
        const user = await this.userRepository.findByEmail(email);



        if (!user) {
            return { success: false, message: "User not found" };
        }

        if (user.blocked) {
  return { success: false, message: "Your account is blocked" };
}


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return { success: false, message: "Invalid password" };
        }

        const accessToken = jwt.sign({ id: user._id }, secret, { expiresIn: "3h" });
        const refreshToken = jwt.sign({ id: user._id }, refresh, { expiresIn: "7d" });

        return {
            success: true,
            message: "Login successful",
            user,
            accessToken,
            refreshToken,
        };
    };

    registerRequest = async (
        name: string,
        email: string,
        password: string,
    ): Promise<RegisterResult> => {
        try {
            const userExists = await this.userRepository.findByEmail(email);
            if (userExists) {
                throw new Error("Email already registered");
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
            return {
                success: false,
                message: (error as Error).message || "Registration failed",
            };
        }
    };


    async resendOtpRequest(email: string): Promise<{ success: boolean }> {

        try {
            const otp = generateOtp();
            console.log('request resend otp', otp, email);


            const storedData = otpStore.get(email)
            if (!storedData) {
                return { success: false }
            }
            console.log(storedData);


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
            // Retrieve stored OTP details
            const storedData = otpStore.get(email);

            if (!storedData) {
                return { success: false, message: "OTP not found or expired" };
            }

            // Check if OTP expired
            if (Date.now() > storedData.expiresAt) {
                otpStore.delete(email);
                return { success: false, message: "OTP expired" };
            }

            // Check if OTP matches
            if (storedData.otp !== otp) {
                return { success: false, message: "Incorrect OTP" };
            }

            // Hash password before saving user
            const hashedPassword = await bcrypt.hash(storedData.password, 10);

            await this.userRepository.create({
                name: storedData.name,
                email: storedData.email,
                password: hashedPassword,
            });

            // Remove OTP from store after successful verification
            otpStore.delete(email);

            return { success: true, message: "OTP verified, user registered successfully" };
        } catch (error) {
            console.error(error);
            return { success: false, message: "OTP ve   rification failed" };
        }
    }


}

