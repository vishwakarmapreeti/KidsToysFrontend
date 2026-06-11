import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Mail,
  Phone,
  Shield,
  ShieldOff,
  Crown,
  ShoppingBag,
  MapPin,
  Trash2,
} from 'lucide-react';

import userManagementService from '../../../services/userManagementService';
import type { AdminUser } from '../../../services/userManagementService';

export default function AdminUserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const res = await userManagementService.getUser(id!);

      setUser(res.data.user);
      setOrders((res.data as any).orders || []);
      setTotalOrders(res.data.totalOrders || 0);
      setTotalSpent(res.data.totalSpent || 0);
    } catch (err) {
      console.error(err);
      navigate('/admin/users');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlock = async () => {
    if (!user) return;

    setActionLoading(true);

    try {
      const res = await userManagementService.toggleBlock(user._id);
      setUser(res.data.user);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;

    if (!confirm(`Delete ${user.name}?`)) return;

    setActionLoading(true);

    try {
      await userManagementService.deleteUser(user._id);
      navigate('/admin/users');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="h-28 bg-white rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => navigate('/admin/users')}
        className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Users
      </button>

      {/* User Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left */}
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white text-3xl font-bold">
              {user.name[0]?.toUpperCase()}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {user.name}
                </h2>

                {user.role === 'admin' && (
                  <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    Admin
                  </span>
                )}
              </div>

              <div className="space-y-1 mt-2">
                <p className="flex items-center gap-2 text-sm text-neutral-600">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </p>

                <p className="flex items-center gap-2 text-sm text-neutral-600">
                  <Phone className="w-4 h-4" />
                  {user.phone || 'No phone'}
                </p>

                <p className="text-sm text-neutral-500">
                  Joined{' '}
                  {new Date(user.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col items-start md:items-end gap-3">
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                user.isActive
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {user.isActive ? '✅ Active' : '🚫 Blocked'}
            </span>

            <div className="flex items-center gap-2">
              {user.role !== 'admin' && (
                <>
                  <button
                    onClick={handleBlock}
                    disabled={actionLoading}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                      user.isActive
                        ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {user.isActive ? (
                      <span className="flex items-center gap-2">
                        <ShieldOff className="w-4 h-4" />
                        Block
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Unblock
                      </span>
                    )}
                  </button>

                  <button
                    onClick={handleDelete}
                    disabled={actionLoading}
                    className="px-4 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200 text-sm font-medium flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <ShoppingBag className="w-5 h-5 text-[#FF6B6B]" />
            <h3 className="font-semibold text-neutral-900">
              Total Orders
            </h3>
          </div>

          <p className="text-3xl font-bold text-neutral-900">
            {totalOrders}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-5 h-5 text-[#FF6B6B]" />
            <h3 className="font-semibold text-neutral-900">
              Total Spent
            </h3>
          </div>

          <p className="text-3xl font-bold text-neutral-900">
            ₹{totalSpent.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Address */}
      {user.address && (
        <div className="bg-white rounded-2xl border border-neutral-200 p-5">
          <h3 className="font-semibold text-neutral-900 mb-3">
            Address
          </h3>

          <div className="text-sm text-neutral-600 space-y-1">
            <p>{user.address.street}</p>
            <p>
              {user.address.city}, {user.address.state}
            </p>
            <p>
              {user.address.country} - {user.address.pincode}
            </p>
          </div>
        </div>
      )}

      {/* Orders */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <div className="p-5 border-b border-neutral-100">
          <h3 className="font-semibold text-neutral-900">
            Recent Orders
          </h3>
        </div>

        {orders.length === 0 ? (
          <div className="p-10 text-center text-neutral-500">
            No orders found
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {orders.map(order => (
              <Link
                key={order._id}
                to={`/admin/orders/${order._id}`}
                className="flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-[#FF6B6B]">
                    #{order._id.slice(-8).toUpperCase()}
                  </p>

                  <p className="text-sm text-neutral-500 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-neutral-900">
                    ₹{order.totalPrice}
                  </p>

                  <span className="text-xs text-neutral-500 capitalize">
                    {order.orderStatus}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}