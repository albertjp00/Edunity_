import api from "../../api/userApi";



export const getInstructors= async()=>{
    try {
        const res = await api.get('/user/getinstructors')
        return res
    } catch (error) {
        console.log(error);
    }
}