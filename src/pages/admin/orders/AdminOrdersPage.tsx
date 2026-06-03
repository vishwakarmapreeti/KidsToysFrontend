import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Search, Filter, } from 'lucide-react';
import orderService from '../../../services/orderService';
import type { Order } from '../../../services/orderService';

const STATUS_STYLES: Record<string, string> = {
  pending:    'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

const STATUSES = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrdersPage() {
  const [orders, setOrders]         = useState<Order[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [search, setSearch]         = useState('');
  const [statusFilter, setStatus]   = useState('all');
  const [updating, setUpdating]     = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
  fetchOrders();
}, [statusFilter]);

  const fetchOrders = () => {
    setIsLoading(true);
    orderService.getAllOrders({
      status: statusFilter === 'all' ? undefined : statusFilter,
      limit:  100,
    })
     .then(res => {
  setOrders(res.data.orders);
  setError('');
})
.catch((err) => {
  console.error(err);

  setError(
    err.response?.data?.message || 'Failed to fetch orders'
  );
})
.finally(() => setIsLoading(false));
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      const res = await orderService.updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => o._id === orderId ? res.data.order : o));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update');
    } finally {
      setUpdating(null);
    }
  };

const filtered = orders.filter((o) => {
  const orderIdMatch = o._id
    .toLowerCase()
    .includes(search.toLowerCase());

  const userMatch =
    typeof o.user === 'object' &&
    o.user.name?.toLowerCase().includes(search.toLowerCase());

  return orderIdMatch || userMatch;
});


const getAllowedStatuses = (current: string) => {
  switch (current) {
    case 'pending':
      return ['pending', 'processing', 'cancelled'];

    case 'processing':
      return ['processing', 'shipped', 'cancelled'];

    case 'shipped':
      return ['shipped', 'delivered'];

    case 'delivered':
      return ['delivered'];

    case 'cancelled':
      return ['cancelled'];

    default:
      return [current];
  }
};
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900">Orders</h2>
          <p className="text-sm text-neutral-500">{orders.length} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-neutral-200 px-4 py-2.5 flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="text-sm text-neutral-700 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-neutral-400 flex-shrink-0" />
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all capitalize ${
                statusFilter === s
                  ? 'bg-[#FF6B6B] text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-[#FF6B6B]/50'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
{error && (
  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
    {error}
  </div>
)}
      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Update Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {[1,2,3,4,5,6,7].map(j => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500">No orders found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((order, idx) => (
                  <motion.tr
                    key={order._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`hover:bg-neutral-50 transition-colors ${updating === order._id ? 'opacity-50' : ''}`}
                  >
                    <td className="px-5 py-4">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="font-mono font-bold text-sm text-[#FF6B6B] hover:underline"
                      >
                        #{order._id.slice(-8).toUpperCase()}
                      </Link>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </td>
                    <td className="px-5 py-4">
               <p className="text-sm font-medium text-neutral-900 truncate max-w-[180px]">
                        {typeof order.user === 'object' ? order.user.name : 'N/A'}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {typeof order.user === 'object' ? order.user.email : ''}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {order.orderItems.slice(0, 2).map((item, i) => (
                          <img
                            key={i}
                            src={item.image || 'https://via.placeholder.com/32'}
                            alt={item.name}
                            className="w-8 h-8 rounded-lg object-cover"
                          />
                        ))}
                        {order.orderItems.length > 2 && (
                          <span className="text-xs text-neutral-500 ml-1">
                            +{order.orderItems.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-sm text-neutral-900">
                        ₹{order.totalPrice.toLocaleString('en-IN')}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[order.orderStatus]}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={order.orderStatus}
                        onChange={e => handleStatusUpdate(order._id, e.target.value)}
                        disabled={updating === order._id || order.orderStatus === 'cancelled'}
                        className="text-xs border border-neutral-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#FF6B6B] bg-white disabled:opacity-50 cursor-pointer"
                      >
                      {getAllowedStatuses(order.orderStatus).map((s) => (
                          <option key={s} value={s} className="capitalize">{s}</option>
                        ))}
                      </select>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}