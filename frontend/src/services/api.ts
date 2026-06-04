import axios from "axios";

// Tất cả request đi qua API Gateway (port 5000)
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

// Tự động gắn JWT token vào mọi request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Xử lý lỗi toàn cục
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
