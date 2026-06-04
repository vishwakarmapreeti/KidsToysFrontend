// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import {
//   Users, Search, Shield, ShieldOff,
//    Crown, User as
// } from 'lucide-react';

// import userManagementService from '../../../services/userManagementService';
// import type { AdminUser } from '../../../services/userManagementService';

// export default function AdminUsersPage() {
//   const [users, setUsers]         = useState<AdminUser[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [search, setSearch]       = useState('');
//   const [roleFilter, setRole]     = useState('all');
//   const [actionId, setActionId]   = useState<string | null>(null);
//   const [total, setTotal]         = useState(0);

//   useEffect(() => { fetchUsers(); }, [roleFilter]);

//   const fetchUsers = () => {
//     setIsLoading(true);
//     userManagementService.getAllUsers({
//       role:  roleFilter === 'all' ? undefined : roleFilter,
//       limit: 100,
//     })
//       .then(res => {
//         setUsers(res.data.users);
//         setTotal(res.data.total);
//       })
//       .catch(console.error)
//       .finally(() => setIsLoading(false));
//   };

//   const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSearch(e.target.value);
//   };

//   const handleBlock = async (id: string) => {
//     setActionId(id);
//     try {
//       const res = await userManagementService.toggleBlock(id);
//       setUsers(prev => prev.map(u => u._id === id ? res.data.user : u));
//     } catch (err: any) {
//       alert(err.response?.data?.message || 'Failed');
//     } finally {
//       setActionId(null);
//     }
//   };

//   const handleDelete = async (id: string, name: string) => {
//     if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
//     setActionId(id);
//     try {
//       await userManagementService.deleteUser(id);
//       setUsers(prev => prev.filter(u => u._id !== id));
//       setTotal(prev => prev - 1);
//     } catch (err: any) {
//       alert(err.response?.data?.message || 'Failed to delete');
//     } finally {
//       setActionId(null);
//     }
//   };

//   const filtered = users.filter(u =>
//     u.name.toLowerCase().includes(search.toLowerCase()) ||
//     u.email.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="space-y-5">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h2 className="text-xl font-bold text-neutral-900">User Management</h2>
//           <p className="text-sm text-neutral-500">{total} total users</p>
//         </div>
//       </div>

//       {/* Filters */}
//       <div className="flex flex-col sm:flex-row gap-3">
//         {/* Search */}
//         <div className="flex items-center gap-2 bg-white rounded-xl border border-neutral-200 px-4 py-2.5 flex-1 sm:max-w-sm">
//           <Search className="w-4 h-4 text-neutral-400" />
//           <input
//             value={search}
//             onChange={handleSearch}
//             placeholder="Search by name or email..."
//             className="text-sm text-neutral-700 focus:outline-none w-full"
//           />
//         </div>

//         {/* Role filter */}
//         <div className="flex items-center gap-2">
//           {['all', 'user', 'admin'].map(r => (
//             <button
//               key={r}
//               onClick={() => setRole(r)}
//               className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
//                 roleFilter === r
//                   ? 'bg-[#FF6B6B] text-white shadow-sm'
//                   : 'bg-white border border-neutral-200 text-neutral-600 hover:border-[#FF6B6B]/50'
//               }`}
//             >
//               {r === 'all' ? 'All Users' : r === 'admin' ? '👑 Admins' : '👤 Users'}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Stats row */}
//       <div className="grid grid-cols-3 gap-4">
//         {[
//           { label: 'Total Users', value: total, color: 'bg-blue-50 text-blue-700', icon: Users },
//           { label: 'Active',   value: users.filter(u => u.isActive).length,  color: 'bg-green-50 text-green-700',  icon: Shield },
//           { label: 'Blocked',  value: users.filter(u => !u.isActive).length, color: 'bg-red-50 text-red-700',     icon: ShieldOff },
//         ].map(({ label, value, color, icon: Icon }) => (
//           <div key={label} className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-sm">
//             <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
//               <Icon className="w-5 h-5" />
//             </div>
//             <p className="text-2xl font-bold text-neutral-900">{value}</p>
//             <p className="text-xs text-neutral-500">{label}</p>
//           </div>
//         ))}
//       </div>

//       {/* Table */}
//       <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead className="bg-neutral-50 border-b border-neutral-200">
//               <tr>
//                 {['User', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
//                   <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-neutral-500 uppercase tracking-wide whitespace-nowrap">
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-neutral-100">
//               {isLoading ? (
//                 Array.from({ length: 6 }).map((_, i) => (
//                   <tr key={i}>
//                     {[1,2,3,4,5,6,7].map(j => (
//                       <td key={j} className="px-5 py-4">
//                         <div className="h-4 bg-neutral-100 rounded animate-pulse" />
//                       </td>
//                     ))}
//                   </tr>
//                 ))
//               ) : filtered.length === 0 ? (
//                 <tr>
//                   <td colSpan={7} className="px-5 py-16 text-center">
//                     <Users className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
//                     <p className="text-neutral-500">No users found</p>
//                   </td>
//                 </tr>
//               ) : (
//                 filtered.map((user, idx) => (
//                   <motion.tr
//                     key={user._id}
//                     initial={{ opacity: 0 }}
//                     animate={{ opacity: 1 }}
//                     transition={{ delay: idx * 0.02 }}
//                     className={`hover:bg-neutral-50 transition-colors ${actionId === user._id ? 'opacity-50' : ''}`}
//                   >
//                     {/* User */}
//                     <td className="px-5 py-4">
//                       <div className="flex items-center gap-3">
//                         <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
//                           {user.name[0]?.toUpperCase()}
//                         </div>
//                         <div>
//                           <p className="font-medium text-neutral-900 text-sm">{user.name}</p>
//                           {user.role === 'admin' && (
//                             <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
//                               <Crown className="w-3 h-3" /> Admin
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </td>

//                     {/* Email */}
//                     <td className="px-5 py-4">
//                       <p className="text-sm text-neutral-600">{user.email}</p>
//                       {!user.isVerified && (
//                         <span className="text-xs text-amber-600">Not verified</span>
//                       )}
//                     </td>

//                     {/* Phone */}
//                     <td className="px-5 py-4">
//                       <p className="text-sm text-neutral-600">{user.phone || '—'}</p>
//                     </td>

//                     {/* Role */}
//                     <td className="px-5 py-4">
//                       <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
//                         user.role === 'admin'
//                           ? 'bg-amber-100 text-amber-700'
//                           : 'bg-blue-100 text-blue-700'
//                       }`}>
//                         {user.role === 'admin' ? '👑 Admin' : '👤 User'}
//                       </span>
//                     </td>

//                     {/* Status */}
//                     <td className="px-5 py-4">
//                       <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
//                         user.isActive
//                           ? 'bg-green-100 text-green-700'
//                           : 'bg-red-100 text-red-700'
//                       }`}>
//                         {user.isActive ? '✅ Active' : '🚫 Blocked'}
//                       </span>
//                     </td>

//                     {/* Joined */}
//                     <td className="px-5 py-4">
//                       <p className="text-sm text-neutral-500">
//                         {new Date(user.createdAt).toLocaleDateString('en-IN', {
//                           day: 'numeric', month: 'short', year: 'numeric'
//                         })}
//                       </p>
//                     </td>

//                     {/* Actions */}
//                     <td className="px-5 py-4"></td>
//                                       </motion.tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }