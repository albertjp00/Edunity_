import { Request, Response } from "express";
import { AuthService } from "../../services/user/authService.js";
import { UserRepository } from "../../repositories/userRepository.js";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../../middleware/authMiddleware.js";
import { OAuth2Client } from "google-auth-library";



const ACCESS_SECRET = process.env.SECRET_KEY || "access_secret";
const REFRESH_SECRET = process.env.REFRESH_KEY || "refresh_secret";

export class AuthController {
  private authService: AuthService;

  constructor() {
    const repo = new UserRepository();
    this.authService = new AuthService(repo);
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ message: "Email and password are required" });
        return;
      }

      const result = await this.authService.loginRequest(email, password);

      if (result.success) {
        res.cookie("refreshToken", result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        res.status(200).json({
          message: result.message,
          user: result.user,
          accessToken: result.accessToken,
        });
      } else {
        let status = 401;
        if (result.message === "Your account is blocked") status = 403;
        if (result.message === "User not found") status = 404;

        res.status(status).json({ message: result.message });
      }
    } catch (error) {
      console.error("Login error:", error);
      res.status(401).json({ message: "Invalid credentials" });

    }
  };


  refreshToken = (req: Request, res: Response): void => {
    try {
      console.log('refresh token ', req.cookies);
      const token = req.cookies.refreshToken;
      console.log('refresh token ', token);

      if (!token) {
        res.status(401).json({ message: "Refresh token required" });
        return;
      }

      jwt.verify(token, REFRESH_SECRET, (err: any, user: any) => {
        if (err) {
          res.status(403).json({ message: "Invalid refresh token" });
          return;
        }

        const newAccessToken = jwt.sign({ id: user.id }, ACCESS_SECRET, {
          expiresIn: "15m",
        });


        res.json({ accessToken: newAccessToken });
      });
    } catch (error) {
      console.log(error);

    }
  };

  logoutUser = async (req: Request, res: Response) => {
    try {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // use HTTPS in production
        sameSite: "strict",
        path: "/", // must match the cookie path you set when issuing it
      });

      return res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
  };



  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, email, password } = req.body;
      const result = await this.authService.registerRequest(name, email, password);

      if (result.success) {
        res.status(200).json(result); // OK
      } else {
        console.log('result', result);

        res.status(400).json(result); // Failure
      }
    } catch (error: any) {
      console.error("Register error:", error);
      res
        .status(400)
        .json({ success: false, message: error.message || "Registration failed" });
    }
  };


  resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({ success: false, message: "Email is required" });
        return;
      }

      await this.authService.resendOtpRequest(email);

      res.status(200).json({ success: true, message: "OTP resent successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Failed to resend OTP" });
    }
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { otp, email } = req.body;
      const result = await this.authService.verifyOtpRequest(otp, email);
      console.log(result);

      if (result.success) {
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, message: result.message });
      }
    } catch (error) {
      console.log(error);
    }
  };



  googleSignIn = async (req: AuthRequest,res: Response): Promise<void> => {
    try {
      const { token } = req.body; // frontend sends Google ID token

      if (!token) {
        res.status(400).json({ message: "Token is required" });
        return;
      }

      // Verify token with Google
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload) {
        res.status(401).json({ message: "Invalid Google token" });
        return;
      }

      const { sub, email, name, picture } = payload;

      // ✅ Check in DB if user exists or create new
      let user = await UserModel.findOne({ email });
      if (!user) {
        user = await UserModel.create({
          googleId: sub,
          name,
          email,
          profileImage: picture,
        });
      }

      // ✅ Generate JWT for session
      const accessToken = jwt.sign(
        { id: user._id, email: user.email },
        process.env.SECRET_KEY || "access_secret",
        { expiresIn: "1h" }
      );

      res.json({ token: accessToken, user });
    } catch (error) {
      console.error("Google Sign-In error:", error);
      res.status(500).json({ message: "Google Sign-In failed" });
    }
  };

}
