import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag, Users, Package, TrendingUp,
  ArrowUpRight, Clock, AlertCircle, Truck,
  CheckCircle, XCircle,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
  PieChart, Pie, Cell,
} from 'recharts';
import axiosInstance from '../../services/axiosInstance';

interface DashboardData {
  stats: {
    totalRevenue:      number;
    totalOrders:       number;
    totalProducts:     number;
    totalUsers:        number;
    newUsersThisMonth: number;
    orderStatus: {
      pending:    number;
      processing: number;
      shipped:    number;
      delivered:  number;
      cancelled:  number;
    };
  };
  revenueData:   { month: string; revenue: number; orders: number }[];
  recentOrders:  any[];
  topProducts:   { _id: string; name: string; image: string; sold: number; revenue: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  Delivered:  'bg-green-100 text-green-700',
  Pending:    'bg-amber-100 text-amber-700',
  Processing: 'bg-blue-100 text-blue-700',
  Shipped:    'bg-purple-100 text-purple-700',
  Cancelled:  'bg-red-100 text-red-700',
};

const PIE_COLORS = ['#FF6B6B', '#3B82F6', '#8B5CF6', '#10B981', '#EF4444'];

function StatCard({
  label, value, icon: Icon, color, sub, delay,
}: {
  label: string; value: string | number;
  icon: any; color: string; sub?: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {sub && (
          <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            {sub}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-neutral-900">{value}</p>
      <p className="text-sm text-neutral-500 mt-1">{label}</p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [data, setData]         = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/admin/dashboard')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-2xl p-5 h-28 animate-pulse border border-neutral-100" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-white rounded-2xl h-64 animate-pulse border border-neutral-100" />
          <div className="bg-white rounded-2xl h-64 animate-pulse border border-neutral-100" />
        </div>
      </div>
    );
  }

  if (!data) return <></>;

  const { stats, revenueData, recentOrders, topProducts } = data;

  // Pie chart data
  const pieData = [
    { name: 'Pending',    value: stats.orderStatus.pending },
    { name: 'Processing', value: stats.orderStatus.processing },
    { name: 'Shipped',    value: stats.orderStatus.shipped },
    { name: 'Delivered',  value: stats.orderStatus.delivered },
    { name: 'Cancelled',  value: stats.orderStatus.cancelled },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">

      {/* ── Stats Cards ──────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`}
          icon={TrendingUp}
          color="bg-violet-500"
          delay={0}
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          color="bg-[#FF6B6B]"
          delay={0.08}
        />
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          icon={Package}
          color="bg-sky-500"
          delay={0.16}
        />
        <StatCard
          label="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="bg-amber-500"
          sub={`+${stats.newUsersThisMonth} this month`}
          delay={0.24}
        />
      </div>

      {/* ── Order Status Cards ───────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Pending',    value: stats.orderStatus.pending,    icon: Clock,         color: 'text-amber-600',  bg: 'bg-amber-50' },
          { label: 'Processing', value: stats.orderStatus.processing, icon: AlertCircle,   color: 'text-blue-600',   bg: 'bg-blue-50' },
          { label: 'Shipped',    value: stats.orderStatus.shipped,    icon: Truck,         color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Delivered',  value: stats.orderStatus.delivered,  icon: CheckCircle,   color: 'text-green-600',  bg: 'bg-green-50' },
          { label: 'Cancelled',  value: stats.orderStatus.cancelled,  icon: XCircle,       color: 'text-red-600',    bg: 'bg-red-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${bg} rounded-2xl p-4 text-center border border-neutral-100`}
          >
            <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
            <p className="text-xs text-neutral-600 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Charts Row ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-neutral-100"
        >
          <h3 className="font-bold text-neutral-900 mb-5">Revenue — Last 6 Months</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v}`} />
              <Tooltip formatter={(v: any) => [`₹${Number(v).toLocaleString('en-IN')}`, 'Revenue']} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#FF6B6B"
                strokeWidth={2.5}
                dot={{ fill: '#FF6B6B', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order status pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100"
        >
          <h3 className="font-bold text-neutral-900 mb-5">Order Status</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-3">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                      />
                      <span className="text-neutral-600">{d.name}</span>
                    </div>
                    <span className="font-semibold text-neutral-900">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-neutral-400 text-sm">
              No orders yet
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Orders chart ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100"
      >
        <h3 className="font-bold text-neutral-900 mb-5">Monthly Orders</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="orders" fill="#7C3AED" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* ── Bottom Row ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden"
        >
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="font-bold text-neutral-900">Recent Orders</h3>
            <Link
              to="/admin/orders"
              className="text-sm text-[#FF6B6B] font-medium hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {recentOrders.length === 0 ? (
              <p className="text-center text-neutral-400 text-sm py-8">No orders yet</p>
            ) : (
              recentOrders.map(order => (
                <Link
                  key={order._id}
                  to={`/admin/orders/${order._id}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-neutral-50 transition-colors"
                >
                  <div>
                    <p className="font-mono font-bold text-sm text-[#FF6B6B]">
                      #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {typeof order.user === 'object' ? order.user.name : 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm text-neutral-900">
                      ₹{order.totalPrice.toLocaleString('en-IN')}
                    </p>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[order.orderStatus] || 'bg-neutral-100 text-neutral-600'}`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden"
        >
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <h3 className="font-bold text-neutral-900">Top Selling Products</h3>
            <Link
              to="/admin/products"
              className="text-sm text-[#FF6B6B] font-medium hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-neutral-100">
            {topProducts.length === 0 ? (
              <p className="text-center text-neutral-400 text-sm py-8">No sales yet</p>
            ) : (
              topProducts.map((p, idx) => (
                <div key={p._id} className="flex items-center gap-3 px-5 py-3.5">
                  <span className="text-sm font-bold text-neutral-400 w-5">
                    {idx + 1}
                  </span>
                  <img
                    src={p.image || 'https://via.placeholder.com/40'}
                    alt={p.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      {p.name}
                    </p>
                    <p className="text-xs text-neutral-500">{p.sold} sold</p>
                  </div>
                  <p className="text-sm font-bold text-neutral-900 flex-shrink-0">
                    ₹{p.revenue.toLocaleString('en-IN')}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}