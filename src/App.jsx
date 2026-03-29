import { useState, useEffect } from "react";

const APP_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080d14; color: #b8ccd8; font-family: monospace; min-height: 100vh; }
  .app { max-width: 800px; margin: 0 auto; padding: 2rem 1rem; }
  h1 { color: #00d9ff; font-size: 1.5rem; margin-bottom: 0.4rem; text-align: center; }
  .subtitle { color: #5a7a8a; text-align: center; margin-bottom: 2rem; font-size: 0.85rem; }
  .card { background: #0f1923; border: 1px solid #1e3040; border-radius: 8px; padding: 1.5rem; margin-bottom: 1.5rem; }
  .form-group { margin-bottom: 1rem; }
  label { display: block; color: #5a7a8a; font-size: 0.8rem; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.05em; }
  input, select { width: 100%; background: #080d14; border: 1px solid #1e3040; color: #b8ccd8; padding: 0.6rem 0.8rem; border-radius: 4px; font-family: monospace; font-size: 0.95rem; outline: none; }
  input:focus, select:focus { border-color: #00d9ff; }
  input::placeholder { color: #3a5a6a; }
  select option { background: #0f1923; }
  button { width: 100%; background: #00d9ff; color: #080d14; border: none; padding: 0.7rem; border-radius: 4px; font-family: monospace; font-weight: bold; font-size: 0.95rem; cursor: pointer; transition: opacity 0.2s; }
  button:hover:not(:disabled) { opacity: 0.85; }
  button:disabled { opacity: 0.4; cursor: not-allowed; }
  .response { background: #080d14; border: 1px solid #1e3040; border-radius: 4px; padding: 1rem; white-space: pre-wrap; line-height: 1.7; font-size: 0.9rem; color: #b8ccd8; min-height: 80px; }
  .response.error { color: #ff4d6d; border-color: #ff4d6d; }
  .response.loading { color: #00d9ff; }
  .ticker-badge { display: inline-block; background: #001a22; border: 1px solid #00d9ff; color: #00d9ff; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; margin-bottom: 0.8rem; }
  .tag { display: inline-block; background: #0f1923; color: #5a7a8a; font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px; margin-left: 0.3rem; border: 1px solid #1e3040; }
`;

const ANALYSIS_TYPES = [
  { value: "predict",  label: "Price Prediction" },
  { value: "analysis", label: "Technical Analysis" },
  { value: "sentiment",label: "Sentiment & News" },
  { value: "risk",     label: "Risk Assessment" },
  { value: "summary",  label: "Company Summary" },
];

function buildPrompt(ticker, type) {
  const t = ticker.toUpperCase();
  const map = {
    predict:   `You are a stock market analyst. Provide a short-term price prediction for ${t}. Cover key support/resistance levels, recent trend, and a 1-week outlook. Be concise and analytical.`,
    analysis:  `You are a technical analyst. Provide a technical analysis for ${t}. Cover trend, momentum, volume patterns, and key indicators (RSI, MACD, moving averages). Be concise.`,
    sentiment: `You are a financial analyst. Analyze the current market sentiment and recent news impact for ${t}. Discuss bullish/bearish signals from news and institutional activity.`,
    risk:      `You are a risk analyst. Assess the investment risk for ${t}. Cover volatility, beta, sector risks, company-specific risks, and an overall risk rating (Low/Medium/High). Be concise.`,
    summary:   `You are a financial analyst. Give a brief company summary for ${t}: business model, competitive position, recent financials, growth drivers, and a buy/hold/sell recommendation with rationale.`,
  };
  return map[type] || map.predict;
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
  const [ticker, setTicker]           = useState("");
  const [analysisType, setAnalysisType] = useState("predict");
  const [response, setResponse]       = useState("");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");
  const [lastTicker, setLastTicker]   = useState("");
  const [lastLabel, setLastLabel]     = useState("");

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = APP_CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  async function handleAnalyze(e) {
    e.preventDefault();
    const sym = ticker.trim();
    if (!sym) return;
    setLoading(true);
    setError("");
    setResponse("");
    setLastTicker(sym.toUpperCase());
    setLastLabel(ANALYSIS_TYPES.find((t) => t.value === analysisType)?.label || "");
    try {
      const result = await aiCall(buildPrompt(sym, analysisType));
      setResponse(result);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <h1>📈 Stock AI Dashboard</h1>
      <p className="subtitle">AI-powered stock analysis · Llama 3.3 70B via Groq</p>

      <div className="card">
        <form onSubmit={handleAnalyze}>
          <div className="form-group">
            <label>Stock Ticker</label>
            <input
              type="text"
              placeholder="e.g. AAPL, TSLA, NVDA"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
              maxLength={10}
              disabled={loading}
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label>Analysis Type</label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              disabled={loading}
            >
              {ANALYSIS_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={loading || !ticker.trim()}>
            {loading ? "Analyzing..." : "Analyze"}
          </button>
        </form>
      </div>

      {(response || error || loading) && (
        <div className="card">
          {lastTicker && (
            <div>
              <span className="ticker-badge">{lastTicker}</span>
              <span className="tag">{lastLabel}</span>
            </div>
          )}
          {loading && <div className="response loading">⟳ Fetching AI analysis…</div>}
          {error   && <div className="response error">⚠ {error}</div>}
          {response && <div className="response">{response}</div>}
        </div>
      )}
    </div>
  );
}
