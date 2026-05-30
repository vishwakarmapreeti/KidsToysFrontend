import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ShoppingBag, Star, ArrowRight, Sparkles, Shield, Truck } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants:Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

const stats = [
  { value: '50K+', label: 'Happy Kids' },
  { value: '10K+', label: 'Products' },
  { value: '4.9', label: 'Rating', icon: <Star className="w-3 h-3 text-secondary-500 fill-secondary-500 inline" /> },
];

const badges = [
  { icon: Shield, label: 'Safety Certified' },
  { icon: Truck, label: 'Free Shipping $50+' },
  { icon: Sparkles, label: 'New Arrivals Weekly' },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-hero-gradient pt-8 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-28">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-primary-100/60 blur-3xl" />
        <div className="absolute top-1/2 -left-16 w-64 h-64 rounded-full bg-secondary-100/50 blur-3xl" />
        <div className="absolute -bottom-10 right-1/3 w-48 h-48 rounded-full bg-accent-100/50 blur-3xl" />

        {/* Floating dots */}
        {[
          'top-16 left-1/4 w-3 h-3 bg-primary-300',
          'top-1/3 right-16 w-2 h-2 bg-secondary-400',
          'bottom-1/3 left-16 w-2.5 h-2.5 bg-accent-400',
          'bottom-20 right-1/4 w-2 h-2 bg-sky-400',
        ].map((cls, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${cls}`}
            animate={{ y: [0, -12, 0], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 bg-white/80 border border-primary-100 rounded-full px-4 py-2 mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-accent-500 animate-pulse" />
              <span className="text-xs font-semibold text-neutral-700">New Summer Collection is Here!</span>
              <Sparkles className="w-3.5 h-3.5 text-secondary-500" />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-neutral-900 leading-tight mb-5"
            >
              Spark{' '}
              <span className="text-gradient-primary">Joy</span>{' '}
              &amp; Imagination
              <br className="hidden sm:block" />
              in Every{' '}
              <span className="relative inline-block">
                Child
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 120 8" fill="none" preserveAspectRatio="none" style={{ height: '6px' }}>
                  <path d="M2 6C30 2 90 2 118 6" stroke="#FF9500" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-neutral-600 text-lg leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Discover thousands of premium, age-appropriate, and safety-certified toys that turn everyday play into extraordinary adventures.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
              <Link to="/shop" className="btn-primary text-base px-8 py-4">
                <ShoppingBag className="w-5 h-5" />
                Shop Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/categories" className="btn-outline text-base px-8 py-4">
                Explore Categories
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={itemVariants} className="flex items-center gap-6 justify-center lg:justify-start">
              {stats.map(({ value, label, icon }) => (
                <div key={label} className="text-center lg:text-left">
                  <p className="font-display font-bold text-2xl text-neutral-900 leading-none">
                    {value}{icon}
                  </p>
                  <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.97 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main image */}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-card-hover">
                <img
                  src="https://images.pexels.com/photos/3661252/pexels-photo-3661252.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Kids playing with colorful toys"
                  className="w-full h-[420px] sm:h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/20 to-transparent" />
              </div>

              {/* Floating Card 1 - Discount */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="absolute -left-5 top-1/4 bg-white rounded-2xl shadow-card-hover p-3.5 flex items-center gap-3 max-w-44"
              >
                <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🎁</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900">Up to 40% Off</p>
                  <p className="text-2xs text-neutral-500">On featured toys</p>
                </div>
              </motion.div>

              {/* Floating Card 2 - Safety */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.4 }}
                className="absolute -right-5 bottom-1/4 bg-white rounded-2xl shadow-card-hover p-3.5 flex items-center gap-3 max-w-44"
              >
                <div className="w-11 h-11 rounded-xl bg-accent-50 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-accent-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900">100% Safe</p>
                  <p className="text-2xs text-neutral-500">CE & ASTM certified</p>
                </div>
              </motion.div>

              {/* Floating Card 3 - Rating */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                className="absolute top-5 right-5 bg-white rounded-2xl shadow-card p-3 flex items-center gap-2"
              >
                <div className="flex">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 text-secondary-400 fill-secondary-400" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-800">4.9/5</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {badges.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 justify-center bg-white/70 border border-white rounded-2xl px-5 py-3.5 shadow-sm">
              <Icon className="w-5 h-5 text-primary-500 flex-shrink-0" />
              <span className="text-sm font-medium text-neutral-700">{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
