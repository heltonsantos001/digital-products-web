import { api } from './api';
import { ApiResponse, ProductCategory } from '../types';

export const categoryService = {
  async list(): Promise<ProductCategory[]> {
    const response = await api.get<ApiResponse<ProductCategory[]>>('/categories');
    return response.data.data;
  },

  async getById(id: number): Promise<ProductCategory> {
    const response = await api.get<ApiResponse<ProductCategory>>(`/categories/${id}`);
    return response.data.data;
  },

  async create(data: { name: string; slug?: string; description?: string; is_active?: boolean }): Promise<ProductCategory> {
    const response = await api.post<ApiResponse<ProductCategory>>('/categories', data);
    return response.data.data;
  },

  async update(id: number, data: { name?: string; slug?: string; description?: string; is_active?: boolean }): Promise<ProductCategory> {
    const response = await api.put<ApiResponse<ProductCategory>>(`/categories/${id}`, data);
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`/categories/${id}`);
  },
};
