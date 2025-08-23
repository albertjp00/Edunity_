import instructorApi from "../../api/instructorApi"





export const addEvent = async(data :any )=>{
    
    try {
        const res = await instructorApi.post('/instructor/addEvent',{
        data
    })
    
    return res
    } catch (error) {
        console.log(error);
        
    }
}