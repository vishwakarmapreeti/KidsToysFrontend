import { Bell, Menu, Search, ChevronLeft, ExternalLink } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface Props {
  sidebarOpen:       boolean;
  onToggleSidebar:   () => void;
  onMobileMenuClick: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  '/admin/dashboard':    'Dashboard',
  '/admin/products':     'Products',
  '/admin/categories':   'Categories',
  '/admin/orders':       'Orders',
  '/admin/users':        'Users',
  '/admin/transactions': 'Transactions',
};

export default function AdminNavbar({ sidebarOpen, onToggleSidebar, onMobileMenuClick }: Props) {
  const location = useLocation();
  const title    = PAGE_TITLES[location.pathname] || 'Admin';

  return (
    <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 h-16 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-neutral-600" />
        </button>

        {/* Desktop toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex p-2 rounded-xl hover:bg-neutral-100 transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 text-neutral-600 transition-transform duration-300 ${!sidebarOpen ? 'rotate-180' : ''}`} />
        </button>

        <div>
          <h1 className="font-bold text-lg text-neutral-900">{title}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-neutral-100 rounded-xl px-3 py-2 w-52">
          <Search className="w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-neutral-600 placeholder:text-neutral-400 focus:outline-none w-full"
          />
        </div>

        {/* View site */}
        <Link
          to="/"
          target="_blank"
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-primary-600 transition-colors px-3 py-2 rounded-xl hover:bg-neutral-100"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          View Site
        </Link>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl hover:bg-neutral-100 transition-colors">
          <Bell className="w-5 h-5 text-neutral-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6B6B] rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center text-white font-bold text-sm cursor-pointer">
          {JSON.parse(localStorage.getItem('user') || '{}')?.name?.[0]?.toUpperCase() || 'A'}
        </div>
      </div>
    </header>
  );
}