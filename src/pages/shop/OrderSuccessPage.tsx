import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package,Home } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import orderService from '../../services/orderService';
import type { Order } from '../../services/orderService';

export default function OrderSuccessPage() {
  const { id }  = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading] = useState(true);

  useEffect(() => {
    if (id) {
      orderService.getOrder(id)
        .then(res => setOrder(res.data.order))
     .catch((err) => {
  console.error(err);
});
    }
  }, [id]);
    if (loading) return <p>Loading...</p>;

   


  return (
    <Layout>
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-14 h-14 text-green-500" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="font-display font-bold text-3xl text-neutral-900 mb-3">
            Order Placed! 🎉
          </h1>
          <p className="text-neutral-600 mb-2">
            Thank you for your order. We'll send you an email confirmation shortly.
          </p>
          {order && (
            <p className="text-sm text-neutral-500 mb-8">
              Order ID: <span className="font-mono font-semibold text-neutral-700">#{order._id.slice(-8).toUpperCase()}</span>
            </p>
          )}

          {/* Order summary */}
          {order && (
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 text-left mb-8 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-[#FF6B6B]" />
                <h3 className="font-semibold text-neutral-900">Order Details</h3>
              </div>
              <div className="space-y-2 mb-4">
                {order.orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-neutral-600">{item.name} × {item.quantity}</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-neutral-100 pt-3 space-y-1.5">
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Shipping</span>
                  <span>{order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}</span>
                </div>
                <div className="flex justify-between font-bold text-neutral-900">
                  <span>Total Paid</span>
                  <span>₹{order.totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <p className="text-xs text-neutral-500">Delivering to:</p>
                <p className="text-sm text-neutral-700">
                  {order.shippingAddress.street}, {order.shippingAddress.city}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/orders"
              className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B6B] text-white py-3 rounded-xl font-semibold hover:bg-[#ff5252] transition-colors"
            >
              <Package className="w-4 h-4" />
              Track Order
            </Link>
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 border border-neutral-200 text-neutral-700 py-3 rounded-xl font-semibold hover:bg-neutral-50 transition-colors"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}