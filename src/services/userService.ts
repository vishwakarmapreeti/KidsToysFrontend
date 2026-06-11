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

const userService = {
  // Admin
  getAllUsers: (params?: { page?: number; limit?: number; search?: string; role?: string }) =>
    axiosInstance.get<{ success: boolean; total: number; users: AdminUser[] }>(
      '/admin/users', { params }
    ),

  getUser: (id: string) =>
    axiosInstance.get<{ success: boolean; user: AdminUser; recentOrders: any[] }>(
      `/admin/users/${id}`
    ),

  toggleBlock: (id: string) =>
    axiosInstance.patch<{ success: boolean; message: string; user: AdminUser }>(
      `/admin/users/${id}/block`
    ),

  deleteUser: (id: string) =>
    axiosInstance.delete<{ success: boolean; message: string }>(
      `/admin/users/${id}`
    ),

  // User profile
  updateProfile: (data: { name: string; phone: string; address: any }) =>
    axiosInstance.put<{ success: boolean; user: AdminUser }>('/user/profile', data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    axiosInstance.put<{ success: boolean; message: string }>(
      '/user/profile/change-password', data
    ),
};

export default userService;