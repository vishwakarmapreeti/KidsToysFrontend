import axiosInstance from './axiosInstance';

export interface AdminUser {
  _id:       string;
  name:      string;
  email:     string;
  phone?:    string;
  role:      'user' | 'admin';
  isActive:  boolean;
  isVerified: boolean;
  createdAt: string;
  address?: {
    street:  string;
    city:    string;
    state:   string;
    pincode: string;
    country: string;
  };
}

const userManagementService = {
  getAllUsers: (params?: { page?: number; limit?: number; search?: string; role?: string }) =>
    axiosInstance.get<{ success: boolean; total: number; users: AdminUser[] }>(
      '/admin/users', { params }
    ),

  getUser: (id: string) =>
    axiosInstance.get<{ success: boolean; user: AdminUser; totalOrders: number; totalSpent: number }>(
      `/admin/users/${id}`
    ),

  toggleBlock: (id: string) =>
    axiosInstance.patch<{ success: boolean; message: string; user: AdminUser }>(
      `/admin/users/${id}/block`
    ),

  updateRole: (id: string, role: string) =>
    axiosInstance.patch<{ success: boolean; user: AdminUser }>(
      `/admin/users/${id}/role`, { role }
    ),

  deleteUser: (id: string) =>
    axiosInstance.delete<{ success: boolean; message: string }>(
      `/admin/users/${id}`
    ),
};

export default userManagementService;