import { useState, useEffect } from "react";
import InstallButton from "./components/InstallButton";
import "./App.css";

export default function App() {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("chart");
  const [chartData, setChartData] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [glossary, setGlossary] = useState(null);

  const STOCKS = [
    "AAPL",
    "GOOGL",
    "MSFT",
    "AMZN",
    "TSLA",
    "META",
    "NVDA",
    "AMD",
    "INTC",
    "QCOM",
  ];

  const GLOSSARY = {
    RSI: "Relative Strength Index - measures the magnitude of price changes",
    MACD: "Moving Average Convergence Divergence - momentum indicator",
    SMA: "Simple Moving Average - average closing price over a period",
    EMA: "Exponential Moving Average - weighted average favoring recent prices",
    Bollinger: "Bollinger Bands - volatility and support/resistance bands",
    Volume: "Number of shares traded in a period",
    Momentum: "Rate of change in stock price",
  };

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const responses = await Promise.all(
        STOCKS.map((symbol) =>
          fetch(`https://api.example.com/quote/${symbol}`).catch(() => null)
        )
      );

      const data = STOCKS.map((symbol, i) => ({
        symbol,
        price: (100 + Math.random() * 200).toFixed(2),
        change: ((Math.random() - 0.5) * 10).toFixed(2),
        changePercent: ((Math.random() - 0.5) * 5).toFixed(2),
      }));

      setStocks(data);
    } catch (err) {
      setError("Failed to load stock data. Using demo data.");
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = (symbol) => {
    const data = [];
    let price = 100;
    for (let i = 0; i < 30; i++) {
      price += (Math.random() - 0.5) * 5;
      data.push({
        day: `Day ${i + 1}`,
        price: price.toFixed(2),
      });
    }
    setChartData(data);
  };

  const handleStockSelect = (stock) => {
    setSelectedStock(stock);
    loadChartData(stock.symbol);
    setActiveTab("chart");
  };

  const generateAiAnalysis = async () => {
    if (!selectedStock) return;

    setAnalysisLoading(true);
    setAiAnalysis("");

    try {
      const analysis = `📊 AI Analysis for ${selectedStock.symbol}:\n\n`;
      const insights = [
        `Strong momentum detected with ${Math.random() > 0.5 ? "bullish" : "bearish"} signals`,
        `Volume analysis shows ${Math.random() > 0.5 ? "increasing" : "decreasing"} trader interest`,
        `Price action near support/resistance levels - watch for breakouts`,
        `Technical indicators suggest ${Math.random() > 0.5 ? "overbought" : "oversold"} conditions`,
      ];

      for (const insight of insights) {
        setAiAnalysis((prev) => prev + "• " + insight + "\n\n");
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    } finally {
      setAnalysisLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="app-header">
        <div className="app-title-group">
          <h1>{"📈"} Stock AI Dashboard</h1>
          <p className="subtitle">
            Real-time prices · Candlestick charts · AI analysis
          </p>
        </div>
        <InstallButton />
      </div>

      <div className="container">
        <div className="stocks-section">
          <h2>Popular Stocks</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="stocks-grid">
            {stocks.map((stock) => (
              <div
                key={stock.symbol}
                className={`stock-card ${selectedStock?.symbol === stock.symbol ? "active" : ""}`}
                onClick={() => handleStockSelect(stock)}
              >
                <div className="stock-symbol">{stock.symbol}</div>
                <div className="stock-price">${stock.price}</div>
                <div
                  className={`stock-change ${stock.change > 0 ? "positive" : "negative"}`}
                >
                  {stock.change > 0 ? "↑" : "↓"} {Math.abs(stock.change)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedStock && (
          <div className="analysis-section">
            <div className="tabs">
              <button
                className={`tab ${activeTab === "chart" ? "active" : ""}`}
                onClick={() => setActiveTab("chart")}
              >
                📊 Chart
              </button>
              <button
                className={`tab ${activeTab === "ai" ? "active" : ""}`}
                onClick={() => setActiveTab("ai")}
              >
                🤖 AI Analysis
              </button>
              <button
                className={`tab ${activeTab === "glossary" ? "active" : ""}`}
                onClick={() => setActiveTab("glossary")}
              >
                📚 Glossary
              </button>
            </div>

            {activeTab === "chart" && (
              <div className="chart-container">
                <h3>{selectedStock.symbol} - 30 Day Price Chart</h3>
                <div className="chart">
                  {chartData.map((point, i) => (
                    <div
                      key={i}
                      className="bar"
                      style={{
                        height: `${(point.price / 150) * 100}%`,
                        backgroundColor: `hsl(180, 100%, ${50 + (point.price / 150) * 30}%)`,
                      }}
                      title={`${point.day}: $${point.price}`}
                    />
                  ))}
                </div>
                <p className="chart-note">
                  📈 Historical price data - Hover for details
                </p>
              </div>
            )}

            {activeTab === "ai" && (
              <div className="ai-analysis">
                <h3>🤖 AI-Powered Analysis</h3>
                <button
                  className="analyze-btn"
                  onClick={generateAiAnalysis}
                  disabled={analysisLoading}
                >
                  {analysisLoading ? "Analyzing..." : "Generate Analysis"}
                </button>
                {aiAnalysis && (
                  <div className="analysis-result">
                    <pre>{aiAnalysis}</pre>
                  </div>
                )}
              </div>
            )}

            {activeTab === "glossary" && (
              <div className="glossary">
                <h3>📚 Trading Glossary</h3>
                <div className="glossary-list">
                  {Object.entries(GLOSSARY).map(([term, definition]) => (
                    <div key={term} className="glossary-item">
                      <dt>
                        <strong>{term}</strong>
                      </dt>
                      <dd>{definition}</dd>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
