import { api } from './api';
import { ApiResponse, Product, ProductFile } from '../types';

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category_id?: number;
  status?: 'active' | 'inactive' | 'archived';
  product_type?: string;
  sort_by?: 'created_at' | 'price' | 'name';
  sort_order?: 'asc' | 'desc';
}

export const productService = {
  async list(params?: ProductQueryParams): Promise<{ products: Product[]; meta: ApiResponse['meta'] }> {
    const response = await api.get<ApiResponse<Product[]>>('/products', { params });
    return {
      products: response.data.data,
      meta: response.data.meta,
    };
  },

  async getById(id: number): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  async getBySlug(slug: string): Promise<Product> {
    const response = await api.get<ApiResponse<Product>>(`/products/slug/${slug}`);
    return response.data.data;
  },

  async create(formData: FormData): Promise<Product> {
    const response = await api.post<ApiResponse<Product>>('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async update(id: number, data: Partial<Product>): Promise<Product> {
    const response = await api.put<ApiResponse<Product>>(`/products/${id}`, data);
    return response.data.data;
  },

  async uploadImage(id: number, file: File): Promise<Product> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<ApiResponse<Product>>(`/products/${id}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data;
  },
  async uploadFile(id: number, file: File): Promise<ProductFile> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<ApiResponse<ProductFile>>(`/products/${id}/file`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`/products/${id}`);
  },

  async getFiles(id: number): Promise<ProductFile[]> {
    const response = await api.get<ApiResponse<ProductFile[]>>(`/products/${id}/files`);
    return response.data.data;
  },
};
