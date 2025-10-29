import instructorApi from "../../api/instructorApi"





export const addEvent = async(formData : FormData )=>{
    try {
        const res = await instructorApi.post('/instructor/event',{
        formData
    })
    return res
    } catch (error) {
        console.log(error);
    }
}


export const getMyEventsHomePage = async()=>{
    try {
        const query  = ''
        const page = 1
        const res = await instructorApi.get(`/instructor/event`, {
      params: { query , page },
    })
        return res
    } catch (error) {
        console.log(error);
    }
}


export const getMyEvents = async (search = "", page = 1) => {
  try {
    const res = await instructorApi.get(`/instructor/allEvents`, {
      params: { query: search, page },
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};





