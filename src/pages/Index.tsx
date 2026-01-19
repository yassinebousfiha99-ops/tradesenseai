import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { TickerBar } from '@/components/landing/TickerBar';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PricingSection } from '@/components/landing/PricingSection';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TickerBar />
      <FeaturesSection />
      <PricingSection />
      <Footer />
    </div>
  );
};

export default Index;
