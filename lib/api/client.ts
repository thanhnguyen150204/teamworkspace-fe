import axios from "axios";
import { setCookie, deleteCookie } from "@/lib/cookies";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue: Array<{
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (token) resolve(token);
        else reject(error);
    });
    failedQueue = [];
};

apiClient.interceptors.response.use(
    (response) => {
        return response.data.data;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }
        if (originalRequest._retry) {
            return Promise.reject(error);
        }
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return apiClient(originalRequest);
            });
        }
        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            deleteCookie("access_token");
            window.location.href = "/auth/login";
            return Promise.reject(error);
        }

        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                { refresh_token: refreshToken }
            );

            const newAccessToken = response.data.data.access_token;
            localStorage.setItem("access_token", newAccessToken);
            setCookie("access_token", newAccessToken);
            processQueue(null, newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return apiClient(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError, null);
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            deleteCookie("access_token");
            window.location.href = "/auth/login";

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default apiClient;
