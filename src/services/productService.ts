import axiosInstance from './axiosInstance';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number;
  images: string[];
  category: { _id: string; name: string; slug: string };
  brand: string;
  stock: number;
  ratings: number;
  numReviews: number;
  ageGroup: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
}

export interface GetProductsResponse {
  success: boolean;
  total: number;
  page: number;
  pages: number;
  products: Product[];
}

export interface GetProductResponse {
  success: boolean;
  product: Product;
}

export interface GetProductsParams {
  keyword?:   string;
  category?:  string;
  minPrice?:  number;
  maxPrice?:  number;
  ageGroup?:  string;
  sort?:      'newest' | 'oldest' | 'price_low' | 'price_high' | 'top_rated';
  page?:      number;
  limit?:     number;
  featured?:  boolean;
}

const productService = {

getProducts: (params: GetProductsParams = {}) => {
  // ✅ undefined/empty values remove karo
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== '' && v !== null
    )
  );
  return axiosInstance.get<GetProductsResponse>('/user/product', {
    params: cleanParams,
  });
},
  getProduct: (id: string) =>
    axiosInstance.get<GetProductResponse>(`/user/product/${id}`),

  getProductBySlug: (slug: string) =>
    axiosInstance.get<GetProductResponse>(`/user/product/slug/${slug}`),

  getProductsByCategory: (categoryId: string) =>
    axiosInstance.get<{ success: boolean; count: number; products: Product[] }>(
      `/user/product/cat/${categoryId}`
    ),

  // ── Admin ──────────────────────────────────────────────
  createProduct: (formData: FormData) =>
    axiosInstance.post('/admin/product', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateProduct: (id: string, formData: FormData) =>
    axiosInstance.put(`/admin/product/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteProduct: (id: string) =>
    axiosInstance.delete(`/admin/product/${id}`),

};

export default productService;