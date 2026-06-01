import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, ArrowRight, Zap } from 'lucide-react';

const products = [
  {
    id: '1',
    name: 'Mega Build City Set',
    brand: 'BrickMaster',
    price: 89.99,
    discountPrice: 59.99,
    ratings: 4.9,
    numReviews: 324,
    ageGroup: '6-8',
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    badge: 'Best Seller',
    badgeColor: 'bg-primary-500',
  },
  {
    id: '2',
    name: 'Princess Adventure Doll',
    brand: 'DreamPlay',
    price: 45.00,
    discountPrice: 35.99,
    ratings: 4.7,
    numReviews: 218,
    ageGroup: '3-5',
    image: 'https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=400',
    badge: 'New',
    badgeColor: 'bg-accent-500',
  },
  {
    id: '3',
    name: 'RC Speed Racer Car',
    brand: 'TurboKidz',
    price: 75.00,
    discountPrice: 0,
    ratings: 4.8,
    numReviews: 156,
    ageGroup: '6-8',
    image: 'https://images.pexels.com/photos/163036/mario-luigi-yoshi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400',
    badge: 'Popular',
    badgeColor: 'bg-secondary-500',
  },
  {
    id: '4',
    name: 'Outdoor Explorer Kit',
    brand: 'AdventureKids',
    price: 55.00,
    discountPrice: 42.99,
    ratings: 4.6,
    numReviews: 89,
    ageGroup: '9-12',
    image: 'https://images.pexels.com/photos/1001914/pexels-photo-1001914.jpeg?auto=compress&cs=tinysrgb&w=400',
    badge: 'Sale',
    badgeColor: 'bg-error-500',
  },
  {
    id: '5',
    name: 'Rainbow Art Station',
    brand: 'CreateKids',
    price: 38.00,
    discountPrice: 29.99,
    ratings: 4.9,
    numReviews: 205,
    ageGroup: '5-8',
    image: 'https://images.pexels.com/photos/1985777/pexels-photo-1985777.jpeg?auto=compress&cs=tinysrgb&w=400',
    badge: 'Staff Pick',
    badgeColor: 'bg-sky-500',
  },
  {
    id: '6',
    name: 'Science Lab Discovery Set',
    brand: 'ThinkSmart',
    price: 65.00,
    discountPrice: 0,
    ratings: 4.8,
    numReviews: 134,
    ageGroup: '9-12',
    image: 'https://images.pexels.com/photos/3905875/pexels-photo-3905875.jpeg?auto=compress&cs=tinysrgb&w=400',
    badge: 'Educational',
    badgeColor: 'bg-accent-500',
  },
  {
    id: '7',
    name: 'Toddler Stacking Rings',
    brand: 'BabyJoy',
    price: 22.00,
    discountPrice: 17.99,
    ratings: 4.7,
    numReviews: 412,
    ageGroup: '0-2',
    image: 'https://images.pexels.com/photos/3661252/pexels-photo-3661252.jpeg?auto=compress&cs=tinysrgb&w=400',
    badge: 'Top Rated',
    badgeColor: 'bg-primary-500',
  },
  {
    id: '8',
    name: 'Musical Keyboard Junior',
    brand: 'MusicKidz',
    price: 49.00,
    discountPrice: 39.99,
    ratings: 4.5,
    numReviews: 77,
    ageGroup: '3-5',
    image: 'https://images.pexels.com/photos/3905875/pexels-photo-3905875.jpeg?auto=compress&cs=tinysrgb&w=400',
    badge: 'New',
    badgeColor: 'bg-accent-500',
  },
];

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

function ProductCard({ product }: { product: typeof products[0] }) {
  const discount = product.discountPrice > 0
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="card group flex flex-col overflow-hidden"
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Badge */}
        <span className={`absolute top-3 left-3 ${product.badgeColor} text-white text-2xs font-bold px-2.5 py-1 rounded-full`}>
          {product.badge}
        </span>
        {discount > 0 && (
          <span className="absolute top-3 right-3 bg-error-500 text-white text-2xs font-bold px-2 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        {/* Hover Actions */}
        <div className="absolute inset-x-0 bottom-0 flex gap-2 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="flex-1 flex items-center justify-center gap-1.5 bg-white/95 backdrop-blur-sm rounded-xl py-2 text-xs font-semibold text-neutral-800 hover:bg-primary-500 hover:text-white transition-all duration-200 shadow-sm">
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </button>
          <button className="w-9 h-9 flex items-center justify-center bg-white/95 backdrop-blur-sm rounded-xl hover:bg-primary-50 transition-colors duration-200 shadow-sm text-neutral-600 hover:text-primary-500">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-2xs font-semibold text-neutral-400 uppercase tracking-wide mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`} className="font-display font-semibold text-sm text-neutral-900 line-clamp-2 hover:text-primary-600 transition-colors mb-2 leading-snug flex-1">
          {product.name}
        </Link>

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
              <span className="text-xs text-neutral-400 line-through">${product.price.toFixed(2)}</span>
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

export default function FeaturedProductsSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-600 uppercase tracking-wider bg-secondary-50 border border-secondary-100 rounded-full px-3 py-1 mb-3">
              <Zap className="w-3 h-3" />
              Featured Picks
            </span>
            <h2 className="section-title text-3xl sm:text-4xl">
              Trending Toys
            </h2>
            <p className="text-neutral-500 mt-2 text-sm">
              Handpicked favorites loved by kids and parents alike
            </p>
          </div>
          <Link to="/shop?featured=true" className="btn-outline text-sm whitespace-nowrap flex-shrink-0">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* View More CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 text-center"
        >
          <Link to="/shop" className="btn-primary text-base px-10 py-3.5">
            Browse All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
