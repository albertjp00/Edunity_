import api from "../../api/userApi";



export const getInstructors= async()=>{
    try {
        const res = await api.get('/user/getinstructors')
        return res
    } catch (error) {
        console.log(error);
    }
}


//chatWindow 

export const getMessages = async(userId:string , receiverId:string)=>{
    try {
        const res = await api.get(`/user/messages/${userId}/${receiverId}`)
        return res
    } catch (error) {
        console.log(error);
        
    }
}

export const getMessagedInstructors = async()=>{
    try {
        const res = await api.get("/user/messagedInstructors");
        return res
    } catch (error) {
        console.log(error);
        
    }
}

export const toMessageInstructor = async(id:string)=>{
    try {
        const res = await api.get(`/user/instructor/${id}`);
        return res
    } catch (error) {
        console.log(error);
        
    }
}


export const getCertificate = async(courseId:string )=>{
    try {
        console.log(courseId);
        
        const res = await api.get(`/user/certificate/${courseId}`)
      return res
    } catch (error) {
        console.log(error);
        
    }
}
