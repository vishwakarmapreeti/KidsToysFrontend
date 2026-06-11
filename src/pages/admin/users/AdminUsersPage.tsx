import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users, Search, Shield, ShieldOff,
  Trash2, Eye, UserCheck, UserX,
} from 'lucide-react';
import userService from '../../../services/userService';
import type { AdminUser } from '../../../services/userService';

export default function AdminUsersPage() {
  const [users, setUsers]         = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch]       = useState('');
  const [roleFilter, setRole]     = useState('all');
  const [actionId, setActionId]   = useState<string | null>(null);

  useEffect(() => { fetchUsers(); }, [roleFilter]);

  const fetchUsers = () => {
    setIsLoading(true);
    userService.getAllUsers({
      role:  roleFilter === 'all' ? undefined : roleFilter,
      limit: 100,
    })
      .then(res => setUsers(res.data.users))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  const handleBlock = async (id: string) => {
    setActionId(id);
    try {
      const res = await userService.toggleBlock(id);
      setUsers(prev => prev.map(u => u._id === id ? res.data.user : u));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed');
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    setActionId(id);
    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete');
    } finally {
      setActionId(null);
    }
  };

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalUsers  = users.length;
  const activeUsers = users.filter(u => u.isActive).length;
  const blockedUsers = users.filter(u => !u.isActive).length;
  const adminUsers  = users.filter(u => u.role === 'admin').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-neutral-900">User Management</h2>
        <p className="text-sm text-neutral-500">{totalUsers} total users</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Users',  value: totalUsers,   color: 'bg-blue-500',   icon: Users },
          { label: 'Active',       value: activeUsers,  color: 'bg-green-500',  icon: UserCheck },
          { label: 'Blocked',      value: blockedUsers, color: 'bg-red-500',    icon: UserX },
          { label: 'Admins',       value: adminUsers,   color: 'bg-purple-500', icon: Shield },
        ].map(({ label, value, color, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-2xl font-bold text-neutral-900">{value}</p>
            <p className="text-xs text-neutral-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex items-center gap-2 bg-white rounded-xl border border-neutral-200 px-4 py-2.5 flex-1 sm:max-w-xs">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="text-sm text-neutral-700 focus:outline-none w-full"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'user', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                roleFilter === r
                  ? 'bg-[#FF6B6B] text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:border-[#FF6B6B]/50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                {['User', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
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
                    <Users className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500">No users found</p>
                  </td>
                </tr>
              ) : (
                filtered.map((user, idx) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className={`hover:bg-neutral-50 transition-colors ${actionId === user._id ? 'opacity-50' : ''}`}
                  >
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {user.name[0]?.toUpperCase()}
                        </div>
                        <p className="font-medium text-neutral-900 text-sm">{user.name}</p>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-neutral-600">{user.email}</p>
                      {!user.isVerified && (
                        <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
                          Unverified
                        </span>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-neutral-600">{user.phone || '—'}</p>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive ? 'Active' : 'Blocked'}
                      </span>
                    </td>

                    {/* Joined */}
                    <td className="px-5 py-4">
                      <p className="text-sm text-neutral-500">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </p>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1">
                        {/* View */}
                        <Link
                          to={`/admin/users/${user._id}`}
                          className="p-2 rounded-lg hover:bg-blue-50 text-neutral-500 hover:text-blue-600 transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {/* Block/Unblock */}
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleBlock(user._id)}
                            disabled={actionId === user._id}
                            title={user.isActive ? 'Block user' : 'Unblock user'}
                            className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                              user.isActive
                                ? 'hover:bg-amber-50 text-neutral-500 hover:text-amber-600'
                                : 'hover:bg-green-50 text-neutral-500 hover:text-green-600'
                            }`}
                          >
                            {user.isActive
                              ? <ShieldOff className="w-4 h-4" />
                              : <Shield className="w-4 h-4" />
                            }
                          </button>
                        )}

                        {/* Delete */}
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleDelete(user._id, user.name)}
                            disabled={actionId === user._id}
                            title="Delete user"
                            className="p-2 rounded-lg hover:bg-red-50 text-neutral-500 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
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