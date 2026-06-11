import axios from "axios";
import { useAuthStore } from "./store";


const BackendApi = axios.create({
  baseURL: "https://worksphere-66ln.onrender.com/",
  timeout: 5000,
});

BackendApi.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

BackendApi.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const { refreshToken, setAuth } =
          useAuthStore.getState();

        const response = await axios.post(
          "https://worksphere-66ln.onrender.com/token/refresh/",
          {
            refresh: refreshToken,
          }
        );

        const newAccessToken = response.data.access;

        setAuth(newAccessToken, refreshToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return BackendApi(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();

        console.error(
          "Session expired completely. Please log in again."
        );

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default BackendApi;