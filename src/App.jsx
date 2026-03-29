import { useState, useEffect, useRef } from "react";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const APP_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #080d14; color: #b8ccd8; font-family: monospace; min-height: 100vh; }
  .app { max-width: 1000px; margin: 0 auto; padding: 2rem 1rem 4rem; }
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
  .btn-sm { background: none; border: 1px solid #1e3040; color: #5a7a8a; padding: 0.3rem 0.7rem; border-radius: 4px; font-family: monospace; font-size: 0.78rem; cursor: pointer; transition: color 0.2s, border-color 0.2s, background 0.2s; }
  .btn-sm:hover:not(:disabled) { color: #00d9ff; border-color: #00d9ff; }
  .btn-sm.active { background: #00d9ff22; color: #00d9ff; border-color: #00d9ff; }
  .btn-sm:disabled { opacity: 0.4; cursor: not-allowed; }
  .response { background: #080d14; border: 1px solid #1e3040; border-radius: 4px; padding: 1rem; white-space: pre-wrap; line-height: 1.7; font-size: 0.9rem; color: #b8ccd8; min-height: 80px; margin-top: 0.8rem; }
  .response.error { color: #ff4d6d; border-color: #ff4d6d; }
  .response.loading { color: #00d9ff; }
  .stock-header { display: flex; align-items: flex-start; gap: 1.5rem; margin-bottom: 1.2rem; flex-wrap: wrap; }
  .stock-name { font-size: 0.78rem; color: #5a7a8a; margin-bottom: 0.15rem; }
  .stock-symbol { font-size: 1.2rem; color: #00d9ff; font-weight: bold; }
  .stock-price { font-size: 2rem; font-weight: bold; color: #e8f4ff; margin: 0.25rem 0; line-height: 1; }
  .stock-change { font-size: 0.95rem; }
  .stock-change.up { color: #00ff88; }
  .stock-change.down { color: #ff4d6d; }
  .market-badge { display: inline-block; font-size: 0.68rem; padding: 0.18rem 0.45rem; border-radius: 3px; margin-top: 0.4rem; letter-spacing: 0.04em; }
  .market-badge.REGULAR { background: #002a1a; color: #00ff88; border: 1px solid #00ff88; }
  .market-badge.PRE     { background: #2a1f00; color: #ffaa00; border: 1px solid #ffaa00; }
  .market-badge.POST    { background: #2a1f00; color: #ffaa00; border: 1px solid #ffaa00; }
  .market-badge.CLOSED  { background: #141e28; color: #5a7a8a; border: 1px solid #3a5a6a; }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 0.55rem; margin-bottom: 1.2rem; }
  .stat { background: #080d14; border: 1px solid #1e3040; border-radius: 4px; padding: 0.5rem 0.65rem; cursor: default; position: relative; }
  .stat:hover .tooltip { display: block; }
  .stat-label { font-size: 0.68rem; color: #5a7a8a; text-transform: uppercase; letter-spacing: 0.05em; }
  .stat-value { font-size: 0.92rem; color: #b8ccd8; margin-top: 0.15rem; }
  .tooltip { display: none; position: absolute; bottom: calc(100% + 6px); left: 50%; transform: translateX(-50%); background: #1e3040; border: 1px solid #2a4a60; color: #b8ccd8; font-size: 0.72rem; padding: 0.4rem 0.6rem; border-radius: 4px; width: 210px; z-index: 10; line-height: 1.5; pointer-events: none; white-space: normal; }
  .chart-controls { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 0.5rem; }
  .btn-group { display: flex; gap: 0.3rem; flex-wrap: wrap; }
  .chart-wrap { width: 100%; overflow: hidden; }
  .refresh-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem; }
  .refresh-info { font-size: 0.72rem; color: #3a5a6a; }
  .ticker-badge { display: inline-block; background: #001a22; border: 1px solid #00d9ff; color: #00d9ff; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.8rem; margin-bottom: 0.1rem; }
  .tag { display: inline-block; background: #0f1923; color: #5a7a8a; font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px; margin-left: 0.3rem; border: 1px solid #1e3040; }
  .glossary-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 0.75rem; }
  .gloss-item { background: #080d14; border: 1px solid #1e3040; border-radius: 4px; padding: 0.75rem; }
  .gloss-term { color: #00d9ff; font-size: 0.9rem; font-weight: bold; margin-bottom: 0.3rem; }
  .gloss-def { color: #8aaabb; font-size: 0.8rem; line-height: 1.5; }
  .gloss-example { color: #5a7a8a; font-size: 0.73rem; margin-top: 0.25rem; font-style: italic; }
  .section-toggle { background: none; border: none; color: #00d9ff; font-family: monospace; font-size: 1rem; cursor: pointer; padding: 0; margin-bottom: 1rem; display: flex; align-items: center; gap: 0.5rem; width: 100%; text-align: left; }
  .crosshair-info { font-size: 0.75rem; color: #b8ccd8; text-align: right; min-height: 1.1em; margin-bottom: 0.3rem; font-family: monospace; }
  .chart-vol-label { font-size: 0.65rem; fill: #3a5a6a; font-family: monospace; }
`;

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const ANALYSIS_TYPES = [
  { value: "predict",   label: "Price Prediction" },
  { value: "analysis",  label: "Technical Analysis" },
  { value: "sentiment", label: "Sentiment & News" },
  { value: "risk",      label: "Risk Assessment" },
  { value: "summary",   label: "Company Summary" },
];

const RANGES = ["1d", "5d", "1mo", "3mo", "6mo", "1y"];
const CHART_TYPES = ["Candlestick", "Line", "Area"];

const STATE_LABEL = {
  REGULAR: "Market Open",
  PRE:     "Pre-Market",
  POST:    "After-Hours",
  CLOSED:  "Market Closed",
};

const STAT_INFO = {
  "Open":       "The first traded price when the market opened at 9:30 AM ET. Compare to current price to see today's direction.",
  "Prev Close": "Yesterday's closing price. The daily change % is calculated from this number.",
  "Day High":   "Highest price reached today. Acts as a short-term resistance level — price may pull back here.",
  "Day Low":    "Lowest price today. Acts as a short-term support level — price may bounce here.",
  "Volume":     "Shares bought & sold today. High volume = strong conviction behind the move. Low volume = weak move.",
  "Market Cap": "Total company value = Price × Shares Outstanding. Large Cap >$10B, Mid Cap $2–10B, Small Cap <$2B.",
  "P/E Ratio":  "Price-to-Earnings — how much you pay per $1 of profit. S&P 500 avg ≈ 20–25. High P/E = growth expectations.",
  "EPS":        "Earnings Per Share — company profit ÷ total shares. Higher EPS = more profitable per share.",
  "52W High":   "Highest price in the last 52 weeks. Breaking above it is a strong bullish signal.",
  "52W Low":    "Lowest price in the last 52 weeks. Bouncing off it can be bullish; breaking below is bearish.",
  "Avg Volume": "Average daily shares traded over 3 months. If today's volume is 2× avg, something big is happening.",
  "Beta":       "Volatility vs S&P 500. Beta 1.5 = moves 50% more than market. Beta 0.5 = half as volatile. Beta 1 = tracks market.",
  "Div Yield":  "Annual dividend as % of price. Free income just for holding the stock. 2–4% is typical for dividend stocks.",
};

// ─── GLOSSARY ─────────────────────────────────────────────────────────────────
const GLOSSARY = [
  { term: "Stock / Share", def: "A small piece of ownership in a company. If Apple has 1 billion shares and you own 1, you own 1 billionth of Apple.", example: "Buying 10 shares of AAPL at $180 costs $1,800 and gives you partial ownership of Apple." },
  { term: "Ticker Symbol", def: "A short code that identifies a stock on an exchange. Usually 1–5 letters.", example: "AAPL = Apple, TSLA = Tesla, NVDA = NVIDIA, MSFT = Microsoft" },
  { term: "Price", def: "What one share costs right now. It changes constantly during market hours based on supply and demand.", example: "If AAPL is $185.50, that's the price the last buyer paid for one Apple share." },
  { term: "Change & Change %", def: "How much the price moved vs. yesterday's close. Green = up (profit), Red = down (loss).", example: "+$2.50 (+1.37%) means the stock gained $2.50 per share today — 1.37% more than yesterday." },
  { term: "Open", def: "The first traded price when the market opened at 9:30 AM ET.", example: "If Open is $183 and current price is $185, the stock is up $2 since the market opened." },
  { term: "Close / Prev Close", def: "The final traded price when the market closed at 4:00 PM ET the previous trading day. All daily change %s are calculated from this.", example: "Prev Close $182 + today's change +$3 = current price $185." },
  { term: "High / Low", def: "The highest and lowest prices traded during the current trading session. Shows today's volatility range.", example: "High $187, Low $182 means the stock swung $5 in value today." },
  { term: "Volume", def: "Total shares bought and sold today. High volume confirms the strength of a price move. Low volume suggests weak conviction.", example: "10M volume on a stock that normally trades 2M = major news or institutional buying/selling." },
  { term: "Market Cap", def: "Total company value = Price × Total Shares. Tells you the company's size category.", example: "Large Cap (>$10B) = stable giants like Apple. Small Cap (<$2B) = higher risk, higher potential growth." },
  { term: "P/E Ratio", def: "Price-to-Earnings ratio. How much you're paying for each $1 of company profit. Lower can mean the stock is cheaper relative to earnings.", example: "P/E 25 = you pay $25 for every $1 the company earns. The S&P 500 average is ~20–25." },
  { term: "EPS", def: "Earnings Per Share — the company's total profit divided by total shares outstanding. Measures profitability per share.", example: "EPS $6 means the company earned $6 in profit per share last year." },
  { term: "52-Week High/Low", def: "The highest and lowest traded prices over the past 52 weeks. Key reference points traders watch closely.", example: "Stock near its 52W high = strong momentum. Near 52W low = potential value buy or danger sign." },
  { term: "Beta", def: "Measures how much a stock moves relative to the S&P 500 market. Beta > 1 = more volatile than market. Beta < 1 = more stable.", example: "Beta 1.5: if S&P drops 10%, this stock typically drops 15%. Higher risk, higher potential reward." },
  { term: "Dividend Yield", def: "Annual dividend payment expressed as a % of the current stock price. This is passive income you earn just for holding the stock.", example: "3% yield on a $100 stock = $3/year per share paid directly to you." },
  { term: "Candlestick", def: "A chart bar showing Open, High, Low, Close for one time period. The body shows Open-to-Close movement. The wick shows the full High-to-Low range.", example: "Green candle = price went up that period. Red candle = price went down. Tall wicks = high volatility." },
  { term: "Support Level", def: "A price where the stock tends to stop falling and bounce back up. Think of it as a floor the price respects.", example: "If AAPL bounced off $170 three times, $170 is a strong support level. Break below it = warning sign." },
  { term: "Resistance Level", def: "A price where the stock tends to stop rising and pull back down. Think of it as a ceiling.", example: "If a stock failed to break $200 multiple times, $200 is resistance. Breaking above it = bullish breakout." },
  { term: "Bull Market", def: "A market trending upward — broadly defined as a 20%+ rise from recent lows. Investors are optimistic.", example: "2009–2020 was the longest bull market in US history, driven by low interest rates and tech growth." },
  { term: "Bear Market", def: "A market falling 20%+ from recent highs. Investors are pessimistic and selling.", example: "2022 was a bear market — the S&P 500 dropped ~25% due to rising interest rates and inflation." },
  { term: "Moving Average (SMA)", def: "The average price over a set number of days (e.g., 50-day or 200-day MA). Smooths out noise to show the underlying trend.", example: "Price above 50-day MA = short-term uptrend. Price below 200-day MA = long-term downtrend." },
  { term: "RSI (Relative Strength Index)", def: "A momentum indicator from 0–100 that shows if a stock is overbought or oversold. Think of it as a 'temperature' for price momentum.", example: "RSI > 70 = potentially overbought (may pull back). RSI < 30 = potentially oversold (may bounce). RSI 50 = neutral." },
  { term: "Pre-Market / After-Hours", def: "Trading that happens before the market opens (4–9:30 AM ET) or after it closes (4–8 PM ET). Less volume, more volatile, wider price swings.", example: "An earnings report drops at 5 PM — the stock could move 10% in after-hours before the next regular session." },
  { term: "Market Order vs Limit Order", def: "Market order = buy/sell immediately at whatever the current price is. Limit order = only buy/sell at your specified price or better.", example: "AAPL at $185. Limit order at $180 = only buys if price drops to $180. Market order buys right now at $185." },
];

// ─── FORMATTERS ───────────────────────────────────────────────────────────────
function fmtPrice(n) {
  if (n == null) return "\u2014";
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtVolume(n) {
  if (n == null) return "\u2014";
  if (n >= 1e9) return (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return (n / 1e3).toFixed(1) + "K";
  return n.toString();
}

function fmtCap(n) {
  if (n == null) return "\u2014";
  if (n >= 1e12) return "$" + (n / 1e12).toFixed(2) + "T";
  if (n >= 1e9)  return "$" + (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6)  return "$" + (n / 1e6).toFixed(2) + "M";
  return "$" + n.toLocaleString();
}

function fmtTime(isoStr, range) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  if (range === "1d" || range === "5d") {
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── CHART CONSTANTS ──────────────────────────────────────────────────────────
const VW   = 800;
const H_PX = 300;
const H_VL = 70;
const PAD  = { top: 12, right: 62, bottom: 28, left: 8 };

function useChartLayout(candles) {
  if (!candles || candles.length < 2) return null;
  const highs   = candles.map(d => d.h);
  const lows    = candles.map(d => d.l);
  const volumes = candles.map(d => d.v || 0);
  const minP = Math.min(...lows)   * 0.9995;
  const maxP = Math.max(...highs)  * 1.0005;
  const maxV = Math.max(...volumes) * 1.1 || 1;

  const cW = VW - PAD.left - PAD.right;
  const cH = H_PX - PAD.top - PAD.bottom;

  const scaleX   = (i) => PAD.left + (i / Math.max(1, candles.length - 1)) * cW;
  const scaleY   = (p) => PAD.top  + (1 - (p - minP) / (maxP - minP)) * cH;
  const scaleVol = (v) => H_VL - (v / maxV) * (H_VL - 4);

  const yTicks = [];
  for (let i = 0; i <= 5; i++) {
    const p = minP + (i / 5) * (maxP - minP);
    yTicks.push({ p, y: scaleY(p) });
  }

  const xTicks = [];
  const stride = Math.max(1, Math.floor(candles.length / 5));
  for (let i = 0; i < candles.length; i += stride) {
    xTicks.push({ i, x: scaleX(i), time: candles[i].time });
  }

  const candleW = Math.max(1.5, Math.min(14, (cW / candles.length) * 0.7));

  return { scaleX, scaleY, scaleVol, yTicks, xTicks, cH, candleW };
}

// ─── CANDLESTICK CHART ────────────────────────────────────────────────────────
function CandlestickChart({ candles, range, onHover }) {
  const L = useChartLayout(candles);
  if (!L) return <div style={{color:'#5a7a8a',fontSize:'0.8rem',padding:'2rem 0',textAlign:'center'}}>Not enough data for chart</div>;
  const { scaleX, scaleY, scaleVol, yTicks, xTicks, candleW } = L;
  const baseY = H_PX - PAD.bottom;

  return (
    <svg viewBox={`0 0 ${VW} ${H_PX + H_VL + 12}`} width="100%" style={{display:'block'}}>
      {/* Grid */}
      {yTicks.map((t,i) => <line key={i} x1={PAD.left} y1={t.y} x2={VW-PAD.right} y2={t.y} stroke="#1e3040" strokeWidth="0.5"/>)}
      {/* Y labels */}
      {yTicks.map((t,i) => <text key={i} x={VW-PAD.right+4} y={t.y+4} fontSize="9" fill="#3a5a6a" fontFamily="monospace">${fmtPrice(t.p)}</text>)}
      {/* X labels */}
      {xTicks.map((t,i) => <text key={i} x={t.x} y={H_PX+H_VL+10} fontSize="9" fill="#3a5a6a" textAnchor="middle" fontFamily="monospace">{fmtTime(t.time, range)}</text>)}
      {/* Candles */}
      {candles.map((d,i) => {
        const x  = scaleX(i);
        const oY = scaleY(d.o);
        const cY = scaleY(d.c);
        const hY = scaleY(d.h);
        const lY = scaleY(d.l);
        const isUp = d.c >= d.o;
        const col  = isUp ? "#00ff88" : "#ff4d6d";
        const bTop = Math.min(oY, cY);
        const bH   = Math.max(1.5, Math.abs(cY - oY));
        return (
          <g key={i} onMouseEnter={() => onHover(d)} onMouseLeave={() => onHover(null)} style={{cursor:'crosshair'}}>
            <line x1={x} y1={hY} x2={x} y2={lY} stroke={col} strokeWidth="1"/>
            <rect x={x - candleW/2} y={bTop} width={candleW} height={bH} fill={col} opacity={isUp ? 0.9 : 0.85}/>
            {/* hover hit area */}
            <rect x={x - Math.max(candleW, 6)/2} y={hY} width={Math.max(candleW, 6)} height={lY - hY} fill="transparent"/>
          </g>
        );
      })}
      {/* Volume */}
      {candles.map((d,i) => {
        const x   = scaleX(i);
        const vy  = scaleVol(d.v || 0);
        const bH  = Math.max(1, H_VL - vy);
        const isUp = d.c >= d.o;
        return <rect key={i} x={x - candleW/2} y={H_PX+10+vy} width={candleW} height={bH} fill={isUp ? "#00ff88" : "#ff4d6d"} opacity="0.4"/>;
      })}
      <text x={VW-PAD.right+4} y={H_PX+16} fontSize="8" fill="#3a5a6a" fontFamily="monospace">VOL</text>
      {/* Axis lines */}
      <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={baseY} stroke="#1e3040" strokeWidth="1"/>
      <line x1={PAD.left} y1={baseY}   x2={VW-PAD.right} y2={baseY} stroke="#1e3040" strokeWidth="1"/>
      <line x1={PAD.left} y1={H_PX+10} x2={VW-PAD.right} y2={H_PX+10} stroke="#1e3040" strokeWidth="0.5"/>
    </svg>
  );
}

// ─── LINE / AREA CHART ────────────────────────────────────────────────────────
function LineAreaChart({ candles, range, onHover, filled }) {
  const L = useChartLayout(candles);
  if (!L) return <div style={{color:'#5a7a8a',fontSize:'0.8rem',padding:'2rem 0',textAlign:'center'}}>Not enough data for chart</div>;
  const { scaleX, scaleY, scaleVol, yTicks, xTicks, candleW } = L;
  const baseY = H_PX - PAD.bottom;
  const isUp  = (candles[candles.length-1]?.c ?? 0) >= (candles[0]?.c ?? 0);
  const col   = isUp ? "#00ff88" : "#ff4d6d";

  const pts = candles.map((d,i) => `${scaleX(i)},${scaleY(d.c)}`).join(" ");
  const fPts = `${scaleX(0)},${baseY} ${pts} ${scaleX(candles.length-1)},${baseY}`;

  return (
    <svg viewBox={`0 0 ${VW} ${H_PX + H_VL + 12}`} width="100%" style={{display:'block'}}>
      {yTicks.map((t,i) => <line key={i} x1={PAD.left} y1={t.y} x2={VW-PAD.right} y2={t.y} stroke="#1e3040" strokeWidth="0.5"/>)}
      {yTicks.map((t,i) => <text key={i} x={VW-PAD.right+4} y={t.y+4} fontSize="9" fill="#3a5a6a" fontFamily="monospace">${fmtPrice(t.p)}</text>)}
      {xTicks.map((t,i) => <text key={i} x={t.x} y={H_PX+H_VL+10} fontSize="9" fill="#3a5a6a" textAnchor="middle" fontFamily="monospace">{fmtTime(t.time, range)}</text>)}
      {filled && <polygon points={fPts} fill={col} fillOpacity="0.08"/>}
      <polyline points={pts} fill="none" stroke={col} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Invisible hover targets */}
      {candles.map((d,i) => (
        <circle key={i} cx={scaleX(i)} cy={scaleY(d.c)} r={Math.max(5, candleW)} fill="transparent"
          onMouseEnter={() => onHover(d)} onMouseLeave={() => onHover(null)} style={{cursor:'crosshair'}}/>
      ))}
      {/* Volume */}
      {candles.map((d,i) => {
        const x  = scaleX(i);
        const vy = scaleVol(d.v || 0);
        const bH = Math.max(1, H_VL - vy);
        const up = i === 0 ? true : (d.c >= (candles[i-1]?.c ?? d.c));
        return <rect key={i} x={x - candleW/2} y={H_PX+10+vy} width={candleW} height={bH} fill={up ? "#00ff88" : "#ff4d6d"} opacity="0.4"/>;
      })}
      <text x={VW-PAD.right+4} y={H_PX+16} fontSize="8" fill="#3a5a6a" fontFamily="monospace">VOL</text>
      <line x1={PAD.left} y1={PAD.top}    x2={PAD.left}       y2={baseY}      stroke="#1e3040" strokeWidth="1"/>
      <line x1={PAD.left} y1={baseY}      x2={VW-PAD.right}   y2={baseY}      stroke="#1e3040" strokeWidth="1"/>
      <line x1={PAD.left} y1={H_PX+10}   x2={VW-PAD.right}   y2={H_PX+10}   stroke="#1e3040" strokeWidth="0.5"/>
    </svg>
  );
}

// ─── STOCK PANEL ──────────────────────────────────────────────────────────────
function StockPanel({ data, onRefresh, refreshing, lastUpdated, range, setRange }) {
  const [chartType, setChartType] = useState("Candlestick");
  const [hovered, setHovered]     = useState(null);

  const up      = (data.change ?? 0) >= 0;
  const sign    = up ? "+" : "";
  const chgStr  = `${sign}${fmtPrice(data.change)} (${sign}${data.changePercent?.toFixed(2)}%)`;
  const state   = data.marketState || "CLOSED";
  const curr    = data.currency === "USD" ? "$" : (data.currency ?? "") + " ";
  const candles = data.candles || [];

  const stats = [
    { label: "Open",       value: curr + fmtPrice(data.open) },
    { label: "Prev Close", value: curr + fmtPrice(data.previousClose) },
    { label: "Day High",   value: curr + fmtPrice(data.dayHigh) },
    { label: "Day Low",    value: curr + fmtPrice(data.dayLow) },
    { label: "Volume",     value: fmtVolume(data.volume) },
    { label: "Market Cap", value: fmtCap(data.marketCap) },
    { label: "P/E Ratio",  value: data.pe   ? data.pe.toFixed(2)                      : "\u2014" },
    { label: "EPS",        value: data.eps  ? curr + data.eps.toFixed(2)              : "\u2014" },
    { label: "52W High",   value: curr + fmtPrice(data.week52High) },
    { label: "52W Low",    value: curr + fmtPrice(data.week52Low) },
    { label: "Avg Volume", value: fmtVolume(data.avgVolume) },
    { label: "Beta",       value: data.beta          ? data.beta.toFixed(2)           : "\u2014" },
    { label: "Div Yield",  value: data.dividendYield ? (data.dividendYield * 100).toFixed(2) + "%" : "\u2014" },
  ];

  const hovStr = hovered
    ? `O:${curr}${fmtPrice(hovered.o)}  H:${curr}${fmtPrice(hovered.h)}  L:${curr}${fmtPrice(hovered.l)}  C:${curr}${fmtPrice(hovered.c)}  Vol:${fmtVolume(hovered.v)}  ${fmtTime(hovered.time, range)}`
    : "\u00a0";

  return (
    <div>
      <div className="refresh-row">
        <span className="refresh-info">{lastUpdated ? `Updated ${lastUpdated}` : ""} · Auto-refresh every 30s</span>
        <button className="btn-sm" onClick={onRefresh} disabled={refreshing}>{refreshing ? "\u27f3" : "\u21bb Refresh"}</button>
      </div>

      <div className="stock-header">
        <div>
          <div className="stock-name">{data.shortName}</div>
          <div className="stock-symbol">{data.symbol}</div>
          <div className="stock-price">{curr}{fmtPrice(data.price)}</div>
          <div className={`stock-change ${up ? "up" : "down"}`}>{chgStr}</div>
          <div className={`market-badge ${state}`}>{STATE_LABEL[state] ?? state}</div>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((s) => (
          <div className="stat" key={s.label}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
            {STAT_INFO[s.label] && <div className="tooltip">{STAT_INFO[s.label]}</div>}
          </div>
        ))}
      </div>

      {candles.length > 1 && (
        <>
          <div className="chart-controls">
            <div className="btn-group">
              {CHART_TYPES.map((t) => (
                <button key={t} className={`btn-sm${chartType === t ? " active" : ""}`} onClick={() => setChartType(t)}>{t}</button>
              ))}
            </div>
            <div className="btn-group">
              {RANGES.map((r) => (
                <button key={r} className={`btn-sm${range === r ? " active" : ""}`} onClick={() => setRange(r)}>{r.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <div className="crosshair-info">{hovStr}</div>
          <div className="chart-wrap">
            {chartType === "Candlestick" && <CandlestickChart candles={candles} range={range} onHover={setHovered}/>}
            {chartType === "Line"        && <LineAreaChart    candles={candles} range={range} onHover={setHovered} filled={false}/>}
            {chartType === "Area"        && <LineAreaChart    candles={candles} range={range} onHover={setHovered} filled={true}/>}
          </div>
        </>
      )}
    </div>
  );
}

// ─── GLOSSARY SECTION ─────────────────────────────────────────────────────────
function GlossarySection() {
  const [open, setOpen] = useState(false);
  return (
    <div className="card">
      <button className="section-toggle" onClick={() => setOpen(!open)}>
        <span>{open ? "\u25bc" : "\u25b6"}</span>
        <span>\ud83d\udcd6 Stock Trading Glossary \u2014 What every number & term means</span>
      </button>
      {open && (
        <div className="glossary-grid">
          {GLOSSARY.map((g) => (
            <div className="gloss-item" key={g.term}>
              <div className="gloss-term">{g.term}</div>
              <div className="gloss-def">{g.def}</div>
              {g.example && <div className="gloss-example">Example: {g.example}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── API HELPERS ──────────────────────────────────────────────────────────────
async function fetchStock(ticker, range) {
  const res  = await fetch(`/api/stock?ticker=${encodeURIComponent(ticker)}&range=${range}`);
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
    const t = await res.text();
    throw new Error(`API error ${res.status}: ${t}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response received.";
}

function buildPrompt(ticker, type, stock) {
  const t = ticker.toUpperCase();
  const ctx = stock
    ? `Live data — Price: $${fmtPrice(stock.price)}, Change: ${(stock.change??0)>=0?"+":""}${fmtPrice(stock.change)} (${stock.changePercent?.toFixed(2)}%), Day range: $${fmtPrice(stock.dayLow)}\u2013$${fmtPrice(stock.dayHigh)}, Volume: ${fmtVolume(stock.volume)}, Market Cap: ${fmtCap(stock.marketCap)}, P/E: ${stock.pe?stock.pe.toFixed(1):"N/A"}, Beta: ${stock.beta?stock.beta.toFixed(2):"N/A"}. `
    : "";
  const map = {
    predict:   `${ctx}You are a stock market analyst. Provide a short-term price prediction for ${t}. Cover key support/resistance levels, recent trend, and a 1-week outlook. Be concise and analytical.`,
    analysis:  `${ctx}You are a technical analyst. Analyze ${t}. Cover trend, momentum, volume patterns, and key indicators (RSI, MACD, moving averages). Be concise.`,
    sentiment: `${ctx}You are a financial analyst. Analyze market sentiment and recent news for ${t}. Discuss bullish/bearish signals from news and institutional activity.`,
    risk:      `${ctx}You are a risk analyst. Assess investment risk for ${t}. Cover volatility, beta, sector risks, company-specific risks, and an overall risk rating (Low/Medium/High).`,
    summary:   `${ctx}You are a financial analyst. Give a brief company summary for ${t}: business model, competitive position, recent financials, growth drivers, and a buy/hold/sell recommendation.`,
  };
  return map[type] || map.predict;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [ticker, setTicker]             = useState("");
  const [analysisType, setType]         = useState("predict");
  const [stockData, setStockData]       = useState(null);
  const [stockErr, setStockErr]         = useState("");
  const [stockLoading, setStockLoading] = useState(false);
  const [response, setResponse]         = useState("");
  const [aiLoading, setAiLoading]       = useState(false);
  const [aiError, setAiError]           = useState("");
  const [activeTicker, setActive]       = useState("");
  const [lastUpdated, setLastUpdated]   = useState("");
  const [activeLabel, setActiveLabel]   = useState("");
  const [range, setRange]               = useState("1d");
  const intervalRef                     = useRef(null);

  useEffect(() => {
    const s = document.createElement("style");
    s.innerHTML = APP_CSS;
    document.head.appendChild(s);
    return () => document.head.removeChild(s);
  }, []);

  async function loadStock(sym, r, quiet = false) {
    if (!quiet) setStockLoading(true);
    try {
      const data = await fetchStock(sym, r);
      setStockData(data);
      setStockErr("");
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      setStockErr(e.message);
    } finally {
      setStockLoading(false);
    }
  }

  // Reload when range changes
  useEffect(() => {
    if (!activeTicker) return;
    loadStock(activeTicker, range);
  }, [range]); // eslint-disable-line

  // Auto-refresh every 30s
  useEffect(() => {
    if (!activeTicker) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => loadStock(activeTicker, range, true), 30000);
    return () => clearInterval(intervalRef.current);
  }, [activeTicker, range]); // eslint-disable-line

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
      stock = await fetchStock(sym, range);
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
  const showAi    = response  || aiError     || aiLoading;

  return (
    <div className="app">
      <h1>\ud83d\udcc8 Stock AI Dashboard</h1>
      <p className="subtitle">Real-time prices \u00b7 Candlestick charts \u00b7 AI-powered analysis \u00b7 Auto-refresh every 30s</p>

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
              <select value={analysisType} onChange={(e) => setType(e.target.value)} disabled={aiLoading}>
                {ANALYSIS_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
          <button className="btn-primary" type="submit" disabled={aiLoading || !ticker.trim()}>
            {aiLoading ? "Analyzing\u2026" : "Analyze"}
          </button>
        </form>
      </div>

      {showStock && (
        <div className="card">
          {stockLoading && !stockData && <div className="response loading">\u27f3 Fetching live market data\u2026</div>}
          {stockErr && !stockData      && <div className="response error">\u26a0 {stockErr}</div>}
          {stockData && (
            <StockPanel
              data={stockData}
              onRefresh={() => loadStock(activeTicker, range)}
              refreshing={stockLoading}
              lastUpdated={lastUpdated}
              range={range}
              setRange={setRange}
            />
          )}
        </div>
      )}

      {showAi && (
        <div className="card">
          {activeTicker && (
            <div style={{marginBottom:'0.6rem'}}>
              <span className="ticker-badge">{activeTicker}</span>
              <span className="tag">{activeLabel}</span>
            </div>
          )}
          {aiLoading && <div className="response loading">\u27f3 Generating AI analysis\u2026</div>}
          {aiError   && <div className="response error">\u26a0 {aiError}</div>}
          {response  && <div className="response">{response}</div>}
        </div>
      )}

      <GlossarySection />
    </div>
  );
}
