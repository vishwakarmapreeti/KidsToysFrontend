import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, X, Sliders, Grid3x3, Grid2x2, ChevronDown } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import FilterPanel from '../../components/common/FilterPanel';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import productService from '../../services/productService';
import type { Product } from '../../services/productService';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3 h-3 ${s <= Math.floor(rating) ? 'text-secondary-400 fill-secondary-400' : 'text-neutral-200 fill-neutral-200'}`}
        />
      ))}
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const discount = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card group flex flex-col overflow-hidden"
    >
      <div className="relative overflow-hidden">
        <img
          src={product.images[0] || 'https://via.placeholder.com/300'}
          alt={product.name}
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-full bg-primary-500 text-white">
          {product.brand}
        </div>
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-error-500 text-white text-2xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 flex gap-2 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-xl py-2 text-xs font-semibold text-neutral-800 hover:bg-primary-500 hover:text-white transition-all duration-200 shadow-sm">
            <ShoppingCart className="w-3.5 h-3.5" />
            Add
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-xl hover:bg-primary-50 transition-colors duration-200 shadow-sm text-neutral-600 hover:text-primary-500">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
        <p className="text-2xs font-semibold text-neutral-400 uppercase tracking-wide mb-1">
          {typeof product.category === 'string' ? product.category : product.category.name}
        </p>
        <h3 className="font-display font-semibold text-sm text-neutral-900 line-clamp-2 hover:text-primary-600 transition-colors mb-2 flex-1 leading-snug">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.ratings} />
          <span className="text-xs text-neutral-500">({product.numReviews})</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-lg text-neutral-900">
              ₹{product.discountPrice > 0 ? product.discountPrice.toFixed(2) : product.price.toFixed(2)}
            </span>
            {product.discountPrice > 0 && (
              <span className="text-xs text-neutral-400 line-through">₹{product.price.toFixed(2)}</span>
            )}
          </div>
          <span className="text-2xs font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
            {product.ageGroup} yrs
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);
  const [gridSize, setGridSize] = useState<'sm' | 'lg'>('lg');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [filters, setFilters] = useState({
    priceRange: [0, 10000] as [number, number],
    ageGroups: [] as string[],
    brands: [] as string[],
    minRating: 0,
  });

  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = (searchParams.get('sort') as any) || 'newest';

  useEffect(() => {
    loadProducts();
  }, [currentPage, filters, keyword, category, sort]);

  const loadProducts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await productService.getProducts({
        keyword: keyword || undefined,
        category: category || undefined,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        ageGroup: filters.ageGroups.length > 0 ? filters.ageGroups[0] : undefined,
        sort: sort || 'newest',
        page: currentPage,
        limit: 12,
      });
      setProducts(res.data.products);
      setTotalProducts(res.data.total);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePriceChange = (min: number, max: number) => {
    setFilters((prev) => ({ ...prev, priceRange: [min, max] }));
    setCurrentPage(1);
  };

  const handleAgeGroupChange = (ages: string[]) => {
    setFilters((prev) => ({ ...prev, ageGroups: ages }));
    setCurrentPage(1);
  };

  const handleBrandChange = (brands: string[]) => {
    setFilters((prev) => ({ ...prev, brands }));
    setCurrentPage(1);
  };

  const handleRatingChange = (rating: number) => {
    setFilters((prev) => ({ ...prev, minRating: rating }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      priceRange: [0, 10000],
      ageGroups: [],
      brands: [],
      minRating: 0,
    });
    setCurrentPage(1);
  };

  const gridCols = gridSize === 'sm' ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4';
  const totalPages = Math.ceil(totalProducts / 12);

  return (
    <Layout>
      {/* Header */}
      <section className="bg-hero-gradient py-8 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-neutral-900 mb-2">
              Shop All Toys
            </h1>
            <p className="text-neutral-600">
              {totalProducts} products found
              {keyword && ` for "${keyword}"`}
              {category && ` in ${category}`}
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Desktop */}
          <div className="hidden lg:block">
            <FilterPanel
              onPriceChange={handlePriceChange}
              onAgeGroupChange={handleAgeGroupChange}
              onBrandChange={handleBrandChange}
              onRatingChange={handleRatingChange}
              activeFilters={filters}
              onReset={handleResetFilters}
            />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors text-sm font-medium"
                >
                  <Sliders className="w-4 h-4" />
                  Filters
                </button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 p-1 bg-neutral-100 rounded-xl">
                  <button
                    onClick={() => setGridSize('lg')}
                    className={`p-2 rounded-lg transition-colors ${gridSize === 'lg' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                  >
                    <Grid2x2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setGridSize('sm')}
                    className={`p-2 rounded-lg transition-colors ${gridSize === 'sm' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors text-sm font-medium">
                    Sort: Newest
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-24">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-100">
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-24">
                <p className="text-neutral-600 text-lg font-medium mb-4">No products found</p>
                <button onClick={handleResetFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`grid ${gridCols} gap-4 sm:gap-5`}
                >
                  {products.map((product, idx) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="mt-10 flex items-center justify-center gap-2"
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-primary-500 text-white shadow-md'
                            : 'border border-neutral-200 text-neutral-700 hover:border-primary-300 hover:text-primary-600'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden">
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-y-0 left-0 w-80 bg-white shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 flex items-center justify-between p-4 bg-white border-b border-neutral-100 z-10">
              <h2 className="font-display font-bold text-neutral-900">Filters</h2>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FilterPanel
                onPriceChange={handlePriceChange}
                onAgeGroupChange={handleAgeGroupChange}
                onBrandChange={handleBrandChange}
                onRatingChange={handleRatingChange}
                activeFilters={filters}
                onReset={handleResetFilters}
              />
            </div>
          </motion.div>
        </div>
      )}
    </Layout>
  );
}