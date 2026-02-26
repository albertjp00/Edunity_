import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { otpStore } from "../../utils/otpStore";
import { generateOtp } from "../../utils/otp";
import { sendOtp } from "../../utils/sendMail";
import { OAuth2Client } from "google-auth-library";
import { googleLoginResult, IUserRepository } from "../../interfaces/userInterfaces";
import { IUserAuthService, LoginResult, RegisterResult } from "../../interfacesServices.ts/userServiceInterfaces";
import { StatusMessage } from "../../enums/statusMessage";
import { LoginMapper } from "../../mapper/user.mapper";
import { LoginDTO } from "../../dto/adminDTO";

dotenv.config();

const secret: string = process.env.SECRET_KEY!;
const refresh: string = process.env.REFRESH_KEY!;

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const SECRET_KEY = process.env.SECRET_KEY || "access_secret";

// Interfaces


// Main Auth Service
export class AuthService implements IUserAuthService {
    constructor(private _userRepository: IUserRepository) { }    



    loginRequest = async (email: string, password: string): Promise<LoginDTO | LoginResult> => {
        try {
            const user = await this._userRepository.findByEmail(email);

            if (!user) {
                return { success: false, message: StatusMessage.USER_NOT_FOUND };
            }

            if (user.blocked) {
                return { success: false, message: StatusMessage.BLOCKED };
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return { success: false, message: StatusMessage.INCORRECT_PASSWORD };
            }

            const accessToken = jwt.sign({ id: user._id }, secret, { expiresIn: "1h" });
            const refreshToken = jwt.sign({ id: user._id }, refresh, { expiresIn: "2h" });

            const loginMapped = LoginMapper({ success : true, message: StatusMessage.LOGIN_SUCCESS,accessToken,refreshToken})



            return loginMapped
        } catch (error) {
            console.error(error);
            return { success: false, message: StatusMessage.INTERNAL_SERVER_ERROR }; // ✅ safe fallback
        }
    };

    isBlocked = async (id : string):Promise< boolean | null> =>{
        try {
            const blocked = await this._userRepository.isBlocked(id)
            if(blocked ){
                return true
            }
            return false
        } catch (error) {
            console.log(error);
            return null
        }
    }



    registerRequest = async (
        name: string,
        email: string,
        password: string,
    ): Promise<RegisterResult> => {
        try {
            const userExists = await this._userRepository.findByEmail(email);
            if (userExists) {
                return { success: false, message: StatusMessage.EMAIL_EXISTS };
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

            return { success: true, message: StatusMessage.OTP_SEND_to_MAIL };
        } catch (error) {
            console.error(error);
            throw error
        }
    };


    async resendOtpRequest(email: string): Promise<{ success: boolean }> {

        try {
            const otp = generateOtp();
            console.log('request resend otp', otp, email);


            console.log(otpStore);
            const storedData = otpStore.get(email)
            console.log(storedData);

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
            console.log('verify otp user', email);

            if (!storedData) {
                return { success: false, message: StatusMessage.OTP_NOT_FOUND };
            }

            if (Date.now() > storedData.expiresAt) {
                otpStore.delete(email);
                return { success: false, message: StatusMessage.OTP_EXPIRED };
            }

            if (storedData.otp !== otp) {
                return { success: false, message: StatusMessage.INVALID_OTP};
            }

            const hashedPassword = await bcrypt.hash(storedData.password, 10);

            await this._userRepository.create({
                name: storedData.name,
                email: storedData.email,
                password: hashedPassword,
            });

            otpStore.delete(email);

            return { success: true, message: StatusMessage.OTP_VERIFIED };
        } catch (error) {
            console.error(error);
            return { success: false, message: StatusMessage.OTP_VERIFICATION_FAILED };
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

        let user = await this._userRepository.findByEmail(email as string);
        if (!user) {
            data.googleId = data.sub
            data.provider = 'google'
            user = await this._userRepository.create(data);
        }

        const accessToken = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });
        const refreshToken = jwt.sign({ id: user._id }, refresh, { expiresIn: "1d" });

        return { accessToken, refreshToken, user  };
    };



    forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
        try {
            const user = await this._userRepository.findByEmail(email);
            if (!user) {
                return { success: false, message: StatusMessage.EMAIL_NOT_EXISTS };
            }

            const defaultEmail = 'albertjpaul@gmail.com'
            const otp = await generateOtp();
            await sendOtp(defaultEmail, otp);

            otpStore.set(email, {
                name: user.name,
                email: email,
                password: user.password,
                otp,
                expiresAt: Date.now() + 5 * 60 * 1000,
            });

            return { success: true, message: StatusMessage.OTP_SENT };
        } catch (error) {
            console.error(error);
            return { success: false, message: StatusMessage.SOMETHING_WRONG };
        }
    };

    verifyForgotPasswordOtp = async (otp: string, email: string): Promise<{ success: boolean; message: string }> => {
        try {
            const storedData = otpStore.get(email);

            console.log('verify otp password',storedData);
        

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

            return { success: true, message:StatusMessage.OTP_VERIFIED };
        } catch (error) {
            console.error(error);
            return { success: false, message: StatusMessage.OTP_VERIFICATION_FAILED };
        }
    };

    
    async resetPassword(email: string, newPassword: string): Promise<{ success: boolean; message: string }> {
        try {
            const user = await this._userRepository.findByEmail(email);
            if (!user) {
                return { success: false, message: StatusMessage.USER_NOT_FOUND };
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            await this._userRepository.changePassword(user._id, hashedPassword);

            return { success: true, message: StatusMessage.PASSWORD_CHANGED };
        } catch (error) {
            console.error(error);
            return { success: false, message: StatusMessage.RESET_FAILED };
        }
    }

    



}

