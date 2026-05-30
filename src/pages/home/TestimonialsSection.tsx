import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Mom of 2',
    avatar: 'https://images.pexels.com/photos/1587009/pexels-photo-1587009.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: "My kids absolutely love the toys from KidsToys! The quality is outstanding and everything arrived safely. We've been customers for 2 years now.",
    product: 'Building Blocks Set',
  },
  {
    name: 'Michael Chen',
    role: 'Dad of 3',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'Incredible selection of educational toys. My daughter spent hours with the science kit and learned so much. Will definitely order again!',
    product: 'Science Discovery Kit',
  },
  {
    name: 'Emily Rodriguez',
    role: 'Mom of 1',
    avatar: 'https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=150',
    rating: 5,
    text: 'Fast shipping, beautiful packaging, and the toys are just as described. Customer service was amazing when I had a question. Highly recommend!',
    product: 'Princess Doll Collection',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 uppercase tracking-wider bg-sky-50 border border-sky-100 rounded-full px-3 py-1 mb-3">
            What Parents Say
          </span>
          <h2 className="section-title text-3xl sm:text-4xl">
            Loved by Families
          </h2>
          <p className="text-neutral-500 mt-2 text-sm max-w-md mx-auto">
            Don't just take our word for it — here's what real parents say
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.1 }}
              className="card p-6 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} className={`w-4 h-4 ${s <= t.rating ? 'text-secondary-400 fill-secondary-400' : 'text-neutral-200'}`} />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-primary-200" />
              </div>

              <p className="text-sm text-neutral-600 leading-relaxed flex-1">
                "{t.text}"
              </p>

              <div className="pt-3 border-t border-neutral-100 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
                <div>
                  <p className="font-semibold text-sm text-neutral-900">{t.name}</p>
                  <p className="text-xs text-neutral-500">{t.role} · Bought {t.product}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Aggregate Rating */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 bg-neutral-50 rounded-3xl px-8 py-6"
        >
          <div className="text-center sm:text-left">
            <p className="font-display font-extrabold text-5xl text-neutral-900">4.9</p>
            <div className="flex justify-center sm:justify-start mt-1">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="w-5 h-5 text-secondary-400 fill-secondary-400" />
              ))}
            </div>
          </div>
          <div className="w-px h-12 bg-neutral-200 hidden sm:block" />
          <div className="text-center sm:text-left">
            <p className="font-semibold text-neutral-900 text-lg">Based on 12,500+ reviews</p>
            <p className="text-sm text-neutral-500 mt-0.5">Across Google, Trustpilot & our store</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
