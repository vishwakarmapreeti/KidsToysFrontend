import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const categories = [
  {
    name: 'Building Blocks',
    description: 'Ages 2–8',
    image: 'https://images.pexels.com/photos/1148998/pexels-photo-1148998.jpeg?auto=compress&cs=tinysrgb&w=800',
    count: '240+ items',
    badge: 'Best Seller',
  },
  {
    name: 'Dolls & Figures',
    description: 'Ages 3–12',
    image: 'https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=600',
    count: '180+ items',
    badge: null,
  },
  {
    name: 'Outdoor Toys',
    description: 'Ages 4–14',
    image: 'https://images.pexels.com/photos/1001914/pexels-photo-1001914.jpeg?auto=compress&cs=tinysrgb&w=600',
    count: '310+ items',
    badge: 'New In',
  },
  {
    name: 'Educational',
    description: 'Ages 3–10',
    image: 'https://images.pexels.com/photos/3905875/pexels-photo-3905875.jpeg?auto=compress&cs=tinysrgb&w=600',
    count: '195+ items',
    badge: null,
  },
  {
    name: 'Arts & Crafts',
    description: 'Ages 5–15',
    image: 'https://images.pexels.com/photos/1985777/pexels-photo-1985777.jpeg?auto=compress&cs=tinysrgb&w=600',
    count: '150+ items',
    badge: null,
  },
  {
    name: 'Remote Control',
    description: 'Ages 6–14',
    image: 'https://images.pexels.com/photos/163036/mario-luigi-yoshi-figures-163036.jpeg?auto=compress&cs=tinysrgb&w=600',
    count: '120+ items',
    badge: 'Sale',
  },
];

const ageGroups = ['0–2 Years', '3–5 Years', '6–8 Years', '9–12 Years', '13+ Years'];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

type Category = (typeof categories)[number];

