import React, { useState, useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import './App.css';

function App() {
  return (
    <div className="App bg-black min-h-screen w-screen flex flex-col bg-cover bg-center font-custom" style={{ backgroundImage: 'url("/bg1.png")' }}>
      <MarketTicker />
      <div className="flex-grow flex justify-center items-center">
        <TradingSimulator />
      </div>
      <div className='absolute bottom-3 right-3 flex space-x-1 items-center z-[50]'>
        <a href="https://x.com/" className='transition ease-in-out duration-150'>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className="size-14" viewBox="0 0 50 50" fill="#FFFFFF">
            <path d="M 11 4 C 7.1456661 4 4 7.1456661 4 11 L 4 39 C 4 42.854334 7.1456661 46 11 46 L 39 46 C 42.854334 46 46 42.854334 46 39 L 46 11 C 46 7.1456661 42.854334 4 39 4 L 11 4 z M 11 6 L 39 6 C 41.773666 6 44 8.2263339 44 11 L 44 39 C 44 41.773666 41.773666 44 39 44 L 11 44 C 8.2263339 44 6 41.773666 6 39 L 6 11 C 6 8.2263339 8.2263339 6 11 6 z M 13.085938 13 L 22.308594 26.103516 L 13 37 L 15.5 37 L 23.4375 27.707031 L 29.976562 37 L 37.914062 37 L 27.789062 22.613281 L 36 13 L 33.5 13 L 26.660156 21.009766 L 21.023438 13 L 13.085938 13 z M 16.914062 15 L 19.978516 15 L 34.085938 35 L 31.021484 35 L 16.914062 15 z"></path>
          </svg>
        </a>
        <a href="https://t.me/" className='transition ease-in-out duration-150'>
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" className='size-14' viewBox="0 0 48 48">
            <path fill="#29b6f6" d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"></path><path fill="#fff" d="M33.95,15l-3.746,19.126c0,0-0.161,0.874-1.245,0.874c-0.576,0-0.873-0.274-0.873-0.274l-8.114-6.733 l-3.97-2.001l-5.095-1.355c0,0-0.907-0.262-0.907-1.012c0-0.625,0.933-0.923,0.933-0.923l21.316-8.468 c-0.001-0.001,0.651-0.235,1.126-0.234C33.667,14,34,14.125,34,14.5C34,14.75,33.95,15,33.95,15z"></path><path fill="#b0bec5" d="M23,30.505l-3.426,3.374c0,0-0.149,0.115-0.348,0.12c-0.069,0.002-0.143-0.009-0.219-0.043 l0.964-5.965L23,30.505z"></path><path fill="#cfd8dc" d="M29.897,18.196c-0.169-0.22-0.481-0.26-0.701-0.093L16,26c0,0,2.106,5.892,2.427,6.912 c0.322,1.021,0.58,1.045,0.58,1.045l0.964-5.965l9.832-9.096C30.023,18.729,30.064,18.416,29.897,18.196z"></path>
          </svg>
        </a>
      </div>
    </div>
  );
}

function MarketTicker() {
  const initialStocks = [
    { symbol: 'AAPL', price: 150.25, change: '-2.1%' },
    { symbol: 'GOOGL', price: 2750.80, change: '2.5%' },
    { symbol: 'TSLA', price: 800.15, change: '-3.8%' },
    { symbol: 'AMZN', price: 3300.50, change: '-4.7%' },
    { symbol: 'BTC', price: 42000, change: '-5.2%' },
    { symbol: 'ETH', price: 3100, change: '-9.1%' },
    { symbol: 'SOL', price: 100, change: '-10.1%' },
  ];

  const [stocks, setStocks] = useState(initialStocks);

  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(prevStocks => prevStocks.map(stock => {
        const changePercent = -(Math.random() * 2 + 1); // Random change between -1% and -3%
        const newPrice = stock.price * (1 + changePercent / 100);
        const totalChange = ((newPrice / initialStocks.find(s => s.symbol === stock.symbol).price - 1) * 100).toFixed(1);
        return {
          ...stock,
          price: Number(newPrice.toFixed(2)),
          change: `${totalChange}%`
        };
      }));
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-white py-2 overflow-hidden">
      <div className="ticker-wrap">
        <div className="ticker">
          {stocks.map((stock, index) => (
            <div key={index} className="ticker__item text-3xl md:text-5xl">
              <span className="font-bold">{stock.symbol}</span>
              <span className="ml-2">${stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className={`ml-2 ${stock.change.startsWith('-') ? 'text-red-500' : 'text-green-500'}`}>
                {stock.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TradingSimulator() {
  const [price, setPrice] = useState(150);
  const [priceHistory, setPriceHistory] = useState([{
    time: Math.floor(Date.now() / 1000),
    open: 150,
    high: 150,
    low: 150,
    close: 150,
  }]);
  const [lastAction, setLastAction] = useState(null);
  const chartContainerRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
        layout: {
          backgroundColor: '#ffffff',
          textColor: '#000000',
        },
        grid: {
          vertLines: {
            color: '#e1e1e1',
          },
          horzLines: {
            color: '#e1e1e1',
          },
        },
        priceScale: {
          borderColor: '#cccccc',
        },
        timeScale: {
          borderColor: '#cccccc',
        },
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#4caf50',
        downColor: '#f44336',
        borderDownColor: '#f44336',
        borderUpColor: '#4caf50',
        wickDownColor: '#f44336',
        wickUpColor: '#4caf50',
      });

      chartRef.current = candlestickSeries;

      return () => chart.remove();
    }
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const sortedHistory = [...priceHistory].sort((a, b) => a.time - b.time);
      chartRef.current.setData(sortedHistory);
    }
  }, [priceHistory]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrice(prevPrice => {
        const change = (Math.random() - 0.5) * 2;
        const newPrice = Math.max(0, prevPrice + change);
        const lastEntry = priceHistory[priceHistory.length - 1];
        const newTime = lastEntry.time + 60; // Increment time by 60 seconds
        const newEntry = {
          time: newTime,
          open: lastEntry.close,
          high: Math.max(lastEntry.close, newPrice),
          low: Math.min(lastEntry.close, newPrice),
          close: newPrice,
        };
        setPriceHistory(prev => {
          // Remove duplicate timestamps
          const updatedHistory = [
            ...prev.filter(entry => entry.time < newTime),
            newEntry
          ].sort((a, b) => a.time - b.time); // Ensure the array is sorted
          return updatedHistory;
        });
        return newPrice;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [priceHistory]);

  const handleBuy = () => {
    setPrice(prev => prev * 1.05);
    setLastAction('buy');
  };

  const handleSell = () => {
    setPrice(prev => prev * 0.95);
    setLastAction('sell');
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-3xl font-bold mb-1">SOL/USD</h2>
      <p className='text-[11px] md:text-base'>CA: coming soon...</p>
      <div className="mb-4">
        <span className="text-xl font-semibold">Current Price: ${price.toFixed(2)}</span>
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <button 
          onClick={handleBuy} 
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Buy
        </button>
        <button 
          onClick={handleSell} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sell
        </button>
      </div>
      <div ref={chartContainerRef} className="w-64 md:w-80 h-64"></div>
    </div>
  );
}

export default App;
