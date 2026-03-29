import { useState, useEffect, useRef } from "react";

const APP_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080d14; color: #b8ccd8; font-family: monospace; min-height: 100vh; }
  .app { max-width: 860px; margin: 0 auto; padding: 2rem 1rem; }
  h1 { color: #00d9ff; font-size: 1.5rem; margin-bottom: 0.4rem; text-align: center; }
  .subtitle { color: #5a7a8a; text-align: center; margin-bottom: 2rem; font-size: 0.85rem; }
  .card { background: #0f1923; border: 1px solid #1e3040; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .form-row { display: flex; gap: 1rem; }
  .form-group { flex: 1; margin-bottom: 1rem; }
  label { display: block; color: #5a7a8a; font-size: 0.8rem; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.05em; }
  input, select { width: 100%; background: #080d14; border: 1px solid #1e3040; color: #b8ccd8; padding: 0.6rem 0.8rem; border-radius: 4px; font-family: monospace; font-size: 0.95rem; outline: none; }
  input:focus, select:focus { border-color: #00d9ff; }
  input::placeholder { color: #3a5a6a; }
  select option { background: #0f1923; }
  .btn-primary { width: 100%; background: #00d9ff; color: #080d14; border: none; padding: 0.7rem; border-radius: 4px; font-family: monospace; font-weight: bold; font-size: 0.95rem; cursor: pointer; transition: opacity 0.2s; }
  .btn-primary:hover:not(:disabled) { opacity: 0.85; }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-icon { background: none; border: 1px solid #1e3040; color: #5a7a8a; padding: 0.3rem 0.7rem; border-radius: 4px; font-family: monospace; font-size: 0.78rem; cursor: pointer; transition: color 0.2s, border-color 0.2s; }
  .btn-icon:hover:not(:disabled) { color: #00d9ff; border-color: #00d9ff; }
  .btn-icon:disabled { opacity: 0.4; cursor: not-allowed; }
  .response { background: #080d14; border: 1px solid #1e3040; border-radius: 4px; padding: 1rem; white-space: pre-wrap; line-height: 1.7; font-size: 0.9rem; color: #b8ccd8; min-height: 80px; margin-top: 0.8rem; }
  .response.error { color: #ff4d6d; border-color: #ff4d6d; }
  .response.loading { color: #00d9ff; }
  .stock-header { display: flex; align-items: flex-start; gap: 1.5rem; margin-bottom: 1rem; }
  .stock-left { flex-shrink: 0; }
  .stock-right { flex: 1; min-width: 0; }
  .stock-name { font-size: 0.78rem; color: #5a7a8a; margin-bottom: 0.15rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .stock-symbol { font-size: 1.2rem; color: #00d9ff; font-weight: bold; }
  .stock-price { font-size: 1.9rem; font-weight: bold; color: #e8f4ff; margin: 0.25rem 0; line-height: 1; }
  .stock-change { font-size: 0.95rem; }
  .stock-change.up { color: #00ff88; }
  .stock-change.down { color: #ff4d6d; }
  .market-badge { display: inline-block; font-size: 0.68rem; padding: 0.18rem 0.45rem; border-radius: 3px; margin-top: 0.4rem; letter-spacing: 0.04em; }
  .market-badge.REGULAR { background: #002a1a; color: #00ff88; border: 1px solid #00ff88; }
  .market-badge.PRE     { background: #2a1f00; color: #ffaa00; border: 1px solid #ffaa00; }
  .market-badge.POST    { background: #2a1f00; color: #ffaa00; border: 1px solid #ffaa00; }
  .market-badge.CLOSED  { background: #141e28; color: #5a7a8a; border: 1px solid #3a5a6a; }
  .sparkline-box { width: 100%; }
  .stock-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 0.55rem; margin-top: 0.75rem; }
  .stat { background: #080d14; border: 1px solid #1e3040; border-radius: 4px; padding: 0.45rem 0.65rem; }
  .stat-label { font-size: 0.68rem; color: #5a7a8a; text-transform: uppercase; letter-spacing: 0.05em; }
  .stat-value { font-size: 0.92rem; color: #b8ccd8; margin-top: 0.15rem; }
  .refresh-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
  .refresh-info { font-size: 0.72rem; color: #3a5a6a; }
  .ticker-badge { display: inline-block; background: #001a22; border: 1px solid #00d9ff; color: #00d9ff; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; margin-bottom: 0.1rem; }
  .tag { display: inline-block; background: #0f1923; color: #5a7a8a; font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px; margin-left: 0.3rem; border: 1px solid #1e3040; }
`;

const ANALYSIS_TYPES = [
  { value: "predict",   label: "Price Prediction" },
  { value: "analysis",  label: "Technical Analysis" },
  { value: "sentiment", label: "Sentiment & News" },
  { value: "risk",      label: "Risk Assessment" },
  { value: "summary",   label: "Company Summary" },
];

function fmtPrice(n) {
  if (n == null) return "—";
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtVolume(n) {
  if (n == null) return "—";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toString();
}

function fmtCap(n) {
  if (n == null) return "—";
  if (n >= 1e12) return "$" + (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9)  return "$" + (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6)  return "$" + (n / 1e6).toFixed(2) + "M";
  return "$" + n.toLocaleString();
}

function Sparkline({ data, positive }) {
  if (!data || data.length < 2) return null;
  const prices = data.map((d) => d.c);
  const min    = Math.min(...prices);
  const max    = Math.max(...prices);
  const range  = max - min || 1;
  const W = 100, H = 46;
  const pts = prices
    .map((p, i) => {
      const x = (i / (prices.length - 1)) * W;
      const y = H - ((p - min) / range) * (H - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  const color = positive ? "#00ff88" : "#ff4d6d";
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="64"
      preserveAspectRatio="none"
      style={{ display: "block" }}
    >
      <polyline
        points={`0,${H} ${pts} ${W},${H}`}
        fill={color}
        fillOpacity="0.07"
        stroke="none"
      />
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

const STATE_LABEL = {
  REGULAR: "Market Open",
  PRE:     "Pre-Market",
  POST:    "After-Hours",
  CLOSED:  "Market Closed",
};

function StockPanel({ data, onRefresh, refreshing, lastUpdated }) {
  const up = (data.change ?? 0) >= 0;
  const sign = up ? "+" : "";
  const changeStr = `${sign}${fmtPrice(data.change)} (${sign}${data.changePercent?.toFixed(2)}%)`;
  const state = data.marketState || "CLOSED";
  const curr  = data.currency === "USD" ? "$" : (data.currency ?? "") + " ";

  return (
    <div>
      <div className="refresh-row">
        <span className="refresh-info">
          {lastUpdated ? `Updated ${lastUpdated}` : ""} · Auto-refresh every 30s
        </span>
        <button className="btn-icon" onClick={onRefresh} disabled={refreshing}>
          {refreshing ? "⟳" : "↻ Refresh"}
        </button>
      </div>

      <div className="stock-header">
        <div className="stock-left">
          <div className="stock-name">{data.shortName}</div>
          <div className="stock-symbol">{data.symbol}</div>
          <div className="stock-price">{curr}{fmtPrice(data.price)}</div>
          <div className={`stock-change ${up ? "up" : "down"}`}>{changeStr}</div>
          <div className={`market-badge ${state}`}>{STATE_LABEL[state] ?? state}</div>
        </div>
        <div className="stock-right sparkline-box">
          <Sparkline data={data.sparkline} positive={up} />
        </div>
      </div>

      <div className="stock-stats">
        <div className="stat"><div className="stat-label">Open</div><div className="stat-value">{curr}{fmtPrice(data.open)}</div></div>
        <div className="stat"><div className="stat-label">Prev Close</div><div className="stat-value">{curr}{fmtPrice(data.previousClose)}</div></div>
        <div className="stat"><div className="stat-label">Day High</div><div className="stat-value">{curr}{fmtPrice(data.dayHigh)}</div></div>
        <div className="stat"><div className="stat-label">Day Low</div><div className="stat-value">{curr}{fmtPrice(data.dayLow)}</div></div>
        <div className="stat"><div className="stat-label">Volume</div><div className="stat-value">{fmtVolume(data.volume)}</div></div>
        <div className="stat"><div className="stat-label">Market Cap</div><div className="stat-value">{fmtCap(data.marketCap)}</div></div>
      </div>
    </div>
  );
}

function buildPrompt(ticker, type, stock) {
  const t = ticker.toUpperCase();
  const ctx = stock
    ? `Live data — Price: $${fmtPrice(stock.price)}, Change today: ${(stock.change ?? 0) >= 0 ? "+" : ""}${fmtPrice(stock.change)} (${stock.changePercent?.toFixed(2)}%), Day range: $${fmtPrice(stock.dayLow)}–$${fmtPrice(stock.dayHigh)}, Volume: ${fmtVolume(stock.volume)}, Market Cap: ${fmtCap(stock.marketCap)}. `
    : "";
  const base = {
    predict:   `${ctx}You are a stock market analyst. Provide a short-term price prediction for ${t}. Cover key support/resistance levels, recent trend, and a 1-week outlook. Be concise and analytical.`,
    analysis:  `${ctx}You are a technical analyst. Provide a technical analysis for ${t}. Cover trend, momentum, volume patterns, and key indicators (RSI, MACD, moving averages). Be concise.`,
    sentiment: `${ctx}You are a financial analyst. Analyze the current market sentiment and recent news impact for ${t}. Discuss bullish/bearish signals from news and institutional activity.`,
    risk:      `${ctx}You are a risk analyst. Assess the investment risk for ${t}. Cover volatility, beta, sector risks, company-specific risks, and an overall risk rating (Low/Medium/High). Be concise.`,
    summary:   `${ctx}You are a financial analyst. Give a brief company summary for ${t}: business model, competitive position, recent financials, growth drivers, and a buy/hold/sell recommendation with rationale.`,
  };
  return base[type] || base.predict;
}

async function fetchStock(ticker) {
  const res = await fetch(`/api/stock?ticker=${encodeURIComponent(ticker)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Stock fetch failed (${res.status})`);
  return data;
}

async function aiCall(prompt) {
  const res = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 600,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response received.";
}

export default function App() {
  const [ticker, setTicker]         = useState("");
  const [analysisType, setType]     = useState("predict");
  const [stockData, setStockData]   = useState(null);
  const [stockErr, setStockErr]     = useState("");
  const [stockLoading, setStockLoading] = useState(false);
  const [response, setResponse]     = useState("");
  const [aiLoading, setAiLoading]   = useState(false);
  const [aiError, setAiError]       = useState("");
  const [activeTicker, setActive]   = useState("");
  const [lastUpdated, setLastUpdated] = useState("");
  const [activeLabel, setActiveLabel] = useState("");
  const intervalRef = useRef(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = APP_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  async function loadStock(sym, quiet = false) {
    if (!quiet) setStockLoading(true);
    try {
      const data = await fetchStock(sym);
      setStockData(data);
      setStockErr("");
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      setStockErr(e.message);
    } finally {
      setStockLoading(false);
    }
  }

  useEffect(() => {
    if (!activeTicker) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => loadStock(activeTicker, true), 30000);
    return () => clearInterval(intervalRef.current);
  }, [activeTicker]);

  async function handleAnalyze(e) {
    e.preventDefault();
    const sym = ticker.trim().toUpperCase();
    if (!sym) return;

    setActive(sym);
    setActiveLabel(ANALYSIS_TYPES.find((t) => t.value === analysisType)?.label || "");
    setResponse("");
    setAiError("");
    setStockErr("");
    setAiLoading(true);
    setStockLoading(true);

    let stock = null;
    try {
      stock = await fetchStock(sym);
      setStockData(stock);
      setStockErr("");
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      setStockErr(e.message);
    } finally {
      setStockLoading(false);
    }

    try {
      const result = await aiCall(buildPrompt(sym, analysisType, stock));
      setResponse(result);
    } catch (err) {
      setAiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setAiLoading(false);
    }
  }

  const showStock = stockData || stockLoading || stockErr;
  const showAi    = response || aiError || aiLoading;

  return (
    <div className="app">
      <h1>📈 Stock AI Dashboard</h1>
      <p className="subtitle">Real-time prices · AI-powered analysis · Auto-refresh every 30s</p>

      <div className="card">
        <form onSubmit={handleAnalyze}>
          <div className="form-row">
            <div className="form-group">
              <label>Stock Ticker</label>
              <input
                type="text"
                placeholder="e.g. AAPL, TSLA, NVDA"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                maxLength={10}
                disabled={aiLoading}
                autoComplete="off"
              />
            </div>
            <div className="form-group">
              <label>Analysis Type</label>
              <select
                value={analysisType}
                onChange={(e) => setType(e.target.value)}
                disabled={aiLoading}
              >
                {ANALYSIS_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="btn-primary" type="submit" disabled={aiLoading || !ticker.trim()}>
            {aiLoading ? "Analyzing…" : "Analyze"}
          </button>
        </form>
      </div>

      {showStock && (
        <div className="card">
          {stockLoading && !stockData && (
            <div className="response loading">⟳ Fetching live market data…</div>
          )}
          {stockErr && !stockData && (
            <div className="response error">⚠ {stockErr}</div>
          )}
          {stockData && (
            <StockPanel
              data={stockData}
              onRefresh={() => loadStock(activeTicker)}
              refreshing={stockLoading}
              lastUpdated={lastUpdated}
            />
          )}
        </div>
      )}

      {showAi && (
        <div className="card">
          {activeTicker && (
            <div>
              <span className="ticker-badge">{activeTicker}</span>
              <span className="tag">{activeLabel}</span>
            </div>
          )}
          {aiLoading && (
            <div className="response loading">⟳ Generating AI analysis…</div>
          )}
          {aiError && (
            <div className="response error">⚠ {aiError}</div>
          )}
          {response && (
            <div className="response">{response}</div>
          )}
        </div>
      )}
    </div>
  );
}
