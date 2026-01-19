import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { useMarketData } from '@/hooks/useMarketData';

export function TickerBar() {
  const { tickers, isLoading } = useMarketData({
    market: 'all',
    refreshInterval: 30000
  });

  // Fallback mock data while loading
  const mockTickers = [
    { symbol: 'AAPL', price: 189.84, change: 2.34, changePercent: 1.25, currency: 'USD', timestamp: '' },
    { symbol: 'TSLA', price: 248.50, change: -5.20, changePercent: -2.05, currency: 'USD', timestamp: '' },
    { symbol: 'BTC-USD', price: 43250.00, change: 1250.00, changePercent: 2.98, currency: 'USD', timestamp: '' },
    { symbol: 'ETH-USD', price: 2580.00, change: 85.00, changePercent: 3.40, currency: 'USD', timestamp: '' },
    { symbol: 'IAM.MA', price: 125.50, change: 1.20, changePercent: 0.97, currency: 'MAD', timestamp: '' },
    { symbol: 'ATW.MA', price: 485.00, change: -3.50, changePercent: -0.72, currency: 'MAD', timestamp: '' },
  ];

  const displayTickers = tickers.length > 0 ? tickers : mockTickers;
  const duplicatedTickers = [...displayTickers, ...displayTickers];

  const formatPrice = (price: number, currency: string) => {
    if (currency === 'MAD') {
      return `${price.toLocaleString(undefined, { minimumFractionDigits: 2 })} MAD`;
    }
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;
  };

  return (
    <div className="bg-card border-y border-border overflow-hidden relative">
      {isLoading && tickers.length === 0 && (
        <div className="absolute inset-0 bg-card/80 flex items-center justify-center z-10">
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mr-2" />
          <span className="text-sm text-muted-foreground">Loading live prices...</span>
        </div>
      )}
      <div className="flex animate-ticker">
        {duplicatedTickers.map((ticker, index) => (
          <div
            key={`${ticker.symbol}-${index}`}
            className="flex items-center gap-3 px-6 py-3 border-r border-border whitespace-nowrap"
          >
            <span className="font-semibold text-foreground">{ticker.symbol}</span>
            <span className="font-mono text-foreground">
              {formatPrice(ticker.price, ticker.currency)}
            </span>
            <span className={`flex items-center gap-1 font-medium ${ticker.changePercent >= 0 ? 'text-profit' : 'text-loss'}`}>
              {ticker.changePercent >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {ticker.changePercent >= 0 ? '+' : ''}{ticker.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
