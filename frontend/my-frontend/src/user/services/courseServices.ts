import api from "../../api/userApi";



export const getMyCourses = async()=>{
    try {
        const res = await api.get(`/user/myCourses`);
        return res
    } catch (error) {
        console.log(error);
        
    }
}


export const viewMyCourse = async(id:string)=>{
    try {
        const res = await api.get(`/user/viewMyCourse/${id}`);
        return res
    } catch (error) {
        console.log(error);
        
    }
}

