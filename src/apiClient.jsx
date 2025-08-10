import axios from "axios";
import { baseURL } from "utils/Url";

const apiClient = axios.create({
  baseURL,
  
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// 🔧 Düzəliş: Dinamik Content-Type
apiClient.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("authToken");

    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    } else {
      
      throw new axios.Cancel("Request canceled: User is not logged in.");
    }

    // Yalnız JSON üçün Content-Type əlavə et
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
       
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");

        if (window.location.pathname !== "/authentication/sign-in/basic") {
          window.location.href = "/authentication/sign-in/basic";
        }

        return Promise.reject(error);
      }

      try {
       
        const { data } = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              refreshToken: localStorage.getItem("refreshToken"),
            },
          }
        );

       

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);

        processQueue(null, data.token);

        apiClient.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        originalRequest.headers["Authorization"] = `Bearer ${data.token}`;

        return apiClient(originalRequest);
      } catch (refreshError) {
        

        processQueue(refreshError, null);

        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");

        if (window.location.pathname !== "/authentication/sign-in/basic") {
          window.location.href = "/authentication/sign-in/basic";
        }

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
