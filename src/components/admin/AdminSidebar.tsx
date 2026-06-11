import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Tag, ShoppingBag,
  Users, CreditCard, Star, LogOut, ChevronRight,
} from 'lucide-react';
import authService from '../../services/authService';

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard',   path: '/admin/dashboard' },
  { icon: Package,         label: 'Products',    path: '/admin/products' },
  { icon: Tag,             label: 'Categories',  path: '/admin/categories' },
  { icon: ShoppingBag,     label: 'Orders',      path: '/admin/orders' },
  { icon: Users,           label: 'Users',       path: '/admin/users' },
  { icon: CreditCard,      label: 'Transactions', path: '/admin/transactions' },
];

interface Props {
  isOpen:        boolean;
  mobileOpen:    boolean;
  onMobileClose: () => void;
}

export default function AdminSidebar({ isOpen, mobileOpen, onMobileClose }: Props) {
  const navigate   = useNavigate();
  const user       = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = async () => {
    await authService.logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1A1040] text-white">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center flex-shrink-0 shadow-lg">
          <Star className="w-5 h-5 text-white fill-white" />
        </div>
        <AnimatePresence>
          {(isOpen || mobileOpen) && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <p className="font-bold text-base whitespace-nowrap">
                Kids<span className="text-[#FF6B6B]">Toys</span>
              </p>
              <p className="text-xs text-white/40 whitespace-nowrap">Admin Panel</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={path}
            to={path}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
              ${isActive
                ? 'bg-[#FF6B6B] text-white shadow-lg shadow-[#FF6B6B]/30'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`} />
                <AnimatePresence>
                  {(isOpen || mobileOpen) && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="text-sm font-medium whitespace-nowrap overflow-hidden"
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (isOpen || mobileOpen) && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        {(isOpen || mobileOpen) && (
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name || 'Admin'}</p>
              <p className="text-xs text-white/40 truncate">{user?.email || ''}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(isOpen || mobileOpen) && (
            <span className="text-sm font-medium">Logout</span>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}
      >
       
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-y-0 left-0 z-40 w-72 lg:hidden"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}