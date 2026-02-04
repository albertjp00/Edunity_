import api from "../../api/userApi";



export const getUserProfile = async()=>{
    try {
        const res = await api.get("/user/profile");
        return res
    } catch (error) {
        console.log(error);
        
    }
}

export const getUserMyCourses = async()=>{
    try {
        const res = await api.get("/user/myCourses/1");
        return res
    } catch (error) {
        console.log(error);
        
    }
}

export const getEditProfile = async(formData : FormData)=>{
    try {
        const res =await api.patch('/user/profile',formData,
                {
                    headers: { "Content-Type": "multipart/form-data" }
                }
            );
        return res
    } catch (error) {
        console.log(error);
        
    }
}

export const userPasswordChange = async(oldPassword:string , newPassword:string)=>{
    try {
        const res =await api.put('/user/passwordChange',
        { oldPassword, newPassword })
        return res
    } catch (error ) {
        console.log(error);
        // throw error.response ? error.response : error;
    }
}



export const getPaymentHistory = async(page:number)=>{
    try {
        const res = await api.get(`/user/payment/${page}`)
        return res
    } catch (error) {
        console.log(error);
        
    }
}


export const fetchNotifications = async(page : number)=>{
    try {
        const res = await api.get(`/user/notifications/${page}`)
        return res
    } catch (error) {
        console.log(error);
        
    }
}



export const changePassword = async(oldPassword : string , newPassword:string)=>{
    try {
        const res = await api.put('/user/passwordChange',
        { oldPassword, newPassword })
        return res
    } catch (error) {
        console.log(error);
        
    }
}


export const getWallet = async()=>{
    try {
        const res = await api.get(`/user/wallet`);
        return res
    } catch (error) {
        console.log(error);
        
    }
}

export const isBlocked= async()=>{
    try {
        const res = await api.get("/user/isBlocked");
        return res
    } catch (error) {
        console.log(error);
        
    }
}



export const resendOtpProfile = async(email:string)=>{
    try {
        const res = await api.post('/user/verifyOtp', {
        email
      })
        return res
    } catch (error) {
        console.log(error);
        
    }
}

export const otpVerified = async(email:string , otp:string)=>{
    try {
        const res = await api.post('/user/verifyOtp', {
        email,
        otp
      })
        return res
    } catch (error) {
        console.log(error);
        
    }
}

