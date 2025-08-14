import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.SECRET_KEY) {
  throw new Error("SECRET_KEY is not set in environment variables");
}

const secret = process.env.SECRET_KEY as string;



export interface JwtUserPayload extends JwtPayload {
  id: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: JwtUserPayload | undefined;
  file?: Express.Multer.File | undefined;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined;
}


export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ success: false, message: "No token provided" });
      return;
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      res.status(401).json({ success: false, message: "Token missing after Bearer" });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtUserPayload;
    req.user = decoded; // no casting needed now

    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};
