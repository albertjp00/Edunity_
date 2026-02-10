import axios,{  type AxiosInstance } from "axios";

const api_url = import.meta.env.VITE_API_URL

const instructorApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});



instructorApi.interceptors.request.use((config) => {
  const token  : string | undefined = localStorage.getItem("instructor") ?? '';
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


const refreshInstructorAccessToken = async () => {
  try {
    const res = await axios.post(
      `${api_url}/instructor/refresh-token`,
      {},
      { withCredentials: true }
    );    

    const newAccessToken = res.data.accessToken;
    localStorage.setItem("instructor", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.log(error);
    
    return null;
  }
};



instructorApi.interceptors.response.use(

  (response) => response,
  async (error) => {

    const originalRequest = error.config;
    if (
      originalRequest.url?.includes("/instructor/login") ||
      originalRequest.url?.includes("/instructor/register")
    ) {
      return Promise.reject(error);
    }    

    if (
      originalRequest.url?.includes("/instructor/login") ||
      originalRequest.url?.includes("/instructor/register")
    ) {
      return Promise.reject(error);
    }
    if (error.response?.status === 401&& !originalRequest._retry) {

      const newAccessToken = await refreshInstructorAccessToken();
      
      if(newAccessToken){
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return instructorApi(originalRequest);
      }
      else{
      localStorage.removeItem("instructor");
      window.location.href = "/instructor/login";
      }
    }
    return Promise.reject(error);
  }
);

export default instructorApi;
