import { api } from './api';
import { ApiResponse, SystemSetting } from '../types';

export const settingsService = {
  async getAll(): Promise<SystemSetting[]> {
    const response = await api.get<ApiResponse<SystemSetting[]>>('/admin/settings');
    return response.data.data;
  },

  async update(settings: Array<{ key: string; value: string }>): Promise<SystemSetting[]> {
    const response = await api.put<ApiResponse<SystemSetting[]>>('/admin/settings', { settings });
    return response.data.data;
  },
};
