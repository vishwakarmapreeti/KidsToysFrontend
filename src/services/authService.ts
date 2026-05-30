import axiosInstance from './axiosInstance';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  adminSecret?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: AuthUser;
  token?: string;
}

const authService = {

  register: (data: RegisterData) =>
    axiosInstance.post<AuthResponse>('/user/auth/register', data),

  login: (data: LoginData) =>
    axiosInstance.post<AuthResponse>('/user/auth/login', data),

  logout: () =>
    axiosInstance.post<{ success: boolean; message: string }>('/user/auth/logout'),

  getMe: () =>
    axiosInstance.get<{ success: boolean; user: AuthUser }>('/user/auth/me'),

  forgotPassword: (data: ForgotPasswordData) =>
    axiosInstance.post<AuthResponse>('/user/auth/forgot-password', data),

  resetPassword: (data: ResetPasswordData) =>
    axiosInstance.put<AuthResponse>(`/user/auth/reset-password/${data.token}`, {
      password: data.password,
    }),

  verifyEmail: (token: string) =>
    axiosInstance.get<AuthResponse>(`/user/auth/verify-email/${token}`),
};

export default authService;