function CategoryCard({
  cat,
  featured = false,
}: {
  cat: Category;
  featured?: boolean;
}) {
  const slug = cat.name.toLowerCase().replace(/\s+/g, '-');
  return (
    <Link
      to={`/shop?category=${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl md:rounded-3xl h-full"
      style={{
        boxShadow:
          '0 2px 8px rgba(0,0,0,0.07), 0 8px 32px rgba(0,0,0,0.08)',
      }}
    >
      {/* Image */}
      <div
        className={`relative w-full overflow-hidden flex-1 ${
          featured ? 'min-h-[340px] md:min-h-[480px]' : 'min-h-[200px] md:min-h-[260px]'
        }`}
      >
        <img
          src={cat.image}
          alt={cat.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
        />

        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-900/30 to-stone-900/0" />

        {/* Orange hover wash */}
        <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/12 transition-colors duration-500" />

        {/* Top fade for badge readability */}
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-stone-950/30 to-transparent" />
      </div>

      {/* Badge */}
      {cat.badge && (
        <span className="absolute top-4 left-4 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-orange-500/40">
          {cat.badge}
        </span>
      )}

      {/* Arrow button */}
      <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out">
        <ArrowRight className="w-4 h-4 text-white" />
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
        <p className="text-orange-300 text-[11px] font-bold uppercase tracking-[0.12em] mb-1.5 opacity-90">
          {cat.description}
        </p>
        <h3
          className={`text-white font-black leading-tight tracking-tight ${
            featured ? 'text-2xl md:text-3xl lg:text-4xl' : 'text-lg md:text-xl'
          }`}
        >
          {cat.name}
        </h3>

        <div className="flex items-end justify-between mt-3">
          <span className="text-white/60 text-sm font-medium">{cat.count}</span>
          <span className="inline-flex items-center gap-1 text-orange-300 text-xs font-semibold opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75">
            Shop <ArrowRight className="w-3 h-3" />
          </span>
        </div>

        {/* Animated underline */}
        <div className="mt-3.5 h-[2px] rounded-full bg-orange-500 w-0 group-hover:w-full transition-all duration-500 ease-out" />
      </div>
    </Link>
  );
}

export default function CategoriesSection() {
  return (
    <section className="relative py-20 sm:py-28 bg-[#FFFAF5] overflow-hidden">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-orange-100 opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-[320px] h-[320px] rounded-full bg-amber-100 opacity-60 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 md:mb-16"
        >
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-200 text-orange-600 text-[11px] font-bold uppercase tracking-[0.14em] rounded-full px-4 py-1.5 mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              Browse by Category
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-900 leading-[1.05] tracking-tight">
              Find Their{' '}
              <span className="relative inline-block text-orange-500">
                Next Favorite
                {/* Squiggle underline */}
                <svg
                  className="absolute -bottom-1.5 left-0 w-full overflow-visible"
                  height="8"
                  viewBox="0 0 220 8"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 6 Q30 1 58 6 Q86 11 114 6 Q142 1 170 6 Q198 11 218 6"
                    stroke="#f97316"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            <p className="mt-4 text-stone-500 text-base md:text-lg leading-relaxed max-w-md">
              Handpicked categories for every age, interest, and imagination.
            </p>
          </div>

          <Link
            to="/categories"
            className="group inline-flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-7 py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/35 hover:-translate-y-0.5 flex-shrink-0 self-start sm:self-auto"
          >
            View All Categories
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </motion.div>

        {/* ── Grid ── */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {/* Mobile: 2-col uniform grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:hidden">
            {categories.map((cat) => (
              <motion.div key={cat.name} variants={cardVariants} className="h-56 sm:h-72">
                <CategoryCard cat={cat} />
              </motion.div>
            ))}
          </div>

          {/* Desktop: editorial bento layout */}
          {/*
            Layout (3-col, 2-row bento):
            Row 1: [Featured wide — col-span-2] [Card 1]
            Row 2: [Card 2]                     [Card 3]  [Card 4 — col-span-1 continues into row 2]
            Wait — simplest clean bento for 6:
            Row 1: Featured(col-span-2) | Card1 (col-span-1)
            Row 2: Card2 | Card3 | Card4
            Row 3: Card5 (col-span-3) — wide banner
          */}
          <div className="hidden lg:grid grid-cols-3 gap-5">
            {/* Row 1 — featured wide + 1 normal */}
            <motion.div variants={cardVariants} className="col-span-2 h-[420px]">
              <CategoryCard cat={categories[0]} featured />
            </motion.div>
            <motion.div variants={cardVariants} className="col-span-1 h-[420px]">
              <CategoryCard cat={categories[1]} />
            </motion.div>

            {/* Row 2 — three equal */}
            {categories.slice(2, 5).map((cat) => (
              <motion.div key={cat.name} variants={cardVariants} className="col-span-1 h-[280px]">
                <CategoryCard cat={cat} />
              </motion.div>
            ))}

            {/* Row 3 — wide banner card */}
            <motion.div variants={cardVariants} className="col-span-3 h-[200px]">
              <Link
                to={`/shop?category=${categories[5].name.toLowerCase().replace(/\s+/g, '-')}`}
                className="group relative flex items-center overflow-hidden rounded-3xl h-full"
                style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.07), 0 8px 32px rgba(0,0,0,0.08)' }}
              >
                <img
                  src={categories[5].image}
                  alt={categories[5].name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-900/50 to-stone-900/20" />
                <div className="absolute inset-0 bg-orange-600/0 group-hover:bg-orange-600/10 transition-colors duration-500" />

                {categories[5].badge && (
                  <span className="absolute top-5 left-6 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-orange-500/40">
                    {categories[5].badge}
                  </span>
                )}

                <div className="relative z-10 px-8 md:px-12 flex items-center justify-between w-full">
                  <div>
                    <p className="text-orange-300 text-[11px] font-bold uppercase tracking-[0.14em] mb-1">
                      {categories[5].description}
                    </p>
                    <h3 className="text-white text-3xl font-black tracking-tight">
                      {categories[5].name}
                    </h3>
                    <p className="text-white/60 text-sm mt-1">{categories[5].count}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-sm px-6 py-3 rounded-2xl group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-300">
                    Shop Now
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </div>
                </div>

                {/* Animated underline on banner card */}
                <div className="absolute bottom-0 left-0 h-[3px] bg-orange-500 w-0 group-hover:w-full transition-all duration-700 ease-out" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Age Group Filters ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.25 }}
          className="mt-14 md:mt-16"
        >
          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
            <span className="text-stone-400 text-xs font-bold uppercase tracking-[0.16em] flex-shrink-0">
              Filter by Age
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-stone-200 to-transparent" />
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {ageGroups.map((age, i) => (
              <motion.div
                key={age}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.05 * i }}
              >
                <Link
                  to={`/shop?ageGroup=${age.split('–')[0].trim()}`}
                  className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-stone-200 bg-white text-sm font-bold text-stone-600 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 hover:shadow-lg hover:shadow-orange-100 hover:-translate-y-0.5 transition-all duration-250"
                >
                  {/* Subtle left accent on hover */}
                  <span className="w-1.5 h-1.5 rounded-full bg-stone-300 group-hover:bg-orange-500 transition-colors duration-200" />
                  {age}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
