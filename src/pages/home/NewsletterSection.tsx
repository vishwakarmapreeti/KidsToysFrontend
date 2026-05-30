import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle, Gift, Percent, Bell } from 'lucide-react';

const perks = [
  { icon: Gift, text: 'Exclusive offers & early access' },
  { icon: Percent, text: '10% off your first order' },
  { icon: Bell, text: 'New arrivals & restocks alerts' },
];

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-secondary-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Badge */}
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-secondary-400 uppercase tracking-wider border border-secondary-500/30 rounded-full px-3 py-1 mb-5">
            <Mail className="w-3 h-3" />
            Newsletter
          </span>

          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white mb-4 leading-tight">
            Get Exclusive Deals &amp;{' '}
            <span className="text-gradient-primary">Special Offers</span>
          </h2>

          <p className="text-neutral-400 text-base mb-8 max-w-xl mx-auto leading-relaxed">
            Join 50,000+ parents who get the best toy deals, new arrivals, and parenting tips delivered to their inbox.
          </p>

          {/* Perks */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 mb-10">
            {perks.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm text-neutral-300 justify-center">
                <Icon className="w-4 h-4 text-secondary-400 flex-shrink-0" />
                {text}
              </div>
            ))}
          </div>

          {/* Form */}
          {!submitted ? (
            <motion.form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="Enter your email address"
                  className="w-full px-5 py-3.5 rounded-2xl bg-white/10 border border-white/20 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all duration-200 text-sm"
                />
                {error && <p className="text-xs text-red-400 mt-1.5 text-left pl-1">{error}</p>}
              </div>
              <button
                type="submit"
                className="btn-primary whitespace-nowrap py-3.5 px-7 text-sm"
              >
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="flex items-center justify-center gap-3 bg-accent-500/20 border border-accent-500/30 rounded-2xl px-8 py-4 max-w-md mx-auto"
            >
              <CheckCircle className="w-5 h-5 text-accent-400 flex-shrink-0" />
              <p className="text-accent-300 font-medium text-sm">
                You're subscribed! Check your inbox for a 10% off code.
              </p>
            </motion.div>
          )}

          <p className="mt-5 text-xs text-neutral-600">
            No spam, ever. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
