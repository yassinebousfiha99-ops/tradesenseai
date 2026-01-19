import { TrendingUp, TrendingDown, Activity, DollarSign, Calendar, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import type { UserChallenge } from '@/hooks/useUserChallenges';

interface ChallengeStatsProps {
  challenge: UserChallenge;
  tradeCount?: number;
}

export function ChallengeStats({ challenge, tradeCount }: ChallengeStatsProps) {
  const { t } = useLanguage();
  
  const profit = challenge.current_balance - challenge.starting_balance;
  const profitPercent = ((profit / challenge.starting_balance) * 100).toFixed(2);
  const plan = challenge.challenge_plans;
  const profitSplit = plan?.profit_split ?? 0;
  const capitalEarned = profit > 0 ? (profit * profitSplit) / 100 : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t.dashboard.balance}</p>
              <p className="text-2xl font-bold text-foreground">
                ${challenge.current_balance.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t.dashboard.labels.portfolio}</p>
              <p className="text-2xl font-bold text-foreground">
                ${capitalEarned.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-muted-foreground">
                {profitSplit}% {t.dashboard.labels.payoutRate}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t.dashboard.equity}</p>
              <p className="text-2xl font-bold text-foreground">
                ${challenge.highest_balance.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-chart-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t.dashboard.profit}</p>
              <p className={`text-2xl font-bold ${profit >= 0 ? 'text-profit' : 'text-loss'}`}>
                {profit >= 0 ? '+' : ''}{profitPercent}%
              </p>
            </div>
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${profit >= 0 ? 'bg-profit/10' : 'bg-loss/10'}`}>
              {profit >= 0 ? (
                <TrendingUp className="w-6 h-6 text-profit" />
              ) : (
                <TrendingDown className="w-6 h-6 text-loss" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t.dashboard.trades}</p>
              <p className="text-2xl font-bold text-foreground">{typeof tradeCount === 'number' ? tradeCount : challenge.trading_days}</p>
              <p className="text-xs text-muted-foreground">
                / {plan?.min_trading_days || 5} jours min
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-chart-4/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-chart-4" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
