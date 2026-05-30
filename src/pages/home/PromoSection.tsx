import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';

const promos = [
  {
    title: 'Up to 40% Off',
    subtitle: 'Summer Sale',
    description: 'On all outdoor and water toys this season.',
    cta: 'Shop Sale',
    href: '/deals',
    image: 'https://images.pexels.com/photos/1001914/pexels-photo-1001914.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-primary-500/80 to-primary-700/80',
    badge: '🔥 Hot Deals',
  },
  {
    title: 'New Arrivals',
    subtitle: 'Just Landed',
    description: 'Explore the latest educational toys for curious minds.',
    cta: 'Explore Now',
    href: '/shop?sort=newest',
    image: 'https://images.pexels.com/photos/3905875/pexels-photo-3905875.jpeg?auto=compress&cs=tinysrgb&w=600',
    gradient: 'from-sky-500/80 to-sky-700/80',
    badge: '✨ New',
  },
];

export default function PromoSection() {
  return (
    <section className="py-10 sm:py-14 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {promos.map((promo, index) => (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, x: index === 0 ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={promo.href} className="group block relative rounded-3xl overflow-hidden aspect-[16/7] shadow-card hover:shadow-card-hover transition-shadow duration-300">
                <img
                  src={promo.image}
                  alt={promo.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${promo.gradient}`} />
                <div className="relative h-full flex flex-col justify-center p-7 sm:p-9">
                  <span className="text-sm font-semibold text-white/90 mb-2">{promo.badge}</span>
                  <h3 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight mb-1">
                    {promo.title}
                  </h3>
                  <p className="text-white/80 text-sm mb-4">{promo.description}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-white/20 hover:bg-white/30 transition-colors rounded-xl px-4 py-2 self-start">
                    {promo.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Flash Deal Banner */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-5 bg-gradient-to-r from-secondary-500 to-primary-500 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-lg">Flash Deal of the Day!</p>
              <p className="text-white/80 text-sm">Limited time offer — 60% off selected LEGO sets</p>
            </div>
          </div>
          <Link to="/deals" className="btn-ghost bg-white text-neutral-800 hover:bg-white/90 whitespace-nowrap px-6 py-2.5 text-sm font-semibold rounded-2xl flex-shrink-0 flex items-center gap-1.5">
            Grab the Deal <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
