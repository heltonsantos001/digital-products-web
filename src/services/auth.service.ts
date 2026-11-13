import { api, setAccessToken, setRefreshToken, clearAuthTokens } from './api';
import { ApiResponse, AuthSession, AdminUser } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    const response = await api.post<ApiResponse<AuthSession>>('/auth/login', {
      email,
      password,
    });
    const session = response.data.data;
    setAccessToken(session.accessToken);
    setRefreshToken(session.refreshToken);
    sessionStorage.setItem('dpa_user', JSON.stringify(session.admin));
    return session;
  },

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('dpa_refresh_token');
    try {
      await api.post<ApiResponse<null>>('/auth/logout', { refreshToken });
    } catch {
      // Ignora falha de rede ao deslogar
    } finally {
      clearAuthTokens();
    }
  },

  async getMe(): Promise<AdminUser> {
    const response = await api.get<ApiResponse<AdminUser>>('/auth/me');
    const admin = response.data.data;
    sessionStorage.setItem('dpa_user', JSON.stringify(admin));
    return admin;
  },

  async forgotPassword(email: string): Promise<void> {
    await api.post<ApiResponse<null>>('/auth/forgot-password', { email });
  },

  async resetPassword(token: string, password: string): Promise<void> {
    await api.post<ApiResponse<null>>('/auth/reset-password', { token, password });
  },

  getStoredUser(): AdminUser | null {
    const stored = sessionStorage.getItem('dpa_user');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
};
