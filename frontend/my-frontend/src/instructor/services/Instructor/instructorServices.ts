import instructorApi from "../../../api/instructorApi"
import api from "../../../api/userApi";
import type { RegisterForm } from "../../components/authentication/instructorRegister";
import type { Ievent } from "../../interterfaces/events";
import type { QuizData, QuizPayload } from "../../interterfaces/instructorInterfaces";




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


export const  forgotPassword = async (email:string)=>{
  try {
    const res = await api.post("/instructor/forgotPassword", { email });
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const instructorRegister  = async (formData : RegisterForm)=>{
  try {
    const res = await instructorApi.post("/instructor/register", formData);
    return res
  } catch (error) {
    console.log(error);
    
  }
}



export const verifyOtp  = async (email :  string , otp:string)=>{
  try {
    const res = await api.post('/instructor/verifyOtp', {
        email,
        otp
      })
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const resendOtpRequest  = async (email :  string)=>{
  try {
    const res = await api.post('/instructor/resendOtp',{email})
    return res
  } catch (error) {
    console.log(error);
    
  }
}

export const resetPasswordRequest  = async (email :  string , otp :string)=>{
  try {
    const res = await api.post("/instructor/otpVerify", { email, otp });
    return res
  } catch (error) {
    console.log(error);
    
  }
}

export const resendOtpForgotPass =  async (email :  string)=>{
  try {
    const res = await api.post("/instructor/resendOtpForgotPass", { email });
    return res
  } catch (error) {
    console.log(error);
    
  }
}

export const getMessages =  async (receiverId:string)=>{
  try {
    const res = await instructorApi.get(`/instructor/messages/${receiverId}`);
    return res
  } catch (error) {
    console.log(error);
    
  }
}



export const sendMessages =  async (receiverId:string , formData : FormData)=>{
  try {
    const res = await instructorApi.post(`/instructor/sendMessage/${receiverId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    return res
  } catch (error) {
    console.log(error);
    
  }
}

export const fetchMessagedStudents =  async ()=>{
  try {
    const res = await instructorApi.get("/instructor/getMessagedStudents");
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const getCourse =  async ()=>{
  try {
    const res = await instructorApi.get("/instructor/getCourse");
    return res
  } catch (error) {
    console.log(error);
    
  }
}

export const getEarnings =  async ()=>{
  try {
    const res = await instructorApi.get('/instructor/earnings')
    return res
  } catch (error) {
    console.log(error);
    
  }
}

export const getStats =  async ()=>{
  try {
    const res = await instructorApi.get("/instructor/dashboard");
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const editCourse =  async (id:string , formData : FormData)=>{
  try {
    const res = await instructorApi.patch(`/instructor/course/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const purchaseDetails =  async (id:string)=>{
  try {
    const res = await api.get(`/instructor/purchaseDetails/${id}`);
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const notificationMarkAsRead =  async (id:string)=>{
  try {
    const res = await instructorApi.patch(`/instructor/notifications/${id}/read`);
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const getNotification =  async ()=>{
  try {
    const res = await instructorApi.get(`/instructor/notifications`);
    return res
  } catch (error) {
    console.log(error);
    
  }
}

export const profileEdit =  async (formData:FormData)=>{
  try {
    const res = await instructorApi.put('/instructor/profile', formData,{
        headers: {
    "Content-Type": "multipart/form-data",
  },
      });
    return res
  } catch (error) {
    console.log(error);
    
  }
}

export const fetchProfile =  async ()=>{
  try {
    const res = await instructorApi.get('/instructor/profile');
    return res
  } catch (error) {
    console.log(error);
    
  }
}

export const getWallet =  async ()=>{
  try {
    const res = await instructorApi.get('/instructor/wallet');
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const addQuiz =  async (id:string , payload:QuizPayload)=>{
  try {
    const res = await instructorApi.post(`/instructor/addQuiz/${id}`, payload);
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const getQuiz =  async (courseId : string)=>{
  try {
    const res = await instructorApi.get(`/instructor/quiz/${courseId}`);
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const quizSave =  async (quizId : string , quiz:QuizData)=>{
  try {
    const res = await instructorApi.put(`/instructor/quiz/${quizId}`, quiz);
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const refreshVideo =  async (key:string)=>{
  try {
    const res = await instructorApi.get(`/instructor/videos/refresh?key=${key}`);
    return res
  } catch (error) {
    console.log(error);
    
  }
}


export const getCategory =  async ()=>{
  try {
    const res = await instructorApi.get(`/instructor/getCategory`);
    return res
  } catch (error) {
    console.log(error);
    
  }
}


