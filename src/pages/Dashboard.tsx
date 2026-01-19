import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMarketData, MarketTicker } from '@/hooks/useMarketData';
import { useActiveChallenge } from '@/hooks/useUserChallenges';
import { TradingChart } from '@/components/charts/TradingChart';
import { ChallengeStats } from '@/components/dashboard/ChallengeStats';
import { ChallengeHeader } from '@/components/dashboard/ChallengeHeader';
import { NoChallengeCard } from '@/components/dashboard/NoChallengeCard';
import { AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';
import type { UserChallenge } from '@/hooks/useUserChallenges';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type SignalAction = 'BUY' | 'SELL' | 'HOLD' | 'STOP';

interface AISignal {
  symbol: string;
  action: SignalAction;
  confidence: number;
  entry: number;
  stop_loss: number;
  take_profit: number;
  reason: string;
  risk: 'low' | 'medium' | 'high';
}

interface AITradePlan {
  symbol: string;
  bullish: {
    entry: number;
    stop_loss: number;
    take_profit: number;
    rr: number;
  };
  bearish: {
    entry: number;
    stop_loss: number;
    take_profit: number;
    rr: number;
  };
  invalidation: number;
}

export default function Dashboard() {
  const { t } = useLanguage();
  const { tickers, isLoading: isLoadingMarket, error, lastUpdate, refresh } = useMarketData({
    market: 'all',
    refreshInterval: 30000
  });
  
  const { data: activeChallenge, isLoading: isLoadingChallenge } = useActiveChallenge();
  const queryClient = useQueryClient();
  
  const [selectedAsset, setSelectedAsset] = useState<MarketTicker | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [trades, setTrades] = useState<Tables<'trades'>[]>([]);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [orderSide, setOrderSide] = useState<'buy' | 'sell' | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<string>('1');
  const [signals, setSignals] = useState<AISignal[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<AITradePlan | null>(null);
  const [riskAlert, setRiskAlert] = useState<{ level: 'low' | 'medium' | 'high'; message: string; recommendation: 'HOLD' | 'EXIT' | 'TRADE' } | null>(null);
  const [opportunities, setOpportunities] = useState<AISignal[]>([]);
  const [challengeOverride, setChallengeOverride] = useState<UserChallenge | null>(null);
  const [tradeCount, setTradeCount] = useState<number>(0);
  const [holdings, setHoldings] = useState<
    { symbol: string; quantity: number; avgEntry: number; marketPrice: number; value: number; pl: number }[]
  >([]);

  useEffect(() => {
    if (activeChallenge) {
      try {
        const raw = localStorage.getItem(`ts_portfolio_${activeChallenge.id}`);
        if (raw) {
          const cache = JSON.parse(raw) as {
            trades?: Tables<'trades'>[];
            holdings?: { symbol: string; quantity: number; avgEntry: number; marketPrice: number; value: number; pl: number }[];
            tradeCount?: number;
          };
          if (cache.trades) setTrades(cache.trades);
          if (cache.holdings) setHoldings(cache.holdings);
          if (typeof cache.tradeCount === 'number') setTradeCount(cache.tradeCount);
        }
      } catch { void 0; }
    }
  }, [activeChallenge]);

  useEffect(() => {
    if (tickers.length > 0 && !selectedAsset) {
      setSelectedAsset(tickers[0]);
    }
  }, [tickers, selectedAsset]);

  useEffect(() => {
    if (!activeChallenge) {
      if (!isLoadingChallenge) {
        setTrades([]);
        setHoldings([]);
        setTradeCount(0);
      }
      return;
    }

    let isMounted = true;

    const loadTrades = async () => {
      const { data: recent, error } = await supabase
        .from('trades')
        .select('*')
        .eq('challenge_id', activeChallenge.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Error loading trades:', error);
        return;
      }

      if (isMounted && recent) {
        setTrades(recent);
      }

      const { data: all } = await supabase
        .from('trades')
        .select('*')
        .eq('challenge_id', activeChallenge.id)
        .order('created_at', { ascending: true })
        .limit(1000);

      const { count } = await supabase
        .from('trades')
        .select('id', { count: 'exact', head: true })
        .eq('challenge_id', activeChallenge.id);

      if (isMounted) {
        const nextCount = typeof count === 'number' ? count : (all?.length || recent?.length || 0);
        setTradeCount(nextCount);
      }

      if (isMounted && all) {
        const priceMap = new Map<string, number>(tickers.map((t) => [t.symbol, t.price]));
        const agg = new Map<string, { quantity: number; cost: number }>();
        for (const tr of all) {
          const side = tr.side.toLowerCase();
          const qty = Number(tr.quantity) || 0;
          const price = Number(tr.entry_price) || 0;
          const cur = agg.get(tr.symbol) || { quantity: 0, cost: 0 };
          if (side === 'buy') {
            const newQty = cur.quantity + qty;
            const newCost = cur.cost + qty * price;
            agg.set(tr.symbol, { quantity: newQty, cost: newCost });
          } else if (side === 'sell') {
            const newQty = Math.max(cur.quantity - qty, 0);
            // cost stays tied to remaining qty proportionally
            const avg = cur.quantity > 0 ? cur.cost / cur.quantity : 0;
            const newCost = newQty * avg;
            agg.set(tr.symbol, { quantity: newQty, cost: newCost });
          }
        }
        const list = Array.from(agg.entries())
          .filter(([, v]) => v.quantity > 0)
          .map(([symbol, v]) => {
            const avgEntry = v.quantity > 0 ? v.cost / v.quantity : 0;
            const marketPrice = priceMap.get(symbol) ?? 0;
            const value = marketPrice * v.quantity;
            const pl = (marketPrice - avgEntry) * v.quantity;
            return { symbol, quantity: v.quantity, avgEntry, marketPrice, value, pl };
          });
        setHoldings(list);
        try {
          localStorage.setItem(
            `ts_portfolio_${activeChallenge.id}`,
            JSON.stringify({
              trades: recent || [],
              holdings: list,
              tradeCount:
                typeof count === 'number' ? count : (all?.length || recent?.length || 0),
            })
          );
        } catch { void 0; }
      }
    };

    loadTrades();

    const channel = supabase
      .channel(`trades-realtime-${activeChallenge.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'trades',
          filter: `challenge_id=eq.${activeChallenge.id}`,
        },
        (payload) => {
          const newTrade = payload.new as Tables<'trades'>;
          const nextTrades = [newTrade, ...trades].slice(0, 50);
          const nextCount = tradeCount + 1;
          const priceMap = new Map<string, number>(tickers.map((t) => [t.symbol, t.price]));
          const base = new Map<string, { quantity: number; cost: number }>();
          for (const h of holdings) {
            base.set(h.symbol, { quantity: h.quantity, cost: h.avgEntry * h.quantity });
          }
          const side = newTrade.side.toLowerCase();
          const qty = Number(newTrade.quantity) || 0;
          const price = Number(newTrade.entry_price) || 0;
          const cur = base.get(newTrade.symbol) || { quantity: 0, cost: 0 };
          if (side === 'buy') {
            cur.quantity += qty;
            cur.cost += qty * price;
          } else if (side === 'sell') {
            const avg = cur.quantity > 0 ? cur.cost / cur.quantity : 0;
            cur.quantity = Math.max(cur.quantity - qty, 0);
            cur.cost = cur.quantity * avg;
          }
          base.set(newTrade.symbol, cur);
          const nextHoldings = Array.from(base.entries())
            .filter(([, v]) => v.quantity > 0)
            .map(([symbol, v]) => {
              const avgEntry = v.quantity > 0 ? v.cost / v.quantity : 0;
              const marketPrice = priceMap.get(symbol) ?? 0;
              const value = marketPrice * v.quantity;
              const pl = (marketPrice - avgEntry) * v.quantity;
              return { symbol, quantity: v.quantity, avgEntry, marketPrice, value, pl };
            });
          setTrades(nextTrades);
          setTradeCount(nextCount);
          setHoldings(nextHoldings);
          try {
            localStorage.setItem(
              `ts_portfolio_${activeChallenge.id}`,
              JSON.stringify({
                trades: nextTrades,
                holdings: nextHoldings,
                tradeCount: nextCount,
              })
            );
          } catch { void 0; }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [activeChallenge, tickers]);

  useEffect(() => {
    if (selectedAsset && tickers.length > 0) {
      const updated = tickers.find((t) => t.symbol === selectedAsset.symbol);
      if (updated) {
        setSelectedAsset(updated);
      }
    }
  }, [tickers, selectedAsset]);

  useEffect(() => {
    if (holdings.length > 0 && tickers.length > 0) {
      const priceMap = new Map<string, number>(tickers.map((t) => [t.symbol, t.price]));
      const nextHoldings = holdings.map((h) => {
        const marketPrice = priceMap.get(h.symbol) ?? h.marketPrice;
        const value = marketPrice * h.quantity;
        const pl = (marketPrice - h.avgEntry) * h.quantity;
        return { ...h, marketPrice, value, pl };
      });
      setHoldings(nextHoldings);
      if (activeChallenge) {
        try {
          const raw = localStorage.getItem(`ts_portfolio_${activeChallenge.id}`);
          const cache = raw ? JSON.parse(raw) : {};
          localStorage.setItem(
            `ts_portfolio_${activeChallenge.id}`,
            JSON.stringify({ ...(cache || {}), holdings: nextHoldings })
          );
        } catch { void 0; }
      }
    }
  }, [tickers]);

  useEffect(() => {
    if (tickers.length === 0) {
      setSignals([]);
      setSelectedPlan(null);
      setRiskAlert(null);
      setOpportunities([]);
      return;
    }

    const dailyLimit = activeChallenge?.challenge_plans?.daily_loss_limit ?? 5;
    const slPctBase = Math.max(0.0025, (dailyLimit / 100) * 0.2);

    const computeRR = (vol: number) => {
      if (vol >= 3) return 1.5;
      if (vol >= 1.5) return 2.0;
      return 2.5;
    };

    const makeSignal = (t: MarketTicker): AISignal => {
      const vol = Math.abs(t.changePercent);
      const risk = vol >= 3 ? 'high' : vol >= 1.5 ? 'medium' : 'low';
      const rr = computeRR(vol);
      const slPct = slPctBase;
      const buyTp = t.price * (1 + slPct * rr);
      const buySl = t.price * (1 - slPct);
      const sellTp = t.price * (1 - slPct * rr);
      const sellSl = t.price * (1 + slPct);

      let action: SignalAction = 'HOLD';
      let reason = 'Neutral';

      if (t.marketState === 'HALTED') {
        action = 'STOP';
        reason = 'Marché interrompu';
      } else if (risk === 'high') {
        action = 'STOP';
        reason = 'Volatilité excessive';
      } else if (t.changePercent > 0.8) {
        action = 'BUY';
        reason = 'Momentum haussier';
      } else if (t.changePercent < -0.8) {
        action = 'SELL';
        reason = 'Pression baissière';
      }

      const confidenceBase = 70 + Math.min(vol, 3) * 10;
      const confidencePenalty = risk === 'high' ? 20 : risk === 'medium' ? 8 : 0;
      const confidence = Math.max(50, Math.min(95, confidenceBase - confidencePenalty));

      const entry = t.price;
      const stop_loss = action === 'BUY' ? buySl : action === 'SELL' ? sellSl : entry;
      const take_profit = action === 'BUY' ? buyTp : action === 'SELL' ? sellTp : entry;

      return {
        symbol: t.symbol,
        action,
        confidence,
        entry,
        stop_loss,
        take_profit,
        reason,
        risk,
      };
    };

    const allSignals = tickers.map(makeSignal);
    setSignals(allSignals);

    if (selectedAsset) {
      const s = makeSignal(selectedAsset);
      const rr = computeRR(Math.abs(selectedAsset.changePercent));
      const slPct = slPctBase;
      const bullish = {
        entry: selectedAsset.price,
        stop_loss: selectedAsset.price * (1 - slPct),
        take_profit: selectedAsset.price * (1 + slPct * rr),
        rr,
      };
      const bearish = {
        entry: selectedAsset.price,
        stop_loss: selectedAsset.price * (1 + slPct),
        take_profit: selectedAsset.price * (1 - slPct * rr),
        rr,
      };
      const invalidation = s.action === 'BUY' ? bullish.stop_loss : s.action === 'SELL' ? bearish.stop_loss : selectedAsset.price;
      setSelectedPlan({
        symbol: selectedAsset.symbol,
        bullish,
        bearish,
        invalidation,
      });

      const alertLevel: 'low' | 'medium' | 'high' = Math.abs(selectedAsset.changePercent) >= 3 ? 'high' : Math.abs(selectedAsset.changePercent) >= 1.5 ? 'medium' : 'low';
      const alertMessage =
        alertLevel === 'high'
          ? 'Volatilité excessive'
          : alertLevel === 'medium'
          ? 'Cassure possible non confirmée'
          : 'Risque contrôlé';
      const rec: 'HOLD' | 'EXIT' | 'TRADE' =
        alertLevel === 'high' ? 'HOLD' : s.action === 'STOP' ? 'EXIT' : 'TRADE';
      setRiskAlert({ level: alertLevel, message: alertMessage, recommendation: rec });
    } else {
      setSelectedPlan(null);
      setRiskAlert(null);
    }

    const quality = allSignals
      .filter((s) => (s.action === 'BUY' || s.action === 'SELL') && s.confidence >= 70 && s.risk !== 'high')
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 6);
    setOpportunities(quality);
  }, [tickers, selectedAsset, activeChallenge]);

  const openOrderDialog = (side: 'buy' | 'sell') => {
    setOrderSide(side);
    setOrderQuantity('1');
    setIsOrderDialogOpen(true);
  };

  const handlePlaceOrder = async () => {
    const baseChallenge = (challengeOverride || activeChallenge) as UserChallenge | null;

    if (!baseChallenge) {
      toast.error('Aucun challenge actif');
      return;
    }
    if (!selectedAsset) {
      toast.error('Aucun actif sélectionné');
      return;
    }
    if (!orderSide) {
      toast.error('Type d\'ordre inconnu');
      return;
    }
    const quantityNumber = parseFloat(orderQuantity);
    if (!Number.isFinite(quantityNumber) || quantityNumber <= 0) {
      toast.error('Quantité invalide');
      return;
    }

    const totalAmount = selectedAsset.price * quantityNumber;

    if (orderSide === 'buy' && baseChallenge.current_balance < totalAmount) {
      toast.error('Solde insuffisant pour cet ordre');
      return;
    }

    if (isPlacingOrder) return;

    setIsPlacingOrder(true);

    try {
      const newTrade = {
        user_id: baseChallenge.user_id,
        challenge_id: baseChallenge.id,
        symbol: selectedAsset.symbol,
        side: orderSide,
        quantity: quantityNumber,
        entry_price: selectedAsset.price,
        status: 'open',
        opened_at: new Date().toISOString(),
      };
      const { error: tradeError } = await supabase.from('trades').insert(newTrade);

      if (tradeError) {
        throw tradeError;
      }

      const optimistic = { ...newTrade, id: crypto.randomUUID(), created_at: new Date().toISOString() } as unknown as Tables<'trades'>;
      const nextTrades = [optimistic, ...trades].slice(0, 50);
      setTrades(nextTrades);

      const currentBalance = baseChallenge.current_balance;
      const startingBalance = baseChallenge.starting_balance;
      const newBalance =
        orderSide === 'buy'
          ? currentBalance - totalAmount
          : currentBalance + totalAmount;
      const newHighestBalance = Math.max(baseChallenge.highest_balance, newBalance);
      const profitValue = newBalance - startingBalance;
      const newTotalProfit = profitValue > 0 ? profitValue : 0;
      const newTotalLoss = profitValue < 0 ? Math.abs(profitValue) : 0;
      const newDailyLossPercent =
        startingBalance > 0 ? (newTotalLoss / startingBalance) * 100 : 0;
      const newTradeCount = tradeCount + 1;

      setChallengeOverride({
        ...baseChallenge,
        current_balance: newBalance,
        highest_balance: newHighestBalance,
        total_profit: newTotalProfit,
        total_loss: newTotalLoss,
        daily_loss: newDailyLossPercent,
        trading_days: newTradeCount,
      });

      const priceMap = new Map<string, number>(tickers.map((t) => [t.symbol, t.price]));
      const base = new Map<string, { quantity: number; cost: number }>();
      for (const h of holdings) {
        base.set(h.symbol, { quantity: h.quantity, cost: h.avgEntry * h.quantity });
      }
      const side = newTrade.side.toLowerCase();
      const qty = Number(newTrade.quantity) || 0;
      const price = Number(newTrade.entry_price) || 0;
      const cur = base.get(newTrade.symbol) || { quantity: 0, cost: 0 };
      if (side === 'buy') {
        cur.quantity += qty;
        cur.cost += qty * price;
      } else if (side === 'sell') {
        const avg = cur.quantity > 0 ? cur.cost / cur.quantity : 0;
        cur.quantity = Math.max(cur.quantity - qty, 0);
        cur.cost = cur.quantity * avg;
      }
      base.set(newTrade.symbol, cur);
      const nextHoldings = Array.from(base.entries())
        .filter(([, v]) => v.quantity > 0)
        .map(([symbol, v]) => {
          const avgEntry = v.quantity > 0 ? v.cost / v.quantity : 0;
          const marketPrice = priceMap.get(symbol) ?? 0;
          const value = marketPrice * v.quantity;
          const pl = (marketPrice - avgEntry) * v.quantity;
          return { symbol, quantity: v.quantity, avgEntry, marketPrice, value, pl };
        });
      setHoldings(nextHoldings);
      try {
        localStorage.setItem(
          `ts_portfolio_${baseChallenge.id}`,
          JSON.stringify({
            trades: nextTrades,
            holdings: nextHoldings,
            tradeCount: newTradeCount,
          })
        );
      } catch { void 0; }

      const { error: updateError } = await supabase
        .from('user_challenges')
        .update({
          current_balance: newBalance,
          highest_balance: newHighestBalance,
          total_profit: newTotalProfit,
          total_loss: newTotalLoss,
          daily_loss: newDailyLossPercent,
          trading_days: newTradeCount,
          updated_at: new Date().toISOString(),
        })
        .eq('id', baseChallenge.id);

      if (updateError) {
        throw updateError;
      }

      queryClient.invalidateQueries({
        queryKey: ['active-challenge', baseChallenge.user_id],
      });
      queryClient.invalidateQueries({
        queryKey: ['user-challenges', baseChallenge.user_id],
      });

      toast.success(
        `${orderSide === 'buy' ? 'Achat' : 'Vente'} ${selectedAsset.symbol} • Nouveau solde: ${newBalance.toFixed(2)} • Trades: ${newTradeCount}`
      );
      setIsOrderDialogOpen(false);
    } catch (error: unknown) {
      console.error('Trade error:', error);
      const message = error instanceof Error ? error.message : "Erreur lors du placement de l'ordre";
      toast.error(message);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'MAD') {
      return `${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MAD`;
    }
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (isLoadingChallenge) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-24 pb-12 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {orderSide === 'buy' ? t.dashboard.buy : t.dashboard.sell}{' '}
                {selectedAsset ? selectedAsset.symbol : ''}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.dashboard.labels.currentPrice}</span>
                <span className="font-mono text-foreground">
                  {selectedAsset ? formatPrice(selectedAsset.price, selectedAsset.currency) : '-'}
                </span>
              </div>
              <div className="space-y-2">
                <span className="text-sm text-muted-foreground">{t.dashboard.labels.quantity}</span>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.dashboard.labels.totalAmount}</span>
                <span className="font-mono text-foreground">
                  {selectedAsset
                    ? (selectedAsset.price * (parseFloat(orderQuantity) || 0)).toFixed(2)
                    : '-'}
                </span>
              </div>
              {activeChallenge && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{t.dashboard.labels.currentBalance}</span>
                  <span className="font-mono text-foreground">
                    ${activeChallenge.current_balance.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsOrderDialogOpen(false)}
                disabled={isPlacingOrder}
              >
              {t.dashboard.labels.cancel}
              </Button>
              <Button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
              >
                {isPlacingOrder
                  ? t.dashboard.labels.sending
                  : orderSide === 'buy'
                  ? t.dashboard.buy
                  : t.dashboard.sell}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {(challengeOverride || activeChallenge) ? (
          <>
            <ChallengeHeader 
              challenge={(challengeOverride || activeChallenge) as UserChallenge}
              lastUpdate={lastUpdate}
              isLoading={isLoadingMarket}
              onRefresh={refresh}
            />
            
            <ChallengeStats challenge={(challengeOverride || activeChallenge) as UserChallenge} tradeCount={tradeCount} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Chart Area */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    {selectedAsset ? (
                      <>
                        <div>
                          <CardTitle className="flex items-center gap-3">
                            <span>{selectedAsset.symbol}</span>
                            <span className={`text-lg font-normal ${selectedAsset.changePercent >= 0 ? 'text-profit' : 'text-loss'}`}>
                              {selectedAsset.changePercent >= 0 ? '+' : ''}{selectedAsset.changePercent.toFixed(2)}%
                            </span>
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {selectedAsset.name || selectedAsset.symbol}
                            {selectedAsset.marketState && (
                              <span className="ml-2 px-2 py-0.5 rounded text-xs bg-muted">
                                {selectedAsset.marketState}
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground font-mono">
                            {formatPrice(selectedAsset.price, selectedAsset.currency)}
                          </p>
                          <p className={`text-sm ${selectedAsset.change >= 0 ? 'text-profit' : 'text-loss'}`}>
                            {selectedAsset.change >= 0 ? '+' : ''}{selectedAsset.change.toFixed(2)} {selectedAsset.currency}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                        <span className="text-muted-foreground">{t.dashboard.labels.loadingData}</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {selectedAsset ? (
                      <TradingChart symbol={selectedAsset.symbol} height={280} />
                    ) : (
                      <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center border border-border">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                      </div>
                    )}

                    <div className="flex gap-4 mt-6">
                      <Button
                        className="flex-1 bg-profit hover:bg-profit/90 text-primary-foreground"
                        size="lg"
                        onClick={() => openOrderDialog('buy')}
                      >
                        <ArrowUpRight className="w-5 h-5 mr-2" />
                        {t.dashboard.buy}
                      </Button>
                      <Button
                        className="flex-1 bg-loss hover:bg-loss/90 text-primary-foreground"
                        size="lg"
                        onClick={() => openOrderDialog('sell')}
                      >
                        <ArrowDownRight className="w-5 h-5 mr-2" />
                        {t.dashboard.sell}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>{t.dashboard.labels.recentTrades}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {trades.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Aucun trade pour le moment.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {trades.map((trade) => (
                          <div
                            key={trade.id}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {trade.symbol}{' '}
                                <span
                                  className={
                                    trade.side.toLowerCase() === 'buy'
                                      ? 'text-profit'
                                      : 'text-loss'
                                  }
                                >
                                  {trade.side.toUpperCase()}
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Qty: {trade.quantity} @ {trade.entry_price.toFixed(2)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                {new Date(trade.created_at).toLocaleTimeString()}
                              </p>
                              {trade.status && (
                                <p className="text-[10px] uppercase text-muted-foreground">
                                  {trade.status}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>{t.dashboard.labels.portfolio}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {holdings.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t.dashboard.labels.monitoring}</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-muted-foreground">
                              <th className="text-left py-2">{t.dashboard.labels.table.symbol}</th>
                              <th className="text-right py-2">{t.dashboard.labels.table.quantity}</th>
                              <th className="text-right py-2">{t.dashboard.labels.table.avgPrice}</th>
                              <th className="text-right py-2">{t.dashboard.labels.table.marketPrice}</th>
                              <th className="text-right py-2">{t.dashboard.labels.table.value}</th>
                              <th className="text-right py-2">{t.dashboard.labels.table.pl}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {holdings.map((h) => (
                              <tr key={h.symbol} className="border-t border-border">
                                <td className="py-2 text-foreground">{h.symbol}</td>
                                <td className="py-2 text-right font-mono">{h.quantity.toFixed(4)}</td>
                                <td className="py-2 text-right font-mono">{h.avgEntry.toFixed(4)}</td>
                                <td className="py-2 text-right font-mono">{h.marketPrice.toFixed(4)}</td>
                                <td className="py-2 text-right font-mono">{h.value.toFixed(2)}</td>
                                <td className={`py-2 text-right font-mono ${h.pl >= 0 ? 'text-profit' : 'text-loss'}`}>
                                  {h.pl >= 0 ? '+' : ''}{h.pl.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Asset List */}
                <Card className="mt-6">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t.dashboard.labels.markets}</CardTitle>
                    {error && (
                      <span className="text-xs text-loss">{error}</span>
                    )}
                  </CardHeader>
                  <CardContent>
                    {isLoadingMarket && tickers.length === 0 ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {tickers.map((ticker) => (
                          <button
                            key={ticker.symbol}
                            onClick={() => setSelectedAsset(ticker)}
                            className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                              selectedAsset?.symbol === ticker.symbol
                                ? 'bg-primary/10 border border-primary/20'
                                : 'bg-muted/30 hover:bg-muted/50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                ticker.currency === 'MAD' ? 'bg-chart-4/20' : 'bg-secondary'
                              }`}>
                                <span className="text-xs font-bold text-secondary-foreground">
                                  {ticker.symbol.slice(0, 2)}
                                </span>
                              </div>
                              <div className="text-left">
                                <p className="font-medium text-foreground">{ticker.symbol}</p>
                                <p className="text-xs text-muted-foreground">
                                  {ticker.name || (ticker.currency === 'MAD' ? 'Casablanca' : 'International')}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-mono font-medium text-foreground">
                                {formatPrice(ticker.price, ticker.currency)}
                              </p>
                              <p className={`text-sm ${ticker.changePercent >= 0 ? 'text-profit' : 'text-loss'}`}>
                                {ticker.changePercent >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* AI Signals Sidebar */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      {t.dashboard.signals}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {signals.map((signal, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-lg bg-muted/30 border border-border"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-foreground">{signal.symbol}</span>
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${
                                signal.action === 'BUY'
                                  ? 'bg-profit/10 text-profit'
                                  : signal.action === 'SELL'
                                  ? 'bg-loss/10 text-loss'
                                  : 'bg-chart-4/10 text-chart-4'
                              }`}
                            >
                              {signal.action}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{signal.reason}</p>
                          <div className="grid grid-cols-3 gap-2 text-xs">
                            <div className="text-muted-foreground">Entrée</div>
                            <div className="text-muted-foreground">SL</div>
                            <div className="text-muted-foreground">TP</div>
                            <div className="font-mono">{signal.entry.toFixed(4)}</div>
                            <div className="font-mono">{signal.stop_loss.toFixed(4)}</div>
                            <div className="font-mono">{signal.take_profit.toFixed(4)}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${signal.confidence}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{signal.confidence}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {selectedPlan && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>{t.dashboard.labels.aiTradePlan}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Actif</span>
                          <span className="font-medium text-foreground">{selectedPlan.symbol}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-xs text-muted-foreground">Haussier</div>
                          <div className="text-xs text-muted-foreground">Entrée</div>
                          <div className="font-mono text-xs">{selectedPlan.bullish.entry.toFixed(4)}</div>
                          <div className="text-xs text-muted-foreground">SL</div>
                          <div className="font-mono text-xs">{selectedPlan.bullish.stop_loss.toFixed(4)}</div>
                          <div className="text-xs text-muted-foreground">TP</div>
                          <div className="font-mono text-xs">{selectedPlan.bullish.take_profit.toFixed(4)}</div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-xs text-muted-foreground">Baissier</div>
                          <div className="text-xs text-muted-foreground">Entrée</div>
                          <div className="font-mono text-xs">{selectedPlan.bearish.entry.toFixed(4)}</div>
                          <div className="text-xs text-muted-foreground">SL</div>
                          <div className="font-mono text-xs">{selectedPlan.bearish.stop_loss.toFixed(4)}</div>
                          <div className="text-xs text-muted-foreground">TP</div>
                          <div className="font-mono text-xs">{selectedPlan.bearish.take_profit.toFixed(4)}</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs">Invalidation</span>
                          <span className="font-mono text-xs">{selectedPlan.invalidation.toFixed(4)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-xs">Ratio R/R</span>
                          <span className="font-mono text-xs">
                            {Math.max(selectedPlan.bullish.rr, selectedPlan.bearish.rr).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Risk Alert */}
                {(challengeOverride || activeChallenge) && (
                  <Card className="mt-6 border-chart-4/20">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-chart-4/10 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-5 h-5 text-chart-4" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground mb-1">{t.dashboard.labels.riskAlert}</h4>
                          {riskAlert ? (
                            <>
                              <p className="text-sm text-muted-foreground">
                                {riskAlert.message} · Recommandation: {riskAlert.recommendation}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Perte quotidienne: {((challengeOverride || activeChallenge) as UserChallenge).daily_loss.toFixed(1)}% (Max: {((challengeOverride || activeChallenge) as UserChallenge).challenge_plans?.daily_loss_limit || 5}%)
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              {t.dashboard.labels.monitoring}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {opportunities.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>{t.dashboard.labels.opportunities}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {opportunities.map((o, i) => (
                          <div key={`${o.symbol}-${i}`} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {o.symbol} <span className={o.action === 'BUY' ? 'text-profit' : 'text-loss'}>{o.action}</span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Entrée {o.entry.toFixed(4)} · SL {o.stop_loss.toFixed(4)} · TP {o.take_profit.toFixed(4)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">{t.dashboard.labels.confidence} {o.confidence}%</p>
                              <p className="text-[10px] uppercase text-muted-foreground">Risque {o.risk}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground mb-8">{t.dashboard.title}</h1>
            <NoChallengeCard />
          </div>
        )}
      </main>
    </div>
  );
}
