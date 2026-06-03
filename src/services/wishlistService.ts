import axiosInstance from './axiosInstance';

export interface WishlistProduct {
  _id:           string;
  name:          string;
  images:        string[];
  price:         number;
  discountPrice: number;
  ratings:       number;
  stock:         number;
  slug:          string;
  brand:         string;
  category?:     { name: string } | string;
  description?:  string;
}

const wishlistService = {
  getWishlist: () =>
    axiosInstance.get<{ success: boolean; wishlist: { products: WishlistProduct[] } }>(
      '/user/wishlist'
    ),

  toggle: (productId: string) =>
    axiosInstance.post<{ success: boolean; message: string; added: boolean }>(
      `/user/wishlist/toggle/${productId}`
    ),

  check: (productId: string) =>
    axiosInstance.get<{ success: boolean; isInWishlist: boolean }>(
      `/user/wishlist/check/${productId}`
    ),

  clear: () =>
    axiosInstance.delete<{ success: boolean }>('/user/wishlist/clear'),
};

export default wishlistService;
