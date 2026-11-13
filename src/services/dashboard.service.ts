import { api } from './api';
import { ApiResponse, DashboardData } from '../types';

export const dashboardService = {
  async getOverview(): Promise<DashboardData> {
    const response = await api.get<ApiResponse<DashboardData>>('/admin/dashboard');
    return response.data.data;
  },
};
