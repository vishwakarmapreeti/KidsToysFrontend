import Layout from '../../components/layout/Layout';
import HeroSection from './HeroSection';
import CategoriesSection from './CategoriesSection';
import PromoSection from './PromoSection';
import FeaturedProductsSection from './FeaturedProductsSection';
import TestimonialsSection from './TestimonialsSection';
import NewsletterSection from './NewsletterSection';

export default function HomePage() {
  return (
    <Layout>
      <HeroSection />
      <CategoriesSection />
      <PromoSection />
      <FeaturedProductsSection />
      <TestimonialsSection />
      <NewsletterSection />
    </Layout>
  );
}
