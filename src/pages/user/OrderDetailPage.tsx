import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Package, MapPin, CreditCard, ArrowLeft,
  CheckCircle, Clock, Truck, XCircle, AlertCircle,
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import orderService from '../../services/orderService';
import type { Order } from '../../services/orderService';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

const STATUS_ICONS: Record<string, any> = {
  pending:    Clock,
  processing: AlertCircle,
  shipped:    Truck,
  delivered:  CheckCircle,
  cancelled:  XCircle,
};

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

export default function OrderDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder]       = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

 useEffect(() => {
  if (id) {
    orderService.getOrder(id)
      .then(res => setOrder(res.data.order))
      .catch((err) => {
        setError(
          err.response?.data?.message || 'Failed to load order'
        );
      })
      .finally(() => setIsLoading(false));
  }
}, [id, navigate]);

  const handleCancel = async () => {
    if (!order || !confirm('Cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await orderService.cancelOrder(order._id);
      setOrder(res.data.order);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Cannot cancel');
    } finally {
      setCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-5 animate-pulse h-32" />
          ))}
        </div>
      </Layout>
    );
  }



  if (error) {
  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">
          Something went wrong
        </h2>
        <p className="text-neutral-500 mb-6">{error}</p>

        <button
          onClick={() => navigate('/orders')}
          className="bg-[#FF6B6B] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#ff5252]"
        >
          Back to Orders
        </button>
      </div>
    </Layout>
  );
}

  if (!order) return <></>;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);
  const StatusIcon  = STATUS_ICONS[order.orderStatus] || Clock;

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate('/orders')}
            className="p-2 rounded-xl hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
          <div className="flex items-center gap-2">
  <StatusIcon className="w-5 h-5 text-[#FF6B6B]" />

  <h1 className="font-display font-bold text-2xl text-neutral-900">
    Order #{order._id.slice(-8).toUpperCase()}
  </h1>
</div>
            <p className="text-sm text-neutral-500">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span className={`ml-auto text-xs font-semibold px-3 py-1.5 rounded-full capitalize ${STATUS_STYLES[order.orderStatus]}`}>
            {order.orderStatus}
          </span>
        </div>

        <div className="space-y-4">
          {/* Progress tracker */}
          {order.orderStatus !== 'cancelled' && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
              <h3 className="font-semibold text-neutral-900 mb-5">Order Progress</h3>
              <div className="flex items-center justify-between">
                {STATUS_STEPS.map((s, i) => {
                  const Icon     = STATUS_ICONS[s];
                  const isDone   = i <= currentStep;
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
                        <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${i < currentStep ? 'bg-green-400' : 'bg-neutral-200'}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[#FF6B6B]" />
              <h3 className="font-semibold text-neutral-900">
                Items ({order.orderItems.length})
              </h3>
            </div>
            <div className="space-y-3">
              {order.orderItems.map((item, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-neutral-50 rounded-xl">
                  <img
                    src={item.image || 'https://via.placeholder.com/60'}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-neutral-900 text-sm">{item.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">Qty: {item.quantity}</p>
                    <p className="font-bold text-neutral-900 mt-1">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="border-t border-neutral-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Items total</span>
                <span>₹{order.itemsPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Shipping</span>
                <span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
              </div>
              <div className="flex justify-between font-bold text-neutral-900 text-base">
                <span>Total</span>
                <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-[#FF6B6B]" />
              <h3 className="font-semibold text-neutral-900">Delivery Address</h3>
            </div>
            <p className="text-sm text-neutral-700">{order.shippingAddress.street}</p>
            <p className="text-sm text-neutral-700">
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
            <p className="text-sm text-neutral-700">{order.shippingAddress.country}</p>
            <p className="text-sm text-neutral-600 mt-1">📞 {order.shippingAddress.phone}</p>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-[#FF6B6B]" />
              <h3 className="font-semibold text-neutral-900">Payment Info</h3>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-700 capitalize">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay'}
                </p>
                {order.paidAt && (
                  <p className="text-xs text-neutral-500 mt-1">
                    Paid on {new Date(order.paidAt).toLocaleDateString('en-IN')}
                  </p>
                )}
              </div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                {order.isPaid ? 'Paid' : 'Pending'}
              </span>
            </div>
          </div>

          {/* Cancel button */}
          {['pending', 'processing'].includes(order.orderStatus) && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="w-full py-3 border-2 border-red-200 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-colors disabled:opacity-60"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Order'}
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}