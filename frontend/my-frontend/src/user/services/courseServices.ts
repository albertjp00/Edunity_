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


export const buyCourseService = async (courseId:string) =>{
  try {
    const res = await api.get(`/user/buyCourse/${courseId}`)
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const paymentCancel = async (courseId : string)=>{
  try {
    await api.get(`/user/cancelPayment/${courseId}`)
  } catch (error) {
    console.log(error);
    
  }
}


export const subscribe = async ()=>{
  try {
    const res = await api.get('/user/subscribe')
    return res
  } catch (error) {
    console.log(error);
    
  }
}

// export const paymentSubscriptionCancel = async ()=>{
//   try {
//     await api.get(`/user/cancelSubscriptionPayment/`)
//   } catch (error) {
//     console.log(error);
    
//   }
// }



export const getSubscription = async ()=>{
  try {
    const res = await api.get('/user/getSubscription')
    return res
  } catch (error) {
    console.log(error);
    
  }
}

export const getSubscriptionCourses = async (page:number)=>{
  try {
    const res = await api.get(`/user/getSubscriptionCourses/${page}`)
    console.log('',res);
    
    return res
  } catch (error) {
    console.log(error);
    
  }
}