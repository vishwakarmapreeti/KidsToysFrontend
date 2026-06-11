import { Link } from 'react-router-dom';
import { Star, Mail, Phone, MapPin, Heart } from 'lucide-react';

const footerLinks = {
  shop: [
    { label: 'New Arrivals', href: '/shop?sort=newest' },
    { label: 'Best Sellers', href: '/shop?sort=top_rated' },
    { label: 'Sale & Deals', href: '/deals' },
    { label: 'All Categories', href: '/categories' },
    { label: 'Brands', href: '/brands' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Order Tracking', href: '/orders' },
    { label: 'Returns & Refunds', href: '/returns' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Size Guide', href: '/size-guide' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Contact', href: '/contact' },
  ],
};

const socials = [
  { icon: Star, label: 'Facebook', href: '#' },
  { icon: Star, label: 'Twitter', href: '#' },
  { icon: Star, label: 'Instagram', href: '#' },
  { icon: Star, label: 'YouTube', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Star className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Kids<span className="text-primary-400">Toys</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-neutral-400 max-w-sm">
              Your trusted destination for premium, safe, and educational toys that spark imagination and bring joy to every child.
            </p>

            <div className="space-y-2.5">
              <a href="mailto:hello@kidstoys.com" className="flex items-center gap-2.5 text-sm text-neutral-400 hover:text-white transition-colors group">
                <Mail className="w-4 h-4 text-primary-400 group-hover:text-primary-300 flex-shrink-0" />
                hello@kidstoys.com
              </a>
              <a href="tel:+18001234567" className="flex items-center gap-2.5 text-sm text-neutral-400 hover:text-white transition-colors group">
                <Phone className="w-4 h-4 text-primary-400 group-hover:text-primary-300 flex-shrink-0" />
                +1 (800) 123-4567
              </a>
              <div className="flex items-start gap-2.5 text-sm text-neutral-400">
                <MapPin className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>123 Toy Street, Fun City, CA 90001, USA</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-primary-500 hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Shop', links: footerLinks.shop },
            { title: 'Support', links: footerLinks.support },
            { title: 'Company', links: footerLinks.company },
          ].map(({ title, links }) => (
            <div key={title} className="space-y-4">
              <h4 className="font-display font-semibold text-white text-sm uppercase tracking-wide">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      to={href}
                      className="text-sm text-neutral-400 hover:text-white transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 pt-8 border-t border-neutral-800">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Safe & Secure', desc: 'SSL Encrypted' },
              { label: 'Free Shipping', desc: 'Orders over ₹500' },
              { label: 'Easy Returns', desc: '7-day policy' },
              { label: '24/7 Support', desc: 'Always here for you' },
            ].map(({ label, desc }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-800/50">
                <div className="w-8 h-8 rounded-xl bg-primary-500/20 flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-primary-400 fill-primary-400" />
                </div>
                <div>
                  <p className="text-white text-xs font-semibold">{label}</p>
                  <p className="text-neutral-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} KidsToys. All rights reserved.
          </p>
          <p className="text-xs text-neutral-500 flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-primary-400 fill-primary-400" /> for every child
          </p>
          <div className="flex items-center gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <Link key={item} to="#" className="text-xs text-neutral-500 hover:text-neutral-300 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
