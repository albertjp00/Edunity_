import api from "../../api/userApi";


export const getInstructors= async()=>{
    try {
        const res = await api.get('/user/getinstructors')
        return res
    } catch (error) {
        console.log(error);
    }
}


export const getUserInstructors = async()=>{
    try {
        const res = await api.get('/user/getInstructors')
        return res
    } catch (error) {
        console.log(error);
        throw error
    }
}




export const getMessages = async(userId:string , receiverId:string)=>{
    try {
        const res = await api.get(`/user/messages/${userId}/${receiverId}`)
        return res
    } catch (error) {
        console.log(error);
        
    }
}

export const sendMessagesToInstructor = async(formData : FormData)=>{
    try {
        const res = await api.post("/user/chat", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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