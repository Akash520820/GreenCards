import axios from "axios";

// The backend issues httpOnly cookies (accessToken/refreshToken), so every
// request must go out with credentials: true. Set VITE_API_URL in your .env
// to point at wherever the ecommerce-backend is running, e.g.
// http://localhost:8000/api/v1
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshQueue = [];

const processQueue = (error) => {
  refreshQueue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve()));
  refreshQueue = [];
};

// If an access token expires mid-session, transparently hit /users/refresh-token
// (which reads the refreshToken cookie) once, then replay the original request.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/users/login") &&
      !originalRequest.url?.includes("/users/refresh-token")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post("/users/refresh-token");
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Every controller responds via ApiResponse: { statusCode, data, message, success }
// This helper unwraps that envelope and normalizes errors to a plain message string.
export const unwrap = (axiosPromise) =>
  axiosPromise
    .then((res) => res.data)
    .catch((err) => {
      const message =
        err.response?.data?.message || err.message || "Something went wrong. Please try again.";
      throw new Error(message);
    });

export default api;
