import api from "../../api/userApi";



export const getMyCourses = async(page:number = 1)=>{
    try {
        const res = await api.get(`/user/myCourses/${page}`);
        return res
    } catch (error) {
        console.log(error);
        
    }
}


export const viewMyCourse = async(id:string)=>{
    try {
        const res = await api.get(`/user/viewMyCourse/${id}`);
        return res
    } catch (error) {
        console.log(error);
        
    }
}


export const getAllCourses = async (page: number, limit: number) => {
  try {
    const response = await api.get(`/user/getAllCourses?${new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })}`);
    console.log(response);
    
    return response.data;  // { courses, totalCount }
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};



export const paymentCancel = async (courseId : string)=>{
  try {
    await api.get(`/user/cancelPayment/${courseId}`)
  } catch (error) {
    console.log(error);
    
  }
}