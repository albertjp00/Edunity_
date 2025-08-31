import { IUserRepository } from "../../repositories/userRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { otpStore } from "../../utils/otpStore.js";
import { generateOtp } from "../../utils/otp.js";
import { sendOtp } from "../../utils/sendMail.js";
import { OAuth2Client } from "google-auth-library";
import { IUser } from "../../models/user.js";
import { googleLoginResult } from "../../interfaces/userInterfaces.js";

dotenv.config();

const secret: string = process.env.SECRET_KEY || "";
const refresh: string = process.env.REFRESH_KEY || "";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SECRET_KEY = process.env.SECRET_KEY || "access_secret";

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
        try {
            const user = await this.userRepository.findByEmail(email);

            if (!user) {
                return { success: false, message: "User not found" };
            }

            if (user.blocked) {
                return { success: false, message: "Your account is blocked" };
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return { success: false, message: "Invalid password" };  // ✅ return, not throw
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
        } catch (error) {
            console.error(error);
            return { success: false, message: "Internal server error" }; // ✅ safe fallback
        }
    };



    registerRequest = async (
        name: string,
        email: string,
        password: string,
    ): Promise<RegisterResult> => {
        try {
            const userExists = await this.userRepository.findByEmail(email);
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





    async verifyOtpRequest(otp: string, email: string): Promise<{ success: boolean; message: string }> {
        try {
            const storedData = otpStore.get(email);
            console.log('verify otp', email);

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

            const hashedPassword = await bcrypt.hash(storedData.password, 10);

            await this.userRepository.create({
                name: storedData.name,
                email: storedData.email,
                password: hashedPassword,
            });

            otpStore.delete(email);

            return { success: true, message: "OTP verified, user registered successfully" };
        } catch (error) {
            console.error(error);
            return { success: false, message: "OTP ve   rification failed" };
        }
    }



    googleLogin = async (token: string): Promise<googleLoginResult> => {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID as string,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            throw new Error("Invalid Google token");
        }

        const { sub, email, name } = payload;
        const data: any = { name, email, sub };

        let user = await this.userRepository.findByEmail(email as string);
        if (!user) {
            data.googleId = data.sub
            user = await this.userRepository.create(data);
        }

        const accessToken = jwt.sign( { id: user._id, email: user.email },SECRET_KEY,{ expiresIn: "1h" });
        const refreshToken = jwt.sign({ id: user._id },refresh, { expiresIn: "7d" });

        return { accessToken, refreshToken, user }; 
    };



}

