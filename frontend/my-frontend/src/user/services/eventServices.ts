import api from "../../api/userApi";

export const getMyEvents = async()=>{
    try {
        const res = await api.get("/user/myEvents");        
        return res
    } catch (error) {
        console.log(error);
        
    }
}



export const getEvents = async()=>{
    try {
        const res = await api.get(`/user/events`);
        console.log('rseult ',res);
        
        return res
    } catch (error) {
        console.log(error);
        
    }
}


export const getDetailsEvent = async(id:string)=>{
    try {
        const res = await api.get(`/user/event/${id}`);
        return res
    } catch (error) {
        console.log(error);
        
    }
}


export const eventEnroll = async(id:string)=>{
    try {
        const res = await api.get(`/user/eventEnroll/${id}`);
        return res
    } catch (error) {
        console.log(error);
        
    }
}


