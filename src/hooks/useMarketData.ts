import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface MarketTicker {
  symbol: string;
  name?: string;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  market?: string;
  marketState?: string;
  timestamp: string;
}

interface UseMarketDataOptions {
  symbols?: string[];
  market?: 'international' | 'morocco' | 'all';
  refreshInterval?: number; // in milliseconds
}

export function useMarketData(options: UseMarketDataOptions = {}) {
  const { 
    symbols, 
    market = 'all', 
    refreshInterval = 30000 // 30 seconds default
  } = options;
  
  const [data, setData] = useState<Record<string, MarketTicker>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const cacheKey = `ts_market_data_${market}_${(symbols || []).join(',')}`;

  const fetchData = useCallback(async () => {
    try {
      console.log('Fetching market data...');
      
      // Use Flask backend instead of Supabase Edge Functions
      const response = await fetch('http://localhost:5000/api/market-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symbols, market }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        setData(data.data);
        setLastUpdate(new Date());
        setError(null);
        console.log(`Updated ${Object.keys(data.data).length} tickers`);
        try {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({ data: data.data, ts: Date.now() })
          );
        } catch { void 0; }
      } else {
        throw new Error(data.error || 'Failed to fetch market data');
      }
    } catch (err) {
      console.error('Market data error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [symbols, market, cacheKey]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(cacheKey);
      if (raw) {
        const parsed = JSON.parse(raw) as { data: Record<string, MarketTicker>; ts: number };
        if (parsed?.data && Object.keys(parsed.data).length > 0) {
          setData(parsed.data);
          setLastUpdate(new Date(parsed.ts));
          setIsLoading(false);
        }
      }
    } catch { void 0; }
    fetchData();
    
    const interval = setInterval(fetchData, refreshInterval);
    
    return () => clearInterval(interval);
  }, [fetchData, refreshInterval, cacheKey]);

  const tickers = Object.values(data);

  return {
    tickers,
    data,
    isLoading,
    error,
    lastUpdate,
    refresh: fetchData
  };
}
