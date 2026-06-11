import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ChevronRight, ShoppingBag } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import orderService from '../../services/orderService';
import type { Order } from '../../services/orderService';

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function MyOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
        orderService.getMyOrders()
            .then(res => {
                const sorted = res.data.orders.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );

                setOrders(sorted);
            })
            .catch((err) => {
                console.error(err);
                setError('Failed to load orders');
            })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center gap-3 mb-8">
                    <Package className="w-6 h-6 text-[#FF6B6B]" />
                    <h1 className="font-display font-bold text-3xl text-neutral-900">My Orders</h1>
                    <span className="bg-neutral-100 text-neutral-600 text-sm font-bold px-3 py-1 rounded-full">
                        {orders.length}
                    </span>
                </div>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl border border-neutral-200 p-5 animate-pulse">
                                <div className="h-4 bg-neutral-200 rounded w-1/3 mb-3" />
                                <div className="h-3 bg-neutral-200 rounded w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-24">
                        <ShoppingBag className="w-20 h-20 text-neutral-200 mx-auto mb-6" />
                        <h2 className="font-display font-bold text-2xl text-neutral-900 mb-3">
                            No orders yet
                        </h2>
                        <p className="text-neutral-500 mb-8">
                            Start shopping to see your orders here!
                        </p>
                        <Link to="/shop" className="inline-flex items-center gap-2 bg-[#FF6B6B] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#ff5252] transition-colors">
                            Shop Now
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order, idx) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                            >
                                <Link to={`/orders/${order._id}`}>
                                    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-sm hover:shadow-md transition-all hover:border-[#FF6B6B]/30 group">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <p className="font-mono font-bold text-neutral-900 text-sm">
                                                        #{order._id.slice(-8).toUpperCase()}
                                                    </p>
                                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.orderStatus]}`}>
                                                        {order.orderStatus}
                                                    </span>
                                                    {order.isPaid && (
                                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                                                            Paid
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Items preview */}
                                                <div className="flex items-center gap-2 mb-3">
                                                    {order.orderItems.slice(0, 3).map((item, i) => (
                                                        <img
                                                            key={i}
                                                            src={item.image || 'https://via.placeholder.com/40'}
                                                            alt={item.name}
                                                            className="w-10 h-10 rounded-lg object-cover border border-neutral-100"
                                                        />
                                                    ))}
                                                    {order.orderItems.length > 3 && (
                                                        <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-600">
                                                            +{order.orderItems.length - 3}
                                                        </div>
                                                    )}
                                                    <span className="text-sm text-neutral-500 ml-1">
                                                        {order.orderItems.length} item{order.orderItems.length > 1 ? 's' : ''}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-4 text-sm text-neutral-500">
                                                    <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                                    <span>•</span>
                                                    <span className="capitalize">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay'}</span>
                                                </div>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <p className="font-bold text-lg text-neutral-900">
                                                    ₹{order.totalPrice.toLocaleString('en-IN')}
                                                </p>
                                                <ChevronRight className="w-5 h-5 text-neutral-400 ml-auto mt-2 group-hover:text-[#FF6B6B] transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}