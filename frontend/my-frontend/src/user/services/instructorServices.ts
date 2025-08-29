import api from "../../api/userApi";

export const getUserInstructors = async()=>{
    try {
        const res = await api.get('/user/getInstructors')
        return res
    } catch (error) {
        console.log(error);
        throw error
    }
}