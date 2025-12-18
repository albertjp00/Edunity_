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





export const getCertificate = async(courseId:string )=>{
    try {
        console.log(courseId);
        
        const res = await api.get(`/user/certificate/${courseId}`)
      return res
    } catch (error) {
        console.log(error);
        
    }
}
