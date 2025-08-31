import { IUser } from "../models/user.js";



export interface LoginResult {
  success: boolean;
  message: string;
  user?: any;
  accessToken?: string;
  refreshToken?: string;
}


export interface googleLoginResult{
     accessToken: string;
     refreshToken : string ; 
     user: IUser;
}