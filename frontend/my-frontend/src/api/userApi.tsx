import axios, { type AxiosInstance } from "axios";
import { toast } from "react-toastify";

const api_url = import.meta.env.VITE_API_URL

// const ngrok_api_url = import.meta.env.VITE_NGROK_API_URL

const api: AxiosInstance = axios.create({
  baseURL: api_url,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});



// Attach access token before each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});



const refreshAccessToken = async () => {
  try {
    const res = await axios.post(
      `${api_url}/user/refresh-token`,
      {},
      { withCredentials: true } 
    );
    console.log('refresh token',res.data);
    
    localStorage.setItem("token", res.data.accessToken);
    return res.data.accessToken;
  } catch {
    return null;
  }
};




// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      originalRequest.url?.includes("/user/login") ||
      originalRequest.url?.includes("/user/register")
    ) {
      return Promise.reject(error);
    }

    // Access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } else {
        // Refresh failed - log out
        toast.error("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/user/login";
      }
    }

    // Case 2: Blocked user or other auth error
    if (error.response?.status === 403) {
      toast.warning("Your account has been blocked. Contact support.");
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/user/login";
    }

    return Promise.reject(error);
  }
);

export default api;
