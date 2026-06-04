import { useState, useEffect,useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Search, Menu, X, User, LogOut, ChevronDown, Star, Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/categories' },
  { label: 'Deals', href: '/deals' },
  { label: 'About', href: '/about' },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, openCart }      = useCart();
const { wishlistCount }            = useWishlist();
const userMenuRef = useRef<HTMLDivElement>(null);
const userButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      userMenuRef.current &&
      !userMenuRef.current.contains(event.target as Node) &&
      userButtonRef.current &&
      !userButtonRef.current.contains(event.target as Node)
    ) {
      setUserMenuOpen(false);
    }
  };

  document.addEventListener('mousedown', handleClickOutside);

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow duration-200">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-display font-bold text-xl text-neutral-900">
                Kids<span className="text-gradient-primary">Toys</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                    location.pathname === link.href
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="btn-ghost p-2 rounded-xl"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
             <Link to="/wishlist" className="relative p-2">
  <Heart className="w-5 h-5" />
  {wishlistCount > 0 && (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
      {wishlistCount}
    </span>
  )}
</Link>

              {/* Cart */}
            <button onClick={openCart} className="relative p-2">
  <ShoppingCart className="w-5 h-5" />
  {cartCount > 0 && (
    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
      {cartCount}
    </span>
  )}
</button>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="relative hidden sm:block">
                 <button
  ref={userButtonRef}
  onClick={() => setUserMenuOpen(!userMenuOpen)}
  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-neutral-100 transition-colors duration-200"
>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold text-sm">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-neutral-700 max-w-20 truncate hidden md:block">
                      {user?.name}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        ref={userMenuRef}
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-card-hover border border-neutral-100 overflow-hidden"
                      >
                        <div className="p-3 border-b border-neutral-100">
                          <p className="font-semibold text-neutral-900 text-sm">{user?.name}</p>
                          <p className="text-neutral-500 text-xs truncate">{user?.email}</p>
                        </div>
                        <div className="p-1.5">
                          <Link to="/profile" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                            <User className="w-4 h-4 text-neutral-400" />
                            My Profile
                          </Link>
                          <Link to="/orders" className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-neutral-700 hover:bg-neutral-50 transition-colors">
                            <Package className="w-4 h-4 text-neutral-400" />
                            My Orders
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-error-500 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Link to="/login" className="btn-ghost text-sm px-4 py-2">
                    Login
                  </Link>
                  <Link to="/register" className="btn-primary text-sm px-4 py-2.5">
                    Sign Up
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="btn-ghost p-2 rounded-xl lg:hidden"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden border-t border-neutral-100 bg-white"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`flex items-center px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                      location.pathname === link.href
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="pt-3 border-t border-neutral-100 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 rounded-xl">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white font-semibold">
                          {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-neutral-900">{user?.name}</p>
                          <p className="text-xs text-neutral-500">{user?.email}</p>
                        </div>
                      </div>
                      <Link to="/profile" className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-neutral-700 hover:bg-neutral-50">
                        <User className="w-4 h-4 text-neutral-400" /> My Profile
                      </Link>
                      <Link to="/orders" className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-neutral-700 hover:bg-neutral-50">
                        <Package className="w-4 h-4 text-neutral-400" /> My Orders
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm text-error-500 hover:bg-red-50">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </>
                  ) : (
                    <div className="flex gap-2">
                      <Link to="/login" className="flex-1 btn-outline text-sm py-2.5 text-center">Login</Link>
                      <Link to="/register" className="flex-1 btn-primary text-sm py-2.5 text-center">Sign Up</Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-xl bg-white rounded-3xl shadow-card-hover p-4"
            >
              <form onSubmit={handleSearch} className="flex items-center gap-3">
                <Search className="w-5 h-5 text-neutral-400 flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search for toys, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-base text-neutral-800 placeholder-neutral-400 bg-transparent focus:outline-none"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="btn-ghost p-1.5 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
