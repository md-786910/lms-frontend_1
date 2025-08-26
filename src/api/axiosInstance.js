import axios from "axios";
import { toast } from "sonner";

// Base URL management
const API_BASE = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${API_BASE}/api/v1/"`;
console.log({ API_BASE_URL });

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // if your backend supports cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Bearer Token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Global error handling
axiosInstance.interceptors.response.use(
  (response) => {
    const status = response.status;
    const method = response.config.method;
    if ((status === 200 || status === 201) && method !== "get") {
      toast.success(response.data?.message);
    }
    return response;
  },
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    if (status === 403) {
      toast.error("You do not have permission to perform this action.");
    }

    if (status === 404 || status === 400) {
      toast.error(
        error.response?.data?.message ||
          error.response?.message ||
          "Resource not found."
      );
    }

    if (status >= 500) {
      console.error("Server error:", error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
