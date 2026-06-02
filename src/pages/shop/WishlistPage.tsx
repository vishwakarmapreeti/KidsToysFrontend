import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Trash2, PackageX, X } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance';

/* ─── Types ───────────────────────────────────────────────── */
interface WishlistProduct {
  _id: string;
  name: string;
  images: string[];
  price: number;
  stock: number;
  category: { name: string };
  description?: string;
}

interface WishlistData {
  products: WishlistProduct[];
}

/* ─── Spinner ─────────────────────────────────────────────── */
const Spinner = () => (
  <div className="flex justify-center items-center py-24">
    <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin" />
  </div>
);

/* ═══════════════════════════════════════════════════════════ */
/*                     WISHLIST PAGE                          */
/* ═══════════════════════════════════════════════════════════ */
export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [cartMsg, setCartMsg] = useState('');
  const navigate = useNavigate();

  const fetchWishlist = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get('/user/wishlist');
      setWishlist(data.wishlist ?? data);
    } catch {
      setError('Could not load your wishlist. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const handleRemove = async (productId: string) => {
    setRemoving(productId);
    try {
      const { data } = await axiosInstance.post(`/user/wishlist/toggle/${productId}`);
      setWishlist(data.wishlist ?? data);
    } catch {
      setError('Could not update wishlist.');
    } finally {
      setRemoving(null);
    }
  };

  const handleClear = async () => {
    if (!confirm('Remove all items from your wishlist?')) return;
    setLoading(true);
    try {
      await axiosInstance.delete('/user/wishlist/clear');
      setWishlist({ products: [] });
    } catch {
      setError('Could not clear wishlist.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (product: WishlistProduct) => {
    setCartLoading(product._id);
    setCartMsg('');
    try {
      await axiosInstance.post('/user/cart', {
        productId: product._id,
        quantity: 1,
        price: product.price,
      });
      setCartMsg(`"${product.name}" added to cart!`);
      setTimeout(() => setCartMsg(''), 3000);
    } catch {
      setError('Could not add to cart. Please try again.');
    } finally {
      setCartLoading(null);
    }
  };

  if (loading) return <Spinner />;

  const isEmpty = !wishlist || wishlist.products.length === 0;
  const count = wishlist?.products.length ?? 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">

        {/* ── Header ── */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-orange-200 text-gray-700 font-semibold text-sm hover:border-orange-400 hover:bg-orange-50 transition-all duration-200 whitespace-nowrap"
          >
            <ArrowLeft size={15} />
            Back
          </button>

          <div className="flex-1 flex items-baseline gap-3 min-w-0">
            <h1 className="flex items-center gap-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">
              <Heart className="text-orange-500 fill-orange-500" size={28} />
              Wishlist
            </h1>
            {!isEmpty && (
              <span className="text-sm font-bold text-orange-400 whitespace-nowrap">
                {count} item{count !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {!isEmpty && (
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-red-200 text-red-500 font-bold text-sm hover:bg-red-50 hover:border-red-300 transition-all duration-200 whitespace-nowrap"
            >
              <Trash2 size={14} />
              Clear All
            </button>
          )}
        </div>

        {/* ── Alerts ── */}
        {error && (
          <div className="flex items-center justify-between bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-5 font-semibold text-sm animate-fadeIn">
            <span>{error}</span>
            <button onClick={() => setError('')} className="ml-3 text-red-400 hover:text-red-600">
              <X size={16} />
            </button>
          </div>
        )}

        {cartMsg && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-5 py-4 mb-5 font-bold text-sm animate-fadeIn">
            <ShoppingCart size={16} className="shrink-0" />
            {cartMsg}
          </div>
        )}

        {/* ── Empty state ── */}
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center text-center py-24 px-6 bg-white rounded-3xl shadow-sm border border-orange-100">
            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6">
              <Heart className="text-orange-300" size={44} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 text-base mb-8 max-w-sm">
              Save items you love and come back to them anytime!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white font-extrabold rounded-full px-9 py-3.5 text-base shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 transition-all duration-200"
            >
              Browse Toys
            </Link>
          </div>
        ) : (
          /* ── Grid ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishlist!.products.map((product) => {
              const busy = removing === product._id;
              const addingToCart = cartLoading === product._id;
              const img = product.images?.[0] ?? '/placeholder.png';
              const inStock = product.stock > 0;

              return (
                <div
                  key={product._id}
                  className={`group relative bg-white rounded-2xl border border-orange-100 shadow-sm hover:shadow-xl hover:shadow-orange-100 hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col ${busy ? 'opacity-40 pointer-events-none' : ''}`}
                >
                  {/* Remove (heart) button */}
                  <button
                    className="absolute top-3 right-3 z-10 w-9 h-9 bg-white border-2 border-orange-100 rounded-full flex items-center justify-center text-orange-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 hover:scale-110 transition-all duration-200 shadow-sm"
                    title="Remove from wishlist"
                    disabled={busy}
                    onClick={() => handleRemove(product._id)}
                  >
                    {busy
                      ? <div className="w-3.5 h-3.5 border-2 border-orange-300 border-t-orange-500 rounded-full animate-spin" />
                      : <Heart size={15} className="fill-current" />
                    }
                  </button>

                  {/* Out-of-stock ribbon */}
                  {!inStock && (
                    <div className="absolute top-5 -left-7 z-10 bg-gray-600 text-white text-[10px] font-extrabold tracking-widest uppercase px-8 py-1 -rotate-45 shadow">
                      Out of Stock
                    </div>
                  )}

                  {/* Product image */}
                  <Link to={`/product/${product._id}`} className="block">
                    <div className="aspect-square bg-orange-50 overflow-hidden">
                      <img
                        src={img}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.png'; }}
                      />
                    </div>
                  </Link>

                  {/* Card body */}
                  <div className="p-4 flex flex-col gap-2 flex-1">
                    <span className="self-start text-[10px] font-extrabold tracking-widest uppercase text-orange-500 bg-orange-50 rounded-full px-3 py-0.5">
                      {product.category?.name}
                    </span>

                    <Link
                      to={`/product/${product._id}`}
                      className="font-extrabold text-[0.95rem] text-gray-900 leading-snug hover:text-orange-500 transition-colors duration-150 line-clamp-2"
                    >
                      {product.name}
                    </Link>

                    {product.description && (
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-orange-50">
                      <span className="text-xl font-extrabold text-gray-900 tracking-tight">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>

                      <button
                        disabled={!inStock || addingToCart}
                        onClick={() => inStock && handleAddToCart(product)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
                          inStock
                            ? 'bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white shadow-md shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {addingToCart ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <ShoppingCart size={13} />
                        )}
                        {addingToCart ? 'Adding...' : inStock ? 'Add to Cart' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Bottom summary bar (non-empty) ── */}
        {!isEmpty && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-orange-100 shadow-sm px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center">
                <Heart className="text-orange-500 fill-orange-500" size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total items</p>
                <p className="text-xl font-extrabold text-gray-900">{count} {count === 1 ? 'item' : 'items'} saved</p>
              </div>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white font-extrabold rounded-full px-8 py-3 text-sm shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:-translate-y-0.5 transition-all duration-200 w-full sm:w-auto justify-center"
            >
              <PackageX size={16} />
              Continue Shopping
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: none; }
        }
        .animate-fadeIn { animation: fadeIn .25s ease; }
      `}</style>
    </div>
  );
}
