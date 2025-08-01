import router from "@/router";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_ROOT,
  withCredentials: true,
  timeout: 5000
})


api.interceptors.response.use(
  response => response,
  error => {

      console.log("response error", error)
    if (error.response) {
      if (error.response.status === 403 ||
          (typeof error.response.data === 'string' && error.response.data.includes("Access Denied"))) {
        router.push("/auth/access")
      }else if (error.response.status === 401) {
        // localStorage.removeItem('token')
        // localStorage.removeItem("isLogin")
        router.push("/auth/login")
      }
    }
    return Promise.reject(error);
  }
);


api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  console.log("token", token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
