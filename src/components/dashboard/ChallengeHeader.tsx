import { AlertTriangle, Target, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import type { UserChallenge } from '@/hooks/useUserChallenges';

interface ChallengeHeaderProps {
  challenge: UserChallenge;
  lastUpdate: Date | null;
  isLoading: boolean;
  onRefresh: () => void;
}

const statusColors = {
  pending: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  active: 'bg-primary/10 text-primary border-primary/20',
  passed: 'bg-profit/10 text-profit border-profit/20',
  failed: 'bg-loss/10 text-loss border-loss/20',
  cancelled: 'bg-muted text-muted-foreground border-border',
};

const statusLabelsKey = {
  pending: 'pending',
  active: 'active',
  passed: 'passed',
  failed: 'failed',
  cancelled: 'cancelled',
} as const;

const phaseLabelsKey = {
  phase1: 'phase1',
  phase2: 'phase2',
  funded: 'funded',
} as const;

export function ChallengeHeader({ challenge, lastUpdate, isLoading, onRefresh }: ChallengeHeaderProps) {
  const { t } = useLanguage();
  const plan = challenge.challenge_plans;

  const startingBalance = challenge.starting_balance;
  const profitPercent =
    startingBalance > 0
      ? ((challenge.current_balance - startingBalance) / startingBalance) * 100
      : 0;

  const maxLossLimit = plan?.max_loss_limit ?? 10;
  const lossUsedPercent = profitPercent < 0 ? Math.min(-profitPercent, maxLossLimit) : 0;
  const lossRemainingPercent = Math.max(maxLossLimit - lossUsedPercent, 0);

  const targetPercent =
    challenge.phase === 'phase1'
      ? plan?.profit_target_phase1
      : plan?.profit_target_phase2 ?? 10;
  const targetReachedPercent =
    profitPercent > 0 ? Math.min(profitPercent, targetPercent) : 0;
  const targetRemainingPercent = Math.max(targetPercent - targetReachedPercent, 0);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {plan?.name || 'Challenge'} - {t.dashboard.phase[phaseLabelsKey[challenge.phase]]}
        </h1>
        <div className="flex items-center gap-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${statusColors[challenge.status]}`}>
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            <span className="text-sm font-medium">{t.dashboard.status[statusLabelsKey[challenge.status]]}</span>
          </div>
          {lastUpdate && (
            <span className="text-xs text-muted-foreground">
              {t.dashboard.labels.lastUpdate}: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2 mt-4 md:mt-0">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-loss/10 border border-loss/20">
          <AlertTriangle className="w-4 h-4 text-loss" />
          <span className="text-sm text-loss">
            {t.dashboard.labels.maxLoss}: -{maxLossLimit.toFixed(2)}% · {t.dashboard.labels.remaining}: -{lossRemainingPercent.toFixed(2)}%
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-profit/10 border border-profit/20">
          <Target className="w-4 h-4 text-profit" />
          <span className="text-sm text-profit">
            {t.dashboard.labels.target}: +{targetPercent.toFixed(2)}% · {t.dashboard.labels.reached}: +{targetReachedPercent.toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
}
