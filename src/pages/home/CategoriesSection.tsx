import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    name: 'Building Blocks',
    description: 'Ages 2-8',
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'from-primary-400 to-primary-600',
    bg: 'bg-primary-50',
    count: '240+ items',
    emoji: '🧱',
  },
  {
    name: 'Dolls & Figures',
    description: 'Ages 3-12',
    image: 'https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=400',
    color: 'from-secondary-400 to-secondary-600',
    bg: 'bg-secondary-50',
    count: '180+ items',
    emoji: '🪆',
  },
  {
    name: 'Outdoor Toys',
    description: 'Ages 4-14',
    image: 'https://images.pexels.com/photos/1001914/pexels-photo-1001914.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'from-accent-400 to-accent-600',
    bg: 'bg-accent-50',
    count: '310+ items',
    emoji: '🏃',
  },
  {
    name: 'Educational',
    description: 'Ages 3-10',
    image: 'https://images.pexels.com/photos/3905875/pexels-photo-3905875.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'from-sky-400 to-sky-600',
    bg: 'bg-sky-50',
    count: '195+ items',
    emoji: '📚',
  },
  {
    name: 'Arts & Crafts',
    description: 'Ages 5-15',
    image: 'https://images.pexels.com/photos/1985777/pexels-photo-1985777.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'from-primary-300 to-secondary-400',
    bg: 'bg-primary-50',
    count: '150+ items',
    emoji: '🎨',
  },
  {
    name: 'Remote Control',
    description: 'Ages 6-14',
    image: 'https://images.pexels.com/photos/163036/mario-luigi-yoshi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=400',
    color: 'from-neutral-600 to-neutral-800',
    bg: 'bg-neutral-50',
    count: '120+ items',
    emoji: '🚗',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants:Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function CategoriesSection() {
  return (
    <section className="py-16 sm:py-20 bg-neutral-50">
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
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 uppercase tracking-wider bg-primary-50 border border-primary-100 rounded-full px-3 py-1 mb-3">
              Browse by Category
            </span>
            <h2 className="section-title text-3xl sm:text-4xl">
              Shop by Category
            </h2>
            <p className="text-neutral-500 mt-2 text-sm">
              Find the perfect toy for every age and interest
            </p>
          </div>
          <Link to="/categories" className="btn-outline text-sm whitespace-nowrap flex-shrink-0">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((cat) => (
            <motion.div key={cat.name} variants={cardVariants}>
              <Link
                to={`/shop?category=${cat.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group flex flex-col items-center"
              >
                <div className={`w-full aspect-square rounded-3xl overflow-hidden relative mb-3 shadow-card group-hover:shadow-card-hover transition-shadow duration-300`}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-b ${cat.color} opacity-40 group-hover:opacity-50 transition-opacity duration-300`} />
                  <div className="absolute top-3 left-3 text-2xl">{cat.emoji}</div>
                </div>
                <h3 className="font-display font-semibold text-sm text-neutral-900 text-center group-hover:text-primary-600 transition-colors duration-200">
                  {cat.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">{cat.count}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Age Group Filters */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 flex flex-wrap gap-2 justify-center"
        >
          <span className="text-sm text-neutral-500 self-center mr-2">Shop by Age:</span>
          {['0-2 Years', '3-5 Years', '6-8 Years', '9-12 Years', '13+ Years'].map((age) => (
            <Link
              key={age}
              to={`/shop?ageGroup=${age.split(' ')[0]}`}
              className="px-4 py-2 rounded-full border border-neutral-200 bg-white text-sm font-medium text-neutral-700 hover:border-primary-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
            >
              {age}
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
