import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// In-memory token management with secure fallback
let currentAccessToken: string | null = null;
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export function setAccessToken(token: string | null) {
  currentAccessToken = token;
  if (token) {
    sessionStorage.setItem('dpa_access_token', token);
  } else {
    sessionStorage.removeItem('dpa_access_token');
  }
}

export function getAccessToken(): string | null {
  if (currentAccessToken) return currentAccessToken;
  return sessionStorage.getItem('dpa_access_token');
}

export function setRefreshToken(token: string | null) {
  if (token) {
    localStorage.setItem('dpa_refresh_token', token);
  } else {
    localStorage.removeItem('dpa_refresh_token');
  }
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('dpa_refresh_token');
}

export function clearAuthTokens() {
  currentAccessToken = null;
  sessionStorage.removeItem('dpa_access_token');
  localStorage.removeItem('dpa_refresh_token');
  sessionStorage.removeItem('dpa_user');
}

// Request Interceptor: attach Bearer token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: handle 401 & token renewal
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 and request not already retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      // Don't retry login endpoint
      if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
        return Promise.reject(error);
      }

      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearAuthTokens();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post<ApiResponse<{ accessToken: string; refreshToken: string }>>(
          `${API_BASE_URL}/auth/refresh`,
          { refreshToken }
        );

        if (data.success && data.data) {
          const { accessToken, refreshToken: newRefresh } = data.data;
          setAccessToken(accessToken);
          setRefreshToken(newRefresh);

          processQueue(null, accessToken);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return api(originalRequest);
        } else {
          throw new Error('Refresh failed');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearAuthTokens();
        window.dispatchEvent(new Event('auth:unauthorized'));
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export function getProductImageUrl(imagePath: string | null | undefined): string | undefined {
  if (!imagePath) return undefined;

  const apiOrigin = new URL(API_BASE_URL).origin;
  const imageUrl = /^https?:\/\//i.test(imagePath)
    ? new URL(imagePath)
    : new URL(imagePath, apiOrigin);

  if (
    imageUrl.origin === apiOrigin &&
    imageUrl.pathname.startsWith('/uploads/product-images/')
  ) {
    return import.meta.env.DEV ? `/image-proxy${imageUrl.pathname}${imageUrl.search}` : imageUrl.toString();
  }

  return imageUrl.toString();
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiResponse | undefined;
    if (apiError?.message) return apiError.message;
    if (apiError?.errors && apiError.errors.length > 0) {
      return apiError.errors.map(e => `${e.field ? e.field + ': ' : ''}${e.message}`).join(', ');
    }
    if (error.message) return error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Ocorreu um erro inesperado na comunicaÃ§Ã£o com o servidor.';
}

