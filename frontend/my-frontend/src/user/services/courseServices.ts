import api from "../../api/userApi";



export const getMyCourses = async()=>{
    try {
        const res = await api.get(`/user/myCourses`);
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


