import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Minus, Plus, Check } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AlertMessage from '../../components/common/AlertMessage';
import productService from '../../services/productService';
import type { Product } from '../../services/productService';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= Math.floor(rating) ? 'text-secondary-400 fill-secondary-400' : 'text-neutral-200 fill-neutral-200'}`}
        />
      ))}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    if (!id) return;
    setIsLoading(true);
    setError('');
    try {
      const res = await productService.getProduct(id);
      setProduct(res.data.product);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load product');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <AlertMessage type="error" message={error || 'Product not found'} />
          <button onClick={() => navigate('/shop')} className="btn-primary mt-6">
            <ChevronLeft className="w-4 h-4" />
            Back to Shop
          </button>
        </div>
      </Layout>
    );
  }

  const discount = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;
  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (value: number) => {
    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-2 text-sm text-neutral-600 mb-8"
        >
          <Link to="/" className="hover:text-primary-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-primary-600 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-neutral-900 font-medium">{product.name}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="bg-neutral-100 rounded-3xl overflow-hidden mb-4 aspect-square flex items-center justify-center">
              <img
                src={product.images[selectedImage] || 'https://via.placeholder.com/500'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImage === idx
                        ? 'border-primary-500 shadow-md'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col"
          >
            {/* Header */}
            <div className="mb-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wide mb-2">
                    {product.brand}
                  </p>
                  <h1 className="font-display font-bold text-3xl sm:text-4xl text-neutral-900 leading-tight">
                    {product.name}
                  </h1>
                </div>
                <button className="p-2.5 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-600 hover:text-error-500">
                  <Heart className="w-6 h-6" />
                </button>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <StarRating rating={product.ratings} />
                  <span className="font-semibold text-neutral-900">{product.ratings}</span>
                </div>
                <span className="text-sm text-neutral-500">({product.numReviews} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-neutral-200">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-display font-bold text-4xl text-neutral-900">
                  ₹{displayPrice.toFixed(2)}
                </span>
                {product.discountPrice > 0 && (
                  <>
                    <span className="text-lg text-neutral-400 line-through">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span className="text-lg font-bold text-error-500">
                      Save {discount}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-neutral-600">
                {product.stock > 0 ? (
                  <span className="flex items-center gap-1.5 text-accent-600">
                    <Check className="w-4 h-4" /> In Stock
                  </span>
                ) : (
                  <span className="text-error-600">Out of Stock</span>
                )}
              </p>
            </div>

            {/* Description */}
            <div className="mb-6 pb-6 border-b border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-2">About this product</h3>
              <p className="text-neutral-600 leading-relaxed line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* Key Info */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              {[
                { label: 'Age Group', value: product.ageGroup ? `${product.ageGroup} years` : 'All ages' },
                { label: 'Category', value: typeof product.category === 'string' ? product.category : product.category.name },
                { label: 'Brand', value: product.brand },
                { label: 'Stock', value: `${product.stock} available` },
              ].map(({ label, value }) => (
                <div key={label} className="p-3 bg-neutral-50 rounded-xl">
                  <p className="text-2xs font-semibold text-neutral-500 uppercase tracking-wide mb-0.5">
                    {label}
                  </p>
                  <p className="text-sm font-medium text-neutral-900">{value}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-8">
              <div className="flex gap-3">
                <div className="flex items-center gap-3 border border-neutral-200 rounded-xl px-4 py-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-1 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4 text-neutral-600" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    className="w-12 text-center font-semibold text-neutral-900 bg-transparent focus:outline-none"
                    min="1"
                    max={product.stock}
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                    className="p-1 hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4 text-neutral-600" />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="btn-primary w-full py-3.5 text-base"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
                <ChevronRight className="w-4 h-4" />
              </button>

              {addedToCart && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-center gap-2 text-accent-600 font-medium text-sm p-3 bg-accent-50 rounded-xl"
                >
                  <Check className="w-4 h-4" /> Added to cart!
                </motion.div>
              )}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { icon: Truck, label: 'Free Shipping', desc: 'On orders $50+' },
                { icon: RotateCcw, label: '30-Day Returns', desc: 'Easy returns' },
                { icon: Shield, label: '100% Safe', desc: 'Certified toys' },
              ].map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl">
                  <Icon className="w-5 h-5 text-primary-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-neutral-900 leading-tight">{label}</p>
                    <p className="text-2xs text-neutral-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Share */}
            <button className="mt-8 flex items-center justify-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors font-medium">
              <Share2 className="w-4 h-4" /> Share Product
            </button>
          </motion.div>
        </div>

        {/* Related Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-20 pt-16 border-t border-neutral-200"
        >
          <h2 className="font-display font-bold text-2xl text-neutral-900 mb-8">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card p-4 h-56 bg-neutral-50 animate-pulse rounded-2xl" />
            ))}
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
