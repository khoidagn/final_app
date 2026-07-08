import axios from 'axios';
import { env } from '../configs/env';

export const apiClient = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cho phép tự động gửi kèm Cookie (nếu BE thiết lập httponly cookie cho Refresh Token)
});

// Interceptor tự động đính kèm Access Token vào Header mỗi khi gọi API
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Quản lý hàng đợi khôi phục Token khi gặp lỗi 401 hết hạn ngầm
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Khi mã phản hồi là 401 Unauthorized (Access Token hết hạn)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Thực hiện Silent Refresh: Đổi Refresh Token lấy Access Token mới
        const currentRefreshToken = localStorage.getItem('refreshToken');
        const res = await axios.post<{
          accessToken: string;
          refreshToken?: string;
        }>(
          `${env.API_BASE_URL}/auth/refresh`,
          { refreshToken: currentRefreshToken },
          { withCredentials: true }
        );

        const { accessToken, refreshToken } = res.data;

        localStorage.setItem('accessToken', accessToken);
        if (refreshToken) {
          localStorage.setItem('refreshToken', refreshToken);
        }

        apiClient.defaults.headers.common['Authorization'] =
          `Bearer ${accessToken}`;
        processQueue(null, accessToken);

        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
