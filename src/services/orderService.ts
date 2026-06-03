import axiosInstance from './axiosInstance';

export interface OrderItem {
  product:  string;
  name:     string;
  image:    string;
  price:    number;
  quantity: number;
}

export interface ShippingAddress {
  street:  string;
  city:    string;
  state:   string;
  pincode: string;
  country: string;
  phone:   string;
}

export interface Order {
  _id:             string;
  user:            { _id: string; name: string; email: string; phone: string } | string;
  orderItems:      OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod:   'razorpay' | 'cod';
  paymentResult?:  {
    razorpay_order_id:   string;
    razorpay_payment_id: string;
    razorpay_signature:  string;
    status:              string;
  };
  itemsPrice:    number;
  shippingPrice: number;
  totalPrice:    number;
  isPaid:        boolean;
  paidAt?:       string;
  isDelivered:   boolean;
  deliveredAt?:  string;
  orderStatus:   'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt:     string;
}

export interface CreateOrderPayload {
  shippingAddress: ShippingAddress;
  paymentMethod:   'razorpay' | 'cod';
  orderItems?:     OrderItem[];
}

const orderService = {
  // User
  createOrder: (data: CreateOrderPayload) =>
    axiosInstance.post<{ success: boolean; order: Order }>('/user/orders', data),

  getMyOrders: () =>
    axiosInstance.get<{ success: boolean; orders: Order[] }>('/user/orders/my'),

  getOrder: (id: string) =>
    axiosInstance.get<{ success: boolean; order: Order }>(`/user/orders/${id}`),

  createRazorpayOrder: (orderId: string) =>
    axiosInstance.post<{ success: boolean; razorpayOrder: any; key: string; order: Order }>(
      `/user/orders/${orderId}/razorpay`
    ),

  verifyPayment: (orderId: string, data: {
    razorpay_order_id:   string;
    razorpay_payment_id: string;
    razorpay_signature:  string;
  }) =>
    axiosInstance.post<{ success: boolean; order: Order }>(
      `/user/orders/${orderId}/verify-payment`, data
    ),

  cancelOrder: (id: string) =>
    axiosInstance.put<{ success: boolean; order: Order }>(`/user/orders/${id}/cancel`),

  // Admin
  getAllOrders: (params?: { status?: string; page?: number; limit?: number }) =>
    axiosInstance.get<{ success: boolean; total: number; orders: Order[] }>(
      '/admin/orders', { params }
    ),

  updateOrderStatus: (id: string, status: string) =>
    axiosInstance.put<{ success: boolean; order: Order }>(
      `/admin/orders/${id}/status`, { status }
    ),
};

export default orderService;