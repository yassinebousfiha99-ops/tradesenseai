import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType, CandlestickData, UTCTimestamp, CandlestickSeries } from 'lightweight-charts';

interface TradingChartProps {
  symbol: string;
  height?: number;
}

// Generate mock OHLC data for demonstration
function generateMockCandlestickData(symbol: string, days: number = 100): CandlestickData<UTCTimestamp>[] {
  const data: CandlestickData<UTCTimestamp>[] = [];
  
  // Base prices for different symbols
  const basePrices: Record<string, number> = {
    'AAPL': 180,
    'TSLA': 240,
    'GOOGL': 140,
    'AMZN': 175,
    'BTC-USD': 42000,
    'ETH-USD': 2400,
    'IAM.MA': 125,
    'ATW.MA': 480,
    'BCP.MA': 275,
    'LHM.MA': 1800,
  };
  
  let basePrice = basePrices[symbol] || 100;
  const volatility = symbol.includes('BTC') || symbol.includes('ETH') ? 0.03 : 0.015;
  
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    // Skip weekends for stocks
    if (!symbol.includes('USD') && (date.getDay() === 0 || date.getDay() === 6)) {
      continue;
    }
    
    const change = (Math.random() - 0.5) * 2 * volatility;
    const open = basePrice;
    const close = basePrice * (1 + change);
    const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
    const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
    
    data.push({
      time: Math.floor(date.getTime() / 1000) as UTCTimestamp,
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
    });
    
    basePrice = close;
  }
  
  return data;
}

export function TradingChart({ symbol, height = 300 }: TradingChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartData, setChartData] = useState<CandlestickData<UTCTimestamp>[]>([]);

  // Generate data when symbol changes
  useEffect(() => {
    setChartData(generateMockCandlestickData(symbol));
  }, [symbol]);

  // Initialize and update chart
  useEffect(() => {
    if (!chartContainerRef.current || chartData.length === 0) return;

    // Clear previous chart
    chartContainerRef.current.innerHTML = '';

    // Get theme
    const isDark = document.documentElement.classList.contains('dark');
    
    const backgroundColor = isDark ? '#0a0a0a' : '#ffffff';
    const textColor = isDark ? '#a1a1aa' : '#71717a';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor: textColor,
      },
      grid: {
        vertLines: { color: gridColor },
        horzLines: { color: gridColor },
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
      timeScale: {
        borderColor: gridColor,
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: gridColor,
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          width: 1,
          style: 2,
        },
        horzLine: {
          color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
          width: 1,
          style: 2,
        },
      },
    });

    // Use CandlestickSeries type for v5 API
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
    });

    candlestickSeries.setData(chartData);
    chart.timeScale().fitContent();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ 
          width: chartContainerRef.current.clientWidth 
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const lastCandle = chartData[chartData.length - 1];
      if (!lastCandle) return;

      const volatility = symbol.includes('BTC') || symbol.includes('ETH') ? 0.001 : 0.0005;
      const change = (Math.random() - 0.5) * 2 * volatility;
      
      const newClose = lastCandle.close * (1 + change);
      const updatedCandle: CandlestickData<UTCTimestamp> = {
        time: lastCandle.time,
        open: lastCandle.open,
        high: Math.max(lastCandle.high, newClose),
        low: Math.min(lastCandle.low, newClose),
        close: parseFloat(newClose.toFixed(2)),
      };

      candlestickSeries.update(updatedCandle);
      lastCandle.close = updatedCandle.close;
      lastCandle.high = updatedCandle.high;
      lastCandle.low = updatedCandle.low;
    }, 2000);

    // Theme observer
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      const backgroundColor = isDark ? '#0a0a0a' : '#ffffff';
      const textColor = isDark ? '#a1a1aa' : '#71717a';
      const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

      chart.applyOptions({
        layout: {
          background: { type: ColorType.Solid, color: backgroundColor },
          textColor: textColor,
        },
        grid: {
          vertLines: { color: gridColor },
          horzLines: { color: gridColor },
        },
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
      observer.disconnect();
      chart.remove();
    };
  }, [chartData, height, symbol]);

  return (
    <div 
      ref={chartContainerRef} 
      className="w-full rounded-lg overflow-hidden"
      style={{ height }}
    />
  );
}
