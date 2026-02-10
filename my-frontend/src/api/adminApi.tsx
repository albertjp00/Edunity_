import axios, { type AxiosInstance } from "axios";

const api_url = import.meta.env.VITE_API_URL;

const adminApi: AxiosInstance = axios.create({
  baseURL: api_url,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


const refreshAdminAccessToken = async () => {
  try {
    const res = await axios.post(
      `${api_url}/admin/refreshToken`,
      {},
      { withCredentials: true }
    );    

    const newAccessToken = res.data.accessToken;
    localStorage.setItem("admin", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.log(error);
    
    return null;
  }
};


adminApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for login/register
    if (
      originalRequest.url?.includes("/admin/login") ||
      originalRequest.url?.includes("/admin/register")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAdminAccessToken();

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return adminApi(originalRequest);
      } else {
        localStorage.removeItem("admin");
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  }
);

export default adminApi;
