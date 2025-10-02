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
        const res = await api.get("/user/myCourses");
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