import { api } from './api';
import { ApiResponse, AdminUser, Role, Permission } from '../types';

export interface CreateAdminPayload {
  name: string;
  email: string;
  password: string;
  is_super_admin?: boolean;
  roleIds?: number[];
  permissions?: Array<{ permission_id: number; is_granted: boolean }>;
}

export interface UpdateAdminPayload {
  name?: string;
  email?: string;
  password?: string;
  status?: 'active' | 'inactive' | 'suspended';
  roleIds?: number[];
  permissions?: Array<{ permission_id: number; is_granted: boolean }>;
}

export const adminService = {
  async listAdmins(page = 1, limit = 20): Promise<{ admins: AdminUser[]; meta: ApiResponse['meta'] }> {
    const response = await api.get<ApiResponse<AdminUser[]>>('/admin/administrators', {
      params: { page, limit },
    });
    return {
      admins: response.data.data,
      meta: response.data.meta,
    };
  },

  async getAdminById(id: number): Promise<AdminUser> {
    const response = await api.get<ApiResponse<AdminUser>>(`/admin/administrators/${id}`);
    return response.data.data;
  },

  async createAdmin(data: CreateAdminPayload): Promise<AdminUser> {
    const response = await api.post<ApiResponse<AdminUser>>('/admin/administrators', data);
    return response.data.data;
  },

  async updateAdmin(id: number, data: UpdateAdminPayload): Promise<AdminUser> {
    const response = await api.put<ApiResponse<AdminUser>>(`/admin/administrators/${id}`, data);
    return response.data.data;
  },

  async deleteAdmin(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`/admin/administrators/${id}`);
  },

  async listRoles(): Promise<Role[]> {
    const response = await api.get<ApiResponse<Role[]>>('/admin/roles');
    return response.data.data;
  },

  async getRoleById(id: number): Promise<Role & { permissions?: Permission[] }> {
    const response = await api.get<ApiResponse<Role & { permissions?: Permission[] }>>(`/admin/roles/${id}`);
    return response.data.data;
  },

  async createRole(data: { name: string; display_name: string; description?: string; permissionIds?: number[] }): Promise<Role> {
    const response = await api.post<ApiResponse<Role>>('/admin/roles', data);
    return response.data.data;
  },

  async updateRole(id: number, data: { display_name?: string; description?: string; permissionIds?: number[] }): Promise<Role> {
    const response = await api.put<ApiResponse<Role>>(`/admin/roles/${id}`, data);
    return response.data.data;
  },

  async deleteRole(id: number): Promise<void> {
    await api.delete<ApiResponse<null>>(`/admin/roles/${id}`);
  },

  async listPermissions(): Promise<Permission[]> {
    const response = await api.get<ApiResponse<Permission[]>>('/admin/permissions');
    return response.data.data;
  },
};
