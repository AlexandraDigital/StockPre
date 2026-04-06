import React, { useState, useEffect } from 'react';
import StockChart from './components/StockChart';
import StockInfo from './components/StockInfo';
import Glossary from './components/Glossary';
import InstallButton from './components/InstallButton';

const App = () => {
  const [activeTicker, setActiveTicker] = useState('AAPL');
  const [range, setRange] = useState('1mo');
  const [chartData, setChartData] = useState([]);
  const [stockInfo, setStockInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStockData = async (ticker, timeRange) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/stock?ticker=${ticker}&range=${timeRange}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Validate API response structure
      if (!data || !Array.isArray(data.chart)) {
        throw new Error('Invalid API response structure');
      }
      
      setChartData(data.chart);
      setStockInfo(data.info);
    } catch (err) {
      setError(err.message || 'Failed to load stock data. Please try again.');
      setChartData([]);
      setStockInfo(null);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount and when ticker/range changes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStockData(activeTicker, range);
    }, 60000); // Auto-refresh every minute

    fetchStockData(activeTicker, range);
    return () => clearInterval(interval);
  }, [activeTicker, range]);

  const handleSearch = (ticker) => {
    setActiveTicker(ticker);
  };

  const handleRangeChange = (newRange) => {
    setRange(newRange);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Install Button */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">StockPre</h1>
            <p className="text-slate-400">Real·time stock analysis and insights</p>
          </div>
          <InstallButton />
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search ticker (e.g., AAPL, GOOGL, MSFT)"
            defaultValue={activeTicker}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSearch(e.target.value.toUpperCase());
              }
            }}
            className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:border-blue-500 outline-none transition"
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-200">
            ⚠ {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-slate-400">Loading stock data ⟳</p>
          </div>
        )}

        {/* Main Content */}
        {!loading && chartData.length > 0 && (
          <>
            {/* Stock Info */}
            {stockInfo && <StockInfo data={stockInfo} />}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <StockChart
                data={chartData}
                type="candlestick"
                title={`${activeTicker} Candlestick Chart`}
              />
              <StockChart
                data={chartData}
                type="area"
                title={`${activeTicker} Area Chart`}
              />
            </div>

            {/* Range Selector */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {['1d', '5d', '1mo', '3mo', '1y'].map((r) => (
                <button
                  key={r}
                  onClick={() => handleRangeChange(r)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    range === r
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {r.toUpperCase()}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Glossary */}
        <Glossary />
      </div>
    </div>
  );
};

export default App;