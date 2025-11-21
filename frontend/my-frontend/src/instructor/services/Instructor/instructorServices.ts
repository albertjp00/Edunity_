import instructorApi from "../../../api/instructorApi"
import type { Ievent } from "../../interterfaces/events";




//course services 

export const getCourses = async (query : string , page : number) => {
  try {
    const res = await instructorApi.post(`/instructor/getCourse`,
      { query, page },
    )
    
    return res
  } catch (error) {
    console.log(error);

  }
}


export const addCourse = async (formData: FormData) => {
  try {
    const res = await instructorApi.post('/instructor/course', formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return res
  } catch (error) {
    console.log(error);

  }
}

export const getCourseDetails = async (id: string | undefined) => {
  try {
    const res = await instructorApi.get(`/instructor/course/${id}`);
    return res
  } catch (error) {
    console.log(error);

  }
}

 
//kycSubmit

export const kycSubmit = async (formData: FormData) => {
  try {
    const res = await instructorApi.post('/instructor/kycSubmit',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    return res
  } catch (error) {
    console.log(error);
  }
}




export const addEvent = async (formData: Ievent) => {


  try {
    const res = await instructorApi.post('/instructor/event', {
      formData
    })
    return res
  } catch (error) {
    console.log(error);
  }
}


export const getMyEventsHomePage = async () => {
  try {
    const query = ''
    const page = 1
    const res = await instructorApi.get(`/instructor/event`, {
      params: { query, page },
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





