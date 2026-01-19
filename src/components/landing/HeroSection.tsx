import { Link } from 'react-router-dom';
import { ArrowRight, Play, TrendingUp, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function HeroSection() {
  const { t } = useLanguage();

  const stats = [
    { icon: Users, value: '12,500+', label: t.hero.stats.traders },
    { icon: TrendingUp, value: '2,340+', label: t.hero.stats.funded },
    { icon: DollarSign, value: '$4.2M+', label: t.hero.stats.payout },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero pt-16">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-glow opacity-50" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            <span className="text-sm font-medium text-primary">{t.hero.badge}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-secondary-foreground mb-6 animate-slide-up">
            {t.hero.title}{' '}
            <span className="text-primary relative">
              {t.hero.titleHighlight}
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                <path d="M2 10C50 2 150 2 298 10" stroke="hsl(var(--primary))" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-secondary-foreground/70 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            {t.hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/register">
              <Button size="lg" className="group text-lg px-8 shadow-glow">
                {t.hero.cta}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-secondary-foreground/5 border-secondary-foreground/20 text-secondary-foreground hover:bg-secondary-foreground/10">
              <Play className="w-5 h-5 mr-2" />
              {t.hero.ctaSecondary}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-secondary-foreground/5 backdrop-blur-sm border border-secondary-foreground/10 rounded-xl p-6 hover:border-primary/50 transition-colors"
              >
                <stat.icon className="w-8 h-8 text-primary mb-3 mx-auto" />
                <div className="text-3xl font-bold text-secondary-foreground mb-1">{stat.value}</div>
                <div className="text-sm text-secondary-foreground/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
