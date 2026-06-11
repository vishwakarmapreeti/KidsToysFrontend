import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Package, MapPin, CreditCard,
  User, Clock, CheckCircle, Truck,
  AlertCircle, XCircle, ChevronDown,
} from 'lucide-react';
import orderService from '../../../services/orderService';
import type { Order } from '../../../services/orderService';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

const STATUS_CONFIG: Record<string, {
  label: string; color: string; bg: string; icon: any
}> = {
  pending:    { label: 'Pending',    color: 'text-amber-700',  bg: 'bg-amber-100',  icon: Clock },
  processing: { label: 'Processing', color: 'text-blue-700',   bg: 'bg-blue-100',   icon: AlertCircle },
  shipped:    { label: 'Shipped',    color: 'text-purple-700', bg: 'bg-purple-100', icon: Truck },
  delivered:  { label: 'Delivered',  color: 'text-green-700',  bg: 'bg-green-100',  icon: CheckCircle },
  cancelled:  { label: 'Cancelled',  color: 'text-red-700',    bg: 'bg-red-100',    icon: XCircle },
};

export default function AdminOrderDetailPage() {
  const { id }     = useParams<{ id: string }>();
  const navigate   = useNavigate();
  const [order, setOrder]           = useState<Order | null>(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [updating, setUpdating]     = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  useEffect(() => {
    if (id) {
      // Admin uses getAllOrders — we need a direct fetch
      // Using user getOrder won't work for admin — use getAllOrders filter
      orderService.getAllOrders({ limit: 200 })
        .then(res => {
          const found = res.data.orders.find(o => o._id === id);
          if (found) setOrder(found);
          else navigate('/admin/orders');
        })
        .catch(() => navigate('/admin/orders'))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleStatusUpdate = async (status: string) => {
    if (!order) return;
    setUpdating(true);
    setStatusOpen(false);
    try {
      const res = await orderService.updateOrderStatus(order._id, status);
      setOrder(res.data.order);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1,2,3].map(i => (
          <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-5 animate-pulse h-32" />
        ))}
      </div>
    );
  }

  if (!order) return <></>;

  const statusCfg   = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
  const StatusIcon  = statusCfg.icon;
  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/orders')}
            className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-neutral-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-neutral-900">
              Order #{order._id.slice(-8).toUpperCase()}
            </h2>
            <p className="text-sm text-neutral-500">
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'long', year: 'numeric',
                hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        {/* Status update dropdown */}
        <div className="relative">
          <button
            onClick={() => setStatusOpen(!statusOpen)}
            disabled={updating || order.orderStatus === 'cancelled'}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-60 ${statusCfg.bg} ${statusCfg.color}`}
          >
            <StatusIcon className="w-4 h-4" />
            {updating ? 'Updating...' : statusCfg.label}
            <ChevronDown className={`w-4 h-4 transition-transform ${statusOpen ? 'rotate-180' : ''}`} />
          </button>

          {statusOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-neutral-100 overflow-hidden z-10">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <button
                    key={key}
                    onClick={() => handleStatusUpdate(key)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-neutral-50 transition-colors ${
                      order.orderStatus === key ? 'bg-neutral-50 font-semibold' : ''
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                    <span className={cfg.color}>{cfg.label}</span>
                    {order.orderStatus === key && (
                      <CheckCircle className="w-3.5 h-3.5 text-green-500 ml-auto" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Progress tracker */}
      {order.orderStatus !== 'cancelled' && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
          <h3 className="font-semibold text-neutral-900 mb-5">Order Progress</h3>
          <div className="flex items-center">
            {STATUS_STEPS.map((s, i) => {
              const cfg     = STATUS_CONFIG[s];
              const Icon    = cfg.icon;
              const isDone  = i <= currentStep;
              const isCurrent = i === currentStep;
              return (
                <div key={s} className="flex items-center flex-1">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                        : 'bg-neutral-100 text-neutral-400'
                    } ${isCurrent ? 'ring-4 ring-green-100' : ''}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className={`text-xs font-medium mt-2 capitalize ${isDone ? 'text-green-600' : 'text-neutral-400'}`}>
                      {s}
                    </p>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-1 mx-2 rounded-full mb-5 transition-all ${
                      i < currentStep ? 'bg-green-400' : 'bg-neutral-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left — Items + Summary */}
        <div className="lg:col-span-2 space-y-4">

          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[#FF6B6B]" />
              <h3 className="font-semibold text-neutral-900">
                Items ({order.orderItems.length})
              </h3>
            </div>

            <div className="space-y-3">
              {order.orderItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-3 p-3 bg-neutral-50 rounded-xl"
                >
                  <img
                    src={item.image || 'https://via.placeholder.com/60'}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover border border-neutral-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 text-sm line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      ₹{item.price.toLocaleString('en-IN')} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-neutral-900 text-sm flex-shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="border-t border-neutral-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Items Total</span>
                <span>₹{order.itemsPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Shipping</span>
                <span className={order.shippingPrice === 0 ? 'text-green-600 font-medium' : ''}>
                  {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 text-base pt-1 border-t border-neutral-100">
                <span>Total</span>
                <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Customer + Address + Payment */}
        <div className="space-y-4">

          {/* Customer */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-[#FF6B6B]" />
              <h3 className="font-semibold text-neutral-900 text-sm">Customer</h3>
            </div>
            {typeof order.user === 'object' ? (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {order.user.name?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-neutral-900 text-sm truncate">
                    {order.user.name}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">{order.user.email}</p>
                  {order.user.phone && (
                    <p className="text-xs text-neutral-500">{order.user.phone}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-500">User info not available</p>
            )}
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-[#FF6B6B]" />
              <h3 className="font-semibold text-neutral-900 text-sm">Delivery Address</h3>
            </div>
            <div className="space-y-1 text-sm text-neutral-600">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>Pincode: {order.shippingAddress.pincode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="font-medium text-neutral-900 mt-2">
                📞 {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-[#FF6B6B]" />
              <h3 className="font-semibold text-neutral-900 text-sm">Payment</h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 capitalize">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay'}
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  order.isPaid
                    ? 'bg-green-100 text-green-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {order.isPaid ? '✓ Paid' : 'Unpaid'}
                </span>
              </div>
              {order.isPaid && order.paidAt && (
                <p className="text-xs text-neutral-500">
                  Paid on {new Date(order.paidAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric'
                  })}
                </p>
              )}
              {order.paymentResult?.razorpay_payment_id && (
                <p className="text-xs text-neutral-400 font-mono break-all">
                  ID: {order.paymentResult.razorpay_payment_id}
                </p>
              )}
            </div>
          </div>

          {/* Delivery info */}
          {order.isDelivered && order.deliveredAt && (
            <div className="bg-green-50 rounded-2xl border border-green-200 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-green-700">Delivered</p>
                  <p className="text-xs text-green-600">
                    {new Date(order.deliveredAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}