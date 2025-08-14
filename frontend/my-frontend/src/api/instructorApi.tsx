import axios,{ AxiosError, type AxiosInstance } from "axios";
import { toast } from "react-toastify";


const instructorApi: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000", 
  headers: {
    "Content-Type": "application/json",
  },
  
});



instructorApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("Inst");
  console.log('api token',token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



instructorApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (error.response.data?.message?.toLowerCase().includes("expired")) {
        toast.error("Your session has expired. Please log in again.");
      }
      localStorage.removeItem("token");
      window.location.href = "/instructor/login";
    }
    return Promise.reject(error);
  }
);

export default instructorApi;
