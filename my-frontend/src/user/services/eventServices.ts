import api from "../../api/userApi";

export const getMyEvents = async()=>{
    try {
        const res = await api.get("/user/myEvents");        
        return res
    } catch (error) {
        console.log(error);
        
    }
}



export const getEvents = async(search : string , page : number)=>{
    try {
        const res = await api.post(`/user/events`,{
            search , page
        });
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



export const eventJoin = async(eventId : string)=>{
    try {
        const res = await api.get(`/user/joinEvent/${eventId}`);
        return res
    } catch (error) {
        console.log(error);
        
    }
}
