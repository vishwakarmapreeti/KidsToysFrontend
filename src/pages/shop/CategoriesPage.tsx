import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, LayoutGrid } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import categoryService from '../../services/categoryService';
import type { Category } from '../../services/categoryService';

// ✅ Har category ke liye color aur emoji auto-assign
const COLORS = [
  'from-primary-500 to-primary-600',
  'from-secondary-500 to-secondary-600',
  'from-accent-500 to-accent-600',
  'from-sky-500 to-sky-600',
  'from-purple-500 to-pink-500',
  'from-pink-400 to-red-400',
  'from-neutral-600 to-neutral-800',
  'from-primary-400 to-secondary-500',
];

const EMOJIS = ['🧸', '🎮', '🧩', '🎨', '🏃', '🪆', '🧱', '📚'];

const DEFAULT_IMAGE = 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=600';

// Skeleton loader
function CategorySkeleton() {
  return (
    <div className="card overflow-hidden animate-pulse">
      <div className="aspect-[4/3] bg-neutral-200" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-full" />
        <div className="h-4 bg-neutral-200 rounded w-2/3" />
        <div className="flex justify-between mt-4">
          <div className="h-6 bg-neutral-200 rounded-full w-20" />
          <div className="h-6 bg-neutral-200 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [error, setError]           = useState('');

  useEffect(() => {
    categoryService.getCategories()
      .then(res => setCategories(res.data.categories))
      .catch(() => setError('Failed to load categories'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-hero-gradient pt-10 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid className="w-5 h-5 text-primary-600" />
              <span className="text-sm font-semibold text-primary-600 uppercase tracking-wide">
                Browse Categories
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl text-neutral-900 mb-4 leading-tight">
              Shop by{' '}
              <span className="text-gradient-primary">Category</span>
            </h1>
            <p className="text-neutral-600 text-lg leading-relaxed max-w-2xl">
              Explore our wide range of carefully curated toy categories, each designed to
              spark joy and inspire imagination in children of all ages.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Error */}
          {error && (
            <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-100 mb-8">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Loading skeletons */}
            {isLoading && Array.from({ length: 8 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}

            {/* ✅ DB se categories */}
            {!isLoading && categories.map((cat, idx) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
              >
                <Link
                  to={`/shop?category=${cat.slug}`}
                  className="group block h-full"
                >
                  <div className="card h-full flex flex-col overflow-hidden hover:shadow-card-hover transition-all duration-300">
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-[4/3]">
                      <img
                        src={cat.image || DEFAULT_IMAGE}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                        }}
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${COLORS[idx % COLORS.length]} opacity-30 group-hover:opacity-40 transition-opacity duration-300`}
                      />
                      <div className="absolute top-4 right-4 text-4xl drop-shadow-lg">
                        {EMOJIS[idx % EMOJIS.length]}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-5 flex flex-col">
                      <h3 className="font-display font-bold text-lg text-neutral-900 mb-1.5">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-neutral-600 mb-4 flex-1 line-clamp-2">
                        {cat.description || 'Explore amazing toys in this category'}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                          View Products
                        </span>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-primary-600 group-hover:text-primary-700 transition-colors">
                          Shop <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}

            {/* Empty state */}
            {!isLoading && categories.length === 0 && !error && (
              <div className="col-span-4 text-center py-16">
                <p className="text-neutral-500 text-lg">No categories found</p>
                <p className="text-neutral-400 text-sm mt-2">Add categories from the admin panel</p>
              </div>
            )}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="mt-16 text-center"
          >
            <Link to="/shop" className="btn-primary text-base px-10 py-3.5">
              Browse All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 sm:py-20 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🎯', title: 'Curated Selection', desc: 'Every toy is handpicked for quality, safety, and educational value.' },
              { icon: '✅', title: 'Safety Certified', desc: 'All products meet CE and ASTM safety standards for peace of mind.' },
              { icon: '🎁', title: 'Age-Appropriate', desc: "Find toys perfectly suited to your child's age and development stage." },
            ].map(({ icon, title, desc }, idx) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl mb-3">{icon}</div>
                <h3 className="font-display font-bold text-lg text-neutral-900 mb-2">{title}</h3>
                <p className="text-neutral-600 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}