
import { motion } from 'framer-motion';
import { ShoppingBag, Users, Package, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const STATS = [
  { label: 'Total Revenue',  value: '₹1,24,500', change: '+12.5%', up: true,  icon: TrendingUp,  color: 'bg-violet-500' },
  { label: 'Total Orders',   value: '1,284',      change: '+8.2%',  up: true,  icon: ShoppingBag, color: 'bg-[#FF6B6B]' },
  { label: 'Total Products', value: '486',         change: '+3.1%',  up: true,  icon: Package,     color: 'bg-sky-500' },
  { label: 'Total Users',    value: '3,920',       change: '-1.4%',  up: false, icon: Users,       color: 'bg-amber-500' },
];

const REVENUE_DATA = [
  { month: 'Jan', revenue: 18000 }, { month: 'Feb', revenue: 24000 },
  { month: 'Mar', revenue: 19000 }, { month: 'Apr', revenue: 31000 },
  { month: 'May', revenue: 28000 }, { month: 'Jun', revenue: 35000 },
  { month: 'Jul', revenue: 42000 }, { month: 'Aug', revenue: 38000 },
];

const ORDERS_DATA = [
  { day: 'Mon', orders: 42 }, { day: 'Tue', orders: 68 },
  { day: 'Wed', orders: 55 }, { day: 'Thu', orders: 79 },
  { day: 'Fri', orders: 91 }, { day: 'Sat', orders: 112 },
  { day: 'Sun', orders: 84 },
];

const RECENT_ORDERS = [
  { id: '#ORD-001', customer: 'Priya Sharma',  product: 'Lego City Set',   amount: '₹1,499', status: 'Delivered' },
  { id: '#ORD-002', customer: 'Rahul Gupta',   product: 'Barbie Doll Set', amount: '₹999',   status: 'Pending' },
  { id: '#ORD-003', customer: 'Sneha Patel',   product: 'Chess Board',     amount: '₹599',   status: 'Processing' },
  { id: '#ORD-004', customer: 'Amit Kumar',    product: 'Hot Wheels Track', amount: '₹1,999', status: 'Delivered' },
  { id: '#ORD-005', customer: 'Pooja Singh',   product: 'Lego City Sett',  amount: '₹1,499', status: 'Cancelled' },
];

const STATUS_COLORS: Record<string, string> = {
  Delivered:  'bg-green-100 text-green-700',
  Pending:    'bg-amber-100 text-amber-700',
  Processing: 'bg-blue-100 text-blue-700',
  Cancelled:  'bg-red-100 text-red-700',
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(({ label, value, change, up, icon: Icon, color }, idx) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.08 }}
            className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-semibold ${up ? 'text-green-600' : 'text-red-500'}`}>
                {up ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {change}
              </span>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{value}</p>
            <p className="text-sm text-neutral-500 mt-1">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-neutral-100"
        >
          <h3 className="font-bold text-neutral-900 mb-5">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => [`₹${v}`, 'Revenue']} />
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

        {/* Orders chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-white rounded-2xl p-5 shadow-sm border border-neutral-100"
        >
          <h3 className="font-bold text-neutral-900 mb-5">Weekly Orders</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={ORDERS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#7C3AED" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden"
      >
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-bold text-neutral-900">Recent Orders</h3>
          <button className="text-sm text-[#FF6B6B] font-medium hover:underline">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                {['Order ID', 'Customer', 'Product', 'Amount', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {RECENT_ORDERS.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-neutral-900">{order.id}</td>
                  <td className="px-5 py-3.5 text-sm text-neutral-600">{order.customer}</td>
                  <td className="px-5 py-3.5 text-sm text-neutral-600">{order.product}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-neutral-900">{order.amount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}