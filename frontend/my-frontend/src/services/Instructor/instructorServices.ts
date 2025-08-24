import instructorApi from "../../api/instructorApi"





export const addEvent = async(formData :any )=>{
    try {
        const res = await instructorApi.post('/instructor/event',{
        formData
    })
    return res
    } catch (error) {
        console.log(error);
    }
}

export const getMyEvents = async()=>{
    try {
        const res = await instructorApi.get('/instructor/event')
        return res
    } catch (error) {
        console.log(error);
    }
}



