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
//         const res = await api..post("http://localhost:5000/api/auth/google", {
//         token: credentialResponse.credential,
//       }, { withCredentials: true });

//         return res
//     } catch (error) {
//         console.log(error);
        
//     }
// }