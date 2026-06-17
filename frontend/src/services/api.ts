import axios from "axios";

// API Gateway chạy trên port 3000 (qua Docker)
// Khi develop local có thể dùng port trực tiếp của từng service
const API_GATEWAY = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";
const HOTEL_SERVICE = process.env.NEXT_PUBLIC_HOTEL_URL ?? "http://localhost:3004";
const BOOKING_SERVICE = process.env.NEXT_PUBLIC_BOOKING_URL ?? "http://localhost:3003";
const AUTH_SERVICE = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3001";
const PAYMENT_SERVICE = process.env.NEXT_PUBLIC_PAYMENT_URL ?? "http://localhost:3006";
const SEARCH_SERVICE = process.env.NEXT_PUBLIC_SEARCH_URL ?? "http://localhost:3008";

function makeClient(baseURL: string) {
  const client = axios.create({ baseURL, timeout: 10000 });
  client.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  client.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401 && typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      return Promise.reject(err);
    }
  );
  return client;
}

// Client chính qua API Gateway
const api = makeClient(API_GATEWAY);

// Client riêng từng service (dùng khi gateway chưa proxy)
export const hotelApi = makeClient(HOTEL_SERVICE);
export const bookingApi = makeClient(BOOKING_SERVICE);
export const authApi = makeClient(AUTH_SERVICE);
export const paymentApi = makeClient(PAYMENT_SERVICE);
export const searchApi = makeClient(SEARCH_SERVICE);

export default api;
