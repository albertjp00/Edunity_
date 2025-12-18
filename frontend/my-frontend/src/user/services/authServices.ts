import axios from "axios";
import api from "../../api/userApi";
import type { IRegister, IUser } from "../interfaces";



export const login = async(value:IUser)=>{
    try {
        const res = await api.post("/user/login", value);
        return res
    } catch (error) {
        console.log(error);
        
    }
}


export const logout = async()=>{
    try {
        const res = await api.post("/user/logout");
        return res
    } catch (error) {
        console.log(error);
        
    }
}


export const userRegister = async(formData:IRegister)=>{
    try {
        const res = await api.post("/user/register",formData);
        console.log('result',res);
        
        return res
    } catch (error) {
        console.log(error);
        throw error
    }
}




export const userVerifyOtp = async(email:string , otp:string)=>{
    try {
        const res = await api.post("/user/register",{
            email,
            otp
        });
        return res
    } catch (error) {
        console.log(error);
        
    }
}



// export const googleLogin = async(email:string , otp:string)=>{
//     try {
//         const res = await api..post(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
//         token: credentialResponse.credential,
//       }, { withCredentials: true });

//         return res
//     } catch (error) {
//         console.log(error);
        
//     }
// }


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const googleLogin = async(credentialResponse:any)=>{
    try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/auth/googleLogin`, {
              token: credentialResponse.credential,
            }, { withCredentials: true });
        return res
    } catch (error) {
        console.log(error);
        
    }
}


export const forgotPassword = async(email:string)=>{
    try {
        const res = await api.post("/user/forgotPassword", { email });
        return res
    } catch (error) {
        console.log(error);
        
    }
}