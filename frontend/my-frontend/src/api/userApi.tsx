import axios,{ AxiosError, type AxiosInstance } from "axios";
import { toast } from "react-toastify";


const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:5000", 
  headers: {
    "Content-Type": "application/json",
  },
  
});



api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log('api token',token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (error.response.data?.message?.toLowerCase().includes("expired")) {
        toast.error("Your session has expired. Please log in again.");
      }
      localStorage.removeItem("token");
      window.location.href = "/user/login";
    }
    return Promise.reject(error);
  }
);

export default api;
