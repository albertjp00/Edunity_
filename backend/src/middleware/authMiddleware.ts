import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserModel } from "../models/user";
import { InstructorModel } from "../models/instructor";

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


export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
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
    req.user = decoded;

    const user = await UserModel.findById(decoded.id)
    if(!user){
      res.json({success:false , message : 'user not found'})
      return
    }

    if(user.blocked){
      res.status(403).json({ success: false, message: "Your account has been blocked" });
      return;
    }

    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
}
 

export interface InstAuthRequest extends Request {
  instructor?: JwtPayload | undefined;
  file?: Express.Multer.File | undefined;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined;
}

export interface AdminAuthRequest extends Request {
  admin?: JwtUserPayload;
  file?: Express.Multer.File | undefined;
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | undefined; 
}


export interface SocketAuthRequest {
  user? : JwtUserPayload;
  instructor : JwtPayload;
}

export const instAuthMiddleware = (
  req: InstAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  console.log("instAuthMiddleware");

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Unauthorized: Token missing after Bearer" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret); 
    req.instructor = decoded as JwtPayload | undefined;
      next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};




export const adminAuthMiddleware = (
  req: AdminAuthRequest,
  res: Response,
  next: NextFunction
): void => {
  console.log("adminAuthMiddleware");

  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    res
      .status(401)
      .json({ message: "Unauthorized: Token missing after Bearer" });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtUserPayload;

    if (decoded.role !== "admin") {
      res.status(403).json({ message: "Forbidden: Not an admin" });
      return;
    }

    req.admin = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};




//socket authentication 



export const verifySocketToken = async (token: string) => {
  const decoded = jwt.verify(token, secret) as { id: string };

  const user = await UserModel.findById(decoded.id);
  if (user) {
    if (user.blocked) throw new Error("Your account has been blocked");
    return { id: user._id.toString(), name: user.name, role: "user" };
  }

  const instructor = await InstructorModel.findById(decoded.id);
  if (instructor) {
    return { id: instructor._id.toString(), name: instructor.name, role: "instructor" };
  }

  throw new Error("Account not found");
};








interface JwtPayload {
  id: string;
  email: string;
  role?: string;
}



