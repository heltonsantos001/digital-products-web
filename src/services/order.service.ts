import { api } from './api';
import { ApiResponse, CheckoutInput, CheckoutResult, PublicOrder, Order } from '../types';

export interface OrderQueryParams {
  page?: number;
  limit?: number;
  status?: string;
  payment_status?: string;
  customer_id?: number;
  search?: string;
  from_date?: string;
  to_date?: string;
}

export const orderService = {
  // Public Storefront Checkout
  async checkout(input: CheckoutInput): Promise<CheckoutResult> {
    const response = await api.post<ApiResponse<CheckoutResult>>('/checkout', input);
    return response.data.data;
  },

  // Public Order Status Polling
  async getPublicOrder(uuid: string): Promise<PublicOrder> {
    const response = await api.get<ApiResponse<PublicOrder>>(`/checkout/orders/${uuid}`);
    return response.data.data;
  },

  // Admin Sales / Orders
  async list(params?: OrderQueryParams): Promise<{ orders: Order[]; meta: ApiResponse['meta'] }> {
    const response = await api.get<ApiResponse<Order[]>>('/admin/orders', { params });
    return {
      orders: response.data.data,
      meta: response.data.meta,
    };
  },

  async getById(id: number): Promise<Order> {
    const response = await api.get<ApiResponse<Order>>(`/admin/orders/${id}`);
    return response.data.data;
  },

  async updateStatus(id: number, status: string, reason?: string): Promise<Order> {
    const response = await api.put<ApiResponse<Order>>(`/admin/orders/${id}/status`, {
      status,
      reason,
    });
    return response.data.data;
  },
};
