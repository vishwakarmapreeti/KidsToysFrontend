export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
}

export interface ApiError {
  message: string;
  status?: number;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number;
  images: string[];
  category: Category | string;
  brand: string;
  stock: number;
  ratings: number;
  numReviews: number;
  ageGroup: string;
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
}
