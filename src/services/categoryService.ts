import axiosInstance from './axiosInstance';

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
}

export interface GetCategoriesResponse {
  success: boolean;
  count: number;
  categories: Category[];
}

const categoryService = {

  // ── Public ─────────────────────────────────────────────
  getCategories: () =>
    axiosInstance.get<GetCategoriesResponse>('/user/category'),

  getCategory: (id: string) =>
    axiosInstance.get<{ success: boolean; category: Category }>(
      `/user/category/${id}`
    ),

  // ── Admin ──────────────────────────────────────────────
  createCategory: (formData: FormData) =>
    axiosInstance.post('/admin/category', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateCategory: (id: string, formData: FormData) =>
    axiosInstance.put(`/admin/category/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteCategory: (id: string) =>
    axiosInstance.delete(`/admin/category/${id}`),

};

export default categoryService; 