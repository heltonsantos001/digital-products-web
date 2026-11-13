import { api } from './api';
import { ApiResponse, AuditLog } from '../types';

export interface AuditQueryParams {
  page?: number;
  limit?: number;
  action?: string;
  entity?: string;
  administrator_id?: number;
}

export const auditService = {
  async list(params?: AuditQueryParams): Promise<{ logs: AuditLog[]; meta: ApiResponse['meta'] }> {
    const response = await api.get<ApiResponse<AuditLog[]>>('/admin/audit-logs', { params });
    return {
      logs: response.data.data,
      meta: response.data.meta,
    };
  },
};
