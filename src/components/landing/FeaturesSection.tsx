import { Brain, Newspaper, Users, GraduationCap, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export function FeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: Brain,
      title: t.features.ai.title,
      description: t.features.ai.description,
      color: 'from-primary/20 to-primary/5',
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      icon: Newspaper,
      title: t.features.news.title,
      description: t.features.news.description,
      color: 'from-chart-3/20 to-chart-3/5',
      iconBg: 'bg-chart-3/10',
      iconColor: 'text-chart-3',
    },
    {
      icon: Users,
      title: t.features.community.title,
      description: t.features.community.description,
      color: 'from-chart-4/20 to-chart-4/5',
      iconBg: 'bg-chart-4/10',
      iconColor: 'text-chart-4',
    },
    {
      icon: GraduationCap,
      title: t.features.masterclass.title,
      description: t.features.masterclass.description,
      color: 'from-chart-2/20 to-chart-2/5',
      iconBg: 'bg-chart-2/10',
      iconColor: 'text-chart-2',
    },
  ];

  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.features.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.features.subtitle}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-gradient-to-br ${feature.color} rounded-2xl p-8 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
            >
              <div className={`w-14 h-14 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6`}>
                <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
              </div>
              
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed mb-4">
                {feature.description}
              </p>

              <div className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm">En savoir plus</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
