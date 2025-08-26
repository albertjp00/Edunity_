import api from "../../api/userApi";



export const getEvents = async()=>{
    try {
        const res = await api.get(`/user/events`);
        console.log('rseult ',res);
        
        return res
    } catch (error) {
        console.log(error);
        
    }
}