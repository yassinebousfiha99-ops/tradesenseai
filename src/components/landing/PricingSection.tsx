import { Check, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChallengePlans } from '@/hooks/useUserChallenges';

export function PricingSection() {
  const { t } = useLanguage();
  const { data: plans, isLoading } = useChallengePlans();

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount);
  };

  const getFeatures = (plan: NonNullable<typeof plans>[0]) => [
    `Compte de ${formatBalance(plan.account_size)} $`,
    `Perte max journalière: ${plan.daily_loss_limit}%`,
    `Perte max totale: ${plan.max_loss_limit}%`,
    `Objectif Phase 1: ${plan.profit_target_phase1}%`,
    `Objectif Phase 2: ${plan.profit_target_phase2}%`,
    `${plan.min_trading_days} jours de trading minimum`,
    `${plan.profit_split}% de partage des profits`,
    `Levier: ${plan.leverage}`,
  ];

  if (isLoading) {
    return (
      <section id="pricing" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section id="pricing" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t.pricing.title}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.pricing.subtitle}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans?.map((plan, index) => {
            const isPopular = index === 1; // Middle plan is popular
            const features = getFeatures(plan);

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${
                  isPopular
                    ? 'bg-gradient-to-b from-primary/10 to-background border-2 border-primary shadow-glow scale-105'
                    : 'bg-card border border-border hover:border-primary/50'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      <Sparkles className="w-4 h-4" />
                      {t.pricing.popular}
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-foreground mb-1">
                    {plan.price} <span className="text-lg font-normal text-muted-foreground">DH</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Solde: <span className="text-primary font-semibold">{formatBalance(plan.account_size)} $</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/checkout" 
                  state={{ 
                    planId: plan.id,
                    plan: plan.name, 
                    price: plan.price.toString(),
                    accountSize: plan.account_size 
                  }}
                >
                  <Button
                    className="w-full"
                    variant={isPopular ? 'default' : 'outline'}
                    size="lg"
                  >
                    {t.pricing.cta}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
