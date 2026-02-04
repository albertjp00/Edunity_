import axios,{  type AxiosInstance } from "axios";


const adminApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
  
});



adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin");
  console.log('api token',token);
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (error.response.data?.message?.toLowerCase().includes("expired")) {
        // toast.error("Your session has expired. Please log in again.");
      }
      localStorage.removeItem("admin");
      window.location.href = "/admin/login";
    }
    
    return Promise.reject(error);

  }
);

export default adminApi;
