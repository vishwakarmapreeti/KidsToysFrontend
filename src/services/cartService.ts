import axiosInstance from './axiosInstance';

export interface CartItem {
  _id:      string;
  product: {
    _id:           string;
    name:          string;
    images:        string[];
    price:         number;
    discountPrice: number;
    stock:         number;
    slug:          string;
    category?:     { name: string } | string;
  };
  quantity: number;
  price:    number;
}

export interface Cart {
  _id:        string;
  items:      CartItem[];
  totalPrice: number;
}

const cartService = {
  getCart: () =>
    axiosInstance.get<{ success: boolean; cart: Cart }>('/user/cart'),

  addToCart: (productId: string, quantity: number = 1) =>
    axiosInstance.post<{ success: boolean; message: string; cart: Cart }>(
      '/user/cart',
      { productId, quantity }
    ),

  updateItem: (itemId: string, quantity: number) =>
    axiosInstance.put<{ success: boolean; cart: Cart }>(
      `/user/cart/${itemId}`,
      { quantity }
    ),

  removeItem: (itemId: string) =>
    axiosInstance.delete<{ success: boolean; cart: Cart }>(
      `/user/cart/${itemId}`
    ),

  clearCart: () =>
    axiosInstance.delete<{ success: boolean }>('/user/cart/clear'),
};

export default cartService;
