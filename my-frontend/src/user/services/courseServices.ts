import api from "../../api/userApi";
import type { IReport } from "../interfaces";



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


export const subscribe = async (id : string)=>{
  try {
    const res = await api.get(`/user/subscribe/${id}`)
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

export const getSubscriptionPlan = async ()=>{
  try {
    const res = await api.get('/user/getSubscriptionPlan')
    return res
  } catch (error) {
    console.log(error);
    
  }
}

export const getSubscriptionCourses = async (page:number)=>{
  try {
    const res = await api.get(`/user/getSubscriptionCourses/${page}`)
    
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const getFavouriteCourses = async ()=>{
  try {
    const res = await api.get('/user/getFavourites')
    
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const getQuiz = async (courseId : string)=>{
  try {
    const res = await api.get(`/user/quiz/${courseId}`);
    
    return res
  } catch (error) {
    console.log(error);
    
  }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const submitQuiz = async (courseId : string , quizId :string , answers : any)=>{
  try {
    const res = await api.post(`/user/quiz/${courseId}/${quizId}`, {
        answers, 
      });
    
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const updateProgress = async (courseId : string , moduleTitle : string)=>{
  try {
    const res = await api.post("/user/updateProgress", { courseId: courseId, moduleTitle });
    
    return res
  } catch (error) {
    console.log(error);
    
  }
}

export const cancelCourse = async (selectedCourseId:string)=>{
  try {
    const res = await api.delete(`/user/cancelCourse/${selectedCourseId}`);
    
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const submitReview = async (courseId : string , rating : number , reviewText : string)=>{
  try {
    
    const res = await api.post("/user/review", {
        courseId: courseId,
        rating,
        review: reviewText,
      });
    
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const addToFavourites= async (id : string)=>{
  try {    

    const res = await api.get(`/user/addtoFavourites/${id}`)
    
    return res
  } catch (error) {
    console.log(error);
    
  }
}




export const fetchFavourites= async (id:string)=>{
  try {    

    const res = await api.get(`/user/favouritesCourseDetails/${id}`)
    
    return res
  } catch (error) {
    console.log(error);
    
  }
}

export const  submitReport = async(courseId:string , report : IReport)=>{
  const res = await api.post('/user/reportCourse',{
    courseId,
    report
  })
  return res
}


export const allCourses= async (queryParams:string)=>{
  try {    

    const res = await api.get(
        `/user/getAllCourses?${queryParams.toString()}`
      );
    
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const courseDetails= async (id:string)=>{
  try {    

    const res = await api.get(`/user/courseDetails?id=${id}`);
    
    return res
  } catch (error) {
    console.log(error);
    
  }
}

export const verifyPayment = async (
  response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  },
  courseId: string
) => {
  return api.post("/user/payment/verify", {
    razorpay_payment_id: response.razorpay_payment_id,
    razorpay_order_id: response.razorpay_order_id,
    razorpay_signature: response.razorpay_signature,
    courseId,
  });
};


export const showCourses= async ()=>{
  try {    

    const res = await api.get(`/user/getCourses?page=1&limit=6`);
    
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const subscriptionVerify= async (response: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  })=>{
  try {    

    const res = await api.post("/user/paymentSubscription/verify", {
              razorpay_payment_id: response.razorpay_payment_id,
    razorpay_order_id: response.razorpay_order_id,
    razorpay_signature: response.razorpay_signature,
    
            });
    
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const refreshKey= async (key:string)=>{
  try {    

    const res = await api.get(`/user/refresh?key=${key}`);
    
    return res
  } catch (error) {
    console.log(error);
    
  }
}



export const getCertificate = async(courseId:string )=>{
    try {
        
        const res = await api.get(`/user/certificate/${courseId}`)
      return res
    } catch (error) {
        console.log(error);
        
    }
}
