import { api } from './api';
import { ApiResponse, DigitalDelivery } from '../types';

export const deliveryService = {
  async list(params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<{ deliveries: DigitalDelivery[]; meta: ApiResponse['meta'] }> {
    const response = await api.get<ApiResponse<DigitalDelivery[]>>('/admin/deliveries', { params });
    return {
      deliveries: response.data.data,
      meta: response.data.meta,
    };
  },

  async getById(id: number): Promise<DigitalDelivery> {
    const response = await api.get<ApiResponse<DigitalDelivery>>(`/admin/deliveries/${id}`);
    return response.data.data;
  },

  async resend(id: number): Promise<DigitalDelivery> {
    const response = await api.post<ApiResponse<DigitalDelivery>>(`/admin/deliveries/${id}/resend`);
    return response.data.data;
  },

  getDownloadUrl(token: string): string {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
    return `${baseUrl}/downloads/${token}`;
  }
};
