import { useState, useEffect, useRef, useCallback } from "react";

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

  .chart-outer { position: relative; }
  .chart-outer.zoomed { cursor: grab; }
  .chart-outer.zoomed.dragging { cursor: grabbing; }
  .zoom-hint { font-size: 0.7rem; color: #3a5a6a; text-align: right; margin-top: 0.3rem; }
  .zoom-bar { display: flex; align-items: center; gap: 0.5rem; }
  .zoom-level { font-size: 0.72rem; color: #5a7a8a; font-family: monospace; min-width: 3.5em; }
  .btn-zoom { background: none; border: 1px solid #1e3040; color: #5a7a8a; width: 26px; height: 26px; border-radius: 4px; font-family: monospace; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: color 0.2s, border-color 0.2s; padding: 0; }
  .btn-zoom:hover { color: #00d9ff; border-color: #00d9ff; }
  .btn-zoom:disabled { opacity: 0.3; cursor: not-allowed; }
  .crosshair-info { font-size: 0.78rem; color: #00d9ff; text-align: left; min-height: 1.4em; margin-bottom: 0.4rem; font-family: monospace; background: #0a1520; padding: 0.35rem 0.6rem; border-radius: 4px; border: 1px solid #1e3040; white-space: nowrap; overflow-x: auto; }
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
  "Day High":   "Highest price reached today. Acts as a short-term resistance level \u2014 price may pull back here.",
  "Day Low":    "Lowest price today. Acts as a short-term support level \u2014 price may bounce here.",
  "Volume":     "Shares bought & sold today. High volume = strong conviction behind the move. Low volume = weak move.",
  "Market Cap": "Total company value = Price \u00d7 Shares Outstanding. Large Cap >$10B, Mid Cap $2\u201310B, Small Cap <$2B.",
  "P/E Ratio":  "Price-to-Earnings \u2014 how much you pay per $1 of profit. S&P 500 avg \u2248 20\u201325. High P/E = growth expectations.",
  "EPS":        "Earnings Per Share \u2014 company profit \u00f7 total shares. Higher EPS = more profitable per share.",
  "52W High":   "Highest price in the last 52 weeks. Breaking above it is a strong bullish signal.",
  "52W Low":    "Lowest price in the last 52 weeks. Bouncing off it can be bullish; breaking below is bearish.",
  "Avg Volume": "Average daily shares traded over 3 months. If today's volume is 2\u00d7 avg, something big is happening.",
  "Beta":       "Volatility vs S&P 500. Beta 1.5 = moves 50% more than market. Beta 0.5 = half as volatile. Beta 1 = tracks market.",
  "Div Yield":  "Annual dividend as % of price. Free income just for holding the stock. 2\u20134% is typical for dividend stocks.",
};

// ─── LEARN DATA ─────────────────────────────────────────────────────────────
const LEARN_BASICS = [
  { id: "what-stock", q: "What is a stock?", a: "A stock is a tiny piece of ownership in a company. If a company is a pizza, a stock is one slice. When you buy Apple stock, you literally own a small piece of Apple Inc. If the company does well, your slice becomes more valuable!" },
  { id: "what-price", q: "What does the stock price mean?", a: "The stock price is what people are willing to pay RIGHT NOW for one share. It changes every second during market hours because buyers and sellers are constantly agreeing on new prices. Think of it like an auction that never stops." },
  { id: "bull-bear", q: "What are Bull and Bear markets?", a: "\ud83d\udc02 Bull Market = prices going UP (bulls charge upward with their horns)\n\ud83d\udc3b Bear Market = prices going DOWN (bears swipe downward with their paws)\n\nA bull market means people are optimistic and buying. A bear market means people are worried and selling." },
  { id: "what-volume", q: "What is Volume?", a: "Volume is how many shares were traded (bought + sold) in a time period. High volume = lots of people trading = strong interest. Low volume = few people trading = less confidence in the price move.\n\nThink of it like foot traffic in a store \u2014 busy store means the sale is popular!" },
  { id: "market-hours", q: "When is the market open?", a: "US Stock Market (NYSE/NASDAQ):\n\u2022 Regular hours: 9:30 AM \u2013 4:00 PM Eastern\n\u2022 Pre-market: 4:00 AM \u2013 9:30 AM Eastern\n\u2022 After-hours: 4:00 PM \u2013 8:00 PM Eastern\n\nMarkets are closed on weekends and major holidays." },
  { id: "what-ticker", q: "What is a ticker symbol?", a: "A ticker symbol is a short code for a company on the stock exchange. Examples:\n\u2022 AAPL = Apple\n\u2022 TSLA = Tesla\n\u2022 GOOGL = Google (Alphabet)\n\u2022 AMZN = Amazon\n\nIt\u2019s like a username for stocks!" },
  { id: "buy-sell", q: "How do you actually buy a stock?", a: "1. Open a brokerage account (like Robinhood, Fidelity, Schwab)\n2. Deposit money\n3. Search for the stock\u2019s ticker symbol\n4. Choose how many shares (or dollar amount)\n5. Click Buy!\n\nYou can buy as little as 1 share, or even fractional shares (half a share of Amazon for example)." },
];

const LEARN_CANDLES = [
  { id: "ohlcv", q: "What is O, H, L, C, Vol?", a: "These are the 5 key numbers for any time period:\n\n\ud83d\udcc2 O (Open) \u2014 Price when the period STARTED\n\u2b06\ufe0f H (High) \u2014 HIGHEST price reached\n\u2b07\ufe0f L (Low) \u2014 LOWEST price reached\n\ud83d\udcc1 C (Close) \u2014 Price when the period ENDED\n\ud83d\udcca Vol (Volume) \u2014 How many shares traded\n\nExample: O:$185.20 H:$186.10 L:$184.80 C:$185.90\nStarted at $185.20, peaked at $186.10, dipped to $184.80, ended at $185.90." },
  { id: "green-red", q: "Green vs Red candles?", a: "\ud83d\udfe2 GREEN candle: Close > Open (price went UP)\nThe stock ended HIGHER than it started \u2014 buyers won!\n\n\ud83d\udd34 RED candle: Close < Open (price went DOWN)\nThe stock ended LOWER than it started \u2014 sellers won!\n\nThe BODY (thick part) shows the range between Open and Close.\nThe WICKS (thin lines) show the High and Low extremes." },
  { id: "wick-body", q: "What are wicks and bodies?", a: "The candle anatomy:\n\n  |   \u2190 Upper wick (reached the High)\n \u250c\u2534\u2510\n \u2502 \u2502  \u2190 Body (Open to Close range)\n \u2514\u252c\u2518\n  |   \u2190 Lower wick (reached the Low)\n\n\u2022 LONG body = strong move in one direction\n\u2022 SHORT body = indecision\n\u2022 LONG upper wick = went high but got pushed back down\n\u2022 LONG lower wick = went low but bounced back up" },
  { id: "timeframes", q: "What do time ranges mean? (1D, 5D, 1M...)", a: "Each button zooms out further in time:\n\n1D (1 Day) \u2014 Each candle = a few minutes of today\n5D (5 Days) \u2014 Each candle = ~15 min over the week\n1M (1 Month) \u2014 Each candle = 1 day\n3M (3 Months) \u2014 Each candle = 1 day\n6M (6 Months) \u2014 Each candle = 1 day\n1Y (1 Year) \u2014 Each candle = 1 week\n\nZoom out for the big picture, zoom in for detail!" },
];

const LEARN_NUMBERS = [
  { id: "market-cap", q: "Market Cap (e.g., $3.2T)", a: "Market Cap = Stock Price \u00d7 Total Shares\n\nIt tells you how much the ENTIRE company is worth.\n\n\u2022 Mega Cap: >$200B (Apple, Microsoft, Nvidia)\n\u2022 Large Cap: $10B\u2013$200B\n\u2022 Mid Cap: $2B\u2013$10B\n\u2022 Small Cap: <$2B\n\nT = Trillion ($1,000,000,000,000)\nB = Billion ($1,000,000,000)\nM = Million ($1,000,000)" },
  { id: "pe-ratio", q: "P/E Ratio (e.g., 28.5)", a: "P/E = Price \u00f7 Earnings Per Share\n\nIt tells you how much investors pay for each $1 of profit.\n\n\u2022 P/E of 28.5 means investors pay $28.50 for every $1 earned\n\u2022 HIGH P/E (>30) = expensive, maybe fast-growing\n\u2022 LOW P/E (<15) = cheaper, might be a bargain or troubled\n\nThink of it as: \u201cHow many years of profit to pay back the stock price?\u201d" },
  { id: "percent-change", q: "Percent Change (e.g., +2.5%)", a: "Shows how much the stock moved vs yesterday\u2019s close.\n\n+2.5% = stock is UP 2.5% from yesterday\n-1.3% = stock is DOWN 1.3%\n\nOn a $100 stock:\n\u2022 +2.5% = up $2.50 (now $102.50)\n\u2022 -1.3% = down $1.30 (now $98.70)\n\n\ud83d\udfe2 Green percentage = up\n\ud83d\udd34 Red percentage = down" },
  { id: "52wk", q: "52-Week High/Low", a: "The HIGHEST and LOWEST price in the past year.\n\n\u2022 Near 52-week HIGH = doing well (or overpriced?)\n\u2022 Near 52-week LOW = struggling (or buying opportunity?)\n\nHelps you see where today\u2019s price fits in the year\u2019s range." },
  { id: "div-yield", q: "Dividend Yield (e.g., 1.5%)", a: "Some companies share profits as cash payments called DIVIDENDS.\n\nDividend Yield = Annual Dividend \u00f7 Stock Price\n\n\u2022 1.5% yield on $200 stock = $3.00/year per share\n\u2022 Usually paid quarterly ($0.75 every 3 months)\n\nNot all stocks pay dividends. Growth companies like Tesla reinvest instead." },
  { id: "eps", q: "EPS \u2014 Earnings Per Share", a: "EPS = Total Profit \u00f7 Number of Shares\n\nTells you how much profit per share.\n\u2022 EPS of $6.50 = company earned $6.50 per share\n\u2022 Higher = more profitable\n\u2022 Compare across quarters to see growth\n\nThis is the \u201cE\u201d in P/E ratio!" },
  { id: "beta", q: "Beta (e.g., 1.2)", a: "Measures how much a stock moves vs the overall market.\n\n\u2022 Beta 1.0 = moves exactly like the market\n\u2022 Beta 1.5 = moves 50% MORE (riskier, more reward)\n\u2022 Beta 0.5 = moves 50% LESS (calmer, safer)\n\nHigh beta = rollercoaster \ud83c\udfa2\nLow beta = gentle ride \ud83d\ude82" },
  { id: "avg-vol", q: "Average Volume", a: "The typical number of shares traded per day, averaged over time.\n\nCompare today\u2019s volume to the average:\n\u2022 Today ABOVE average = unusual interest, big news?\n\u2022 Today BELOW average = quiet day, less conviction\n\nBig price moves on high volume are more \u201creal\u201d than on low volume." },
];

const LEARN_PATTERNS = [
  { id: "doji", q: "Doji \u2014 The Indecision Candle", a: "A Doji has almost NO body (Open \u2248 Close) with wicks both sides.\n\n  |\n  +  \u2190 tiny/no body\n  |\n\nBuyers and sellers fought to a draw.\n\n\u26a0\ufe0f After a big move, a Doji can signal a REVERSAL \u2014 the trend might change." },
  { id: "hammer", q: "Hammer \u2014 Bounce Signal", a: "Small body at TOP, LONG lower wick.\n\n \u250c\u2510\n \u2514\u252c\u2518\n  |   \u2190 long lower wick\n  |\n\nPrice dropped a lot but buyers pushed it back up.\n\n\u2705 After a downtrend, a Hammer suggests price might go UP (bullish reversal)." },
  { id: "engulfing", q: "Engulfing \u2014 Strong Reversal", a: "When a candle\u2019s body completely COVERS the previous candle.\n\n\ud83d\udfe2 Bullish Engulfing (after downtrend):\nSmall red \u2192 BIG green = buyers taking over!\n\n\ud83d\udd34 Bearish Engulfing (after uptrend):\nSmall green \u2192 BIG red = sellers taking over!\n\nBigger engulfing candle = stronger signal." },
  { id: "support-resistance", q: "Support & Resistance", a: "SUPPORT = price floor where stock stops falling and bounces up. Like a trampoline.\n\nRESISTANCE = price ceiling where stock stops rising and bounces down. Like a ceiling.\n\n\u2022 Support BREAKS \u2192 price usually drops more\n\u2022 Resistance BREAKS \u2192 price usually rises more (\u201cbreakout\u201d)\n\nLook for levels the price bounced off multiple times!" },
  { id: "trend", q: "Uptrend vs Downtrend", a: "UPTREND: Series of higher highs and higher lows.\nLike stairs going up \u2014 each step higher than the last.\n\nDOWNTREND: Series of lower highs and lower lows.\nLike stairs going down.\n\nSIDEWAYS: Price bouncing between support and resistance.\nNo clear direction \u2014 waiting for a breakout." },
];

const LEARN_GLOSSARY = [
  { term: "Ask", def: "The lowest price a seller will accept. When you buy, you usually pay the ask." },
  { term: "Bid", def: "The highest price a buyer will pay. When you sell, you usually get the bid." },
  { term: "Spread", def: "Gap between Bid and Ask. Tight spread = easy to trade. Wide spread = less liquid." },
  { term: "Limit Order", def: "Buy/sell at a SPECIFIC price or better. You set the price, but it might not fill." },
  { term: "Market Order", def: "Buy/sell immediately at the current price. Fast but you might not get the exact price shown." },
  { term: "Stop Loss", def: "Auto-sell if price drops to a level. Protects you from big losses. Like a safety net." },
  { term: "Portfolio", def: "All your stocks and investments combined. Your collection." },
  { term: "Diversification", def: "Own different types of investments. Don\u2019t put all eggs in one basket!" },
  { term: "ETF", def: "Exchange-Traded Fund \u2014 a bundle of stocks in one package. SPY = all S&P 500 companies." },
  { term: "IPO", def: "Initial Public Offering \u2014 when a company first sells stock to the public." },
  { term: "Short Selling", def: "Betting a stock goes DOWN. Borrow shares, sell high, buy back lower. Very risky!" },
  { term: "Margin", def: "Borrowing money to buy more stock. Amplifies gains AND losses. Risky for beginners." },
  { term: "Volatility", def: "How wildly a stock\u2019s price swings. High volatility = big moves = more risk + opportunity." },
  { term: "Liquidity", def: "How easily you can buy/sell without moving the price. Big stocks = very liquid." },
  { term: "Correction", def: "Market drops 10%+ from peak. Normal, happens regularly. Not as bad as a crash." },
  { term: "Rally", def: "A period when prices rise significantly. Opposite of a selloff." },
  { term: "Blue Chip", def: "Large, stable, well-known companies. Apple, Microsoft. Usually safer." },
  { term: "Penny Stock", def: "Stocks under $5. Often tiny companies. Extremely risky \u2014 many go to zero." },
  { term: "After Hours", def: "Trading after market close (4\u20138 PM ET). Prices can move differently." },
  { term: "Breakout", def: "When price pushes through resistance or support. Often leads to a big move." },
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
  if (range === "1d") {
    return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  }
  if (range === "5d") {
    return d.toLocaleDateString("en-US", { weekday: "short", hour: "numeric", minute: "2-digit", hour12: true });
  }
  if (range === "1mo" || range === "3mo") {
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "2-digit" });
}

function fmtDate(isoStr) {
  if (!isoStr) return "";
  const d = new Date(isoStr);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit", hour12: true });
}

// ─── CHART CONSTANTS ──────────────────────────────────────────────────────────
const VW   = 800;
const H_PX = 300;
const H_VL = 70;
const PAD  = { top: 12, right: 68, bottom: 44, left: 8 };

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
  const stride = Math.max(1, Math.floor(candles.length / 8));
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
    <svg viewBox={`0 0 ${VW} ${H_PX + H_VL + 30}`} width="100%" style={{display:'block'}}>
      {yTicks.map((t,i) => <line key={i} x1={PAD.left} y1={t.y} x2={VW-PAD.right} y2={t.y} stroke="#1e3040" strokeWidth="0.5"/>)}
      {yTicks.map((t,i) => <text key={i} x={VW-PAD.right+4} y={t.y+4} fontSize="10" fill="#7a9aaa" fontFamily="monospace" fontWeight="500">${fmtPrice(t.p)}</text>)}
      {xTicks.map((t,i) => <text key={i} x={t.x} y={H_PX+H_VL+22} fontSize="10.5" fill="#7a9aaa" textAnchor="middle" fontFamily="monospace" fontWeight="500">{fmtTime(t.time, range)}</text>)}
      {xTicks.map((t,i) => <line key={"xt"+i} x1={t.x} y1={H_PX - PAD.bottom} x2={t.x} y2={H_PX - PAD.bottom + 4} stroke="#3a5a6a" strokeWidth="0.5"/>)}
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
            <rect x={x - Math.max(candleW, 6)/2} y={hY} width={Math.max(candleW, 6)} height={lY - hY} fill="transparent"/>
          </g>
        );
      })}
      {candles.map((d,i) => {
        const x   = scaleX(i);
        const vy  = scaleVol(d.v || 0);
        const bH  = Math.max(1, H_VL - vy);
        const isUp = d.c >= d.o;
        return <rect key={i} x={x - candleW/2} y={H_PX+10+vy} width={candleW} height={bH} fill={isUp ? "#00ff88" : "#ff4d6d"} opacity="0.4"/>;
      })}
      <text x={VW-PAD.right+4} y={H_PX+16} fontSize="8" fill="#3a5a6a" fontFamily="monospace">VOL</text>
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
    <svg viewBox={`0 0 ${VW} ${H_PX + H_VL + 30}`} width="100%" style={{display:'block'}}>
      {yTicks.map((t,i) => <line key={i} x1={PAD.left} y1={t.y} x2={VW-PAD.right} y2={t.y} stroke="#1e3040" strokeWidth="0.5"/>)}
      {yTicks.map((t,i) => <text key={i} x={VW-PAD.right+4} y={t.y+4} fontSize="10" fill="#7a9aaa" fontFamily="monospace" fontWeight="500">${fmtPrice(t.p)}</text>)}
      {xTicks.map((t,i) => <text key={i} x={t.x} y={H_PX+H_VL+22} fontSize="10.5" fill="#7a9aaa" textAnchor="middle" fontFamily="monospace" fontWeight="500">{fmtTime(t.time, range)}</text>)}
      {xTicks.map((t,i) => <line key={"xt"+i} x1={t.x} y1={H_PX - PAD.bottom} x2={t.x} y2={H_PX - PAD.bottom + 4} stroke="#3a5a6a" strokeWidth="0.5"/>)}
      {filled && <polygon points={fPts} fill={col} fillOpacity="0.08"/>}
      <polyline points={pts} fill="none" stroke={col} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/>
      {candles.map((d,i) => (
        <circle key={i} cx={scaleX(i)} cy={scaleY(d.c)} r={Math.max(5, candleW)} fill="transparent"
          onMouseEnter={() => onHover(d)} onMouseLeave={() => onHover(null)} style={{cursor:'crosshair'}}/>
      ))}
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

  // ── Zoom state ──
  const allCandles = data.candles || [];
  const [viewStart, setViewStart] = useState(0);
  const [viewEnd, setViewEnd]     = useState(allCandles.length);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startViewStart: 0, startViewEnd: 0 });
  const chartContainerRef = useRef(null);
  const MIN_VISIBLE = 8; // minimum candles visible when fully zoomed in

  // Reset zoom when data or range changes
  useEffect(() => {
    setViewStart(0);
    setViewEnd(allCandles.length);
  }, [allCandles.length, range]);

  const isZoomed = viewStart !== 0 || viewEnd !== allCandles.length;
  const visibleCount = viewEnd - viewStart;
  const zoomPercent = allCandles.length > 0 ? Math.round((allCandles.length / visibleCount) * 100) : 100;

  // Zoom with scroll wheel
  const handleWheel = useCallback((e) => {
    e.preventDefault();
    const total = allCandles.length;
    if (total < MIN_VISIBLE) return;

    const rect = chartContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mouseRatio = (e.clientX - rect.left) / rect.width; // 0..1, where mouse is horizontally

    const currentStart = viewStart;
    const currentEnd = viewEnd;
    const currentLen = currentEnd - currentStart;

    // Zoom factor: scroll up = zoom in, scroll down = zoom out
    const zoomStep = Math.max(1, Math.round(currentLen * 0.1));
    let newLen = currentLen;
    if (e.deltaY < 0) {
      // Zoom in
      newLen = Math.max(MIN_VISIBLE, currentLen - zoomStep);
    } else {
      // Zoom out
      newLen = Math.min(total, currentLen + zoomStep);
    }

    if (newLen === currentLen) return;

    // Distribute the change around the mouse position
    const shrink = currentLen - newLen;
    let newStart = currentStart + Math.round(shrink * mouseRatio);
    let newEnd = newStart + newLen;

    // Clamp
    if (newStart < 0) { newStart = 0; newEnd = newLen; }
    if (newEnd > total) { newEnd = total; newStart = total - newLen; }
    if (newStart < 0) newStart = 0;

    setViewStart(newStart);
    setViewEnd(newEnd);
  }, [allCandles.length, viewStart, viewEnd]);

  // Drag to pan
  const handleMouseDown = useCallback((e) => {
    if (!isZoomed) return;
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = { startX: e.clientX, startViewStart: viewStart, startViewEnd: viewEnd };
  }, [isZoomed, viewStart, viewEnd]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    const rect = chartContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - dragRef.current.startX;
    const candlesPerPixel = (dragRef.current.startViewEnd - dragRef.current.startViewStart) / rect.width;
    const shift = Math.round(-dx * candlesPerPixel);

    const len = dragRef.current.startViewEnd - dragRef.current.startViewStart;
    let newStart = dragRef.current.startViewStart + shift;
    let newEnd = newStart + len;

    if (newStart < 0) { newStart = 0; newEnd = len; }
    if (newEnd > allCandles.length) { newEnd = allCandles.length; newStart = allCandles.length - len; }
    if (newStart < 0) newStart = 0;

    setViewStart(newStart);
    setViewEnd(newEnd);
  }, [isDragging, allCandles.length]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Zoom button handlers
  const zoomIn = () => {
    const len = viewEnd - viewStart;
    const newLen = Math.max(MIN_VISIBLE, Math.round(len * 0.7));
    const center = Math.round((viewStart + viewEnd) / 2);
    let ns = center - Math.round(newLen / 2);
    let ne = ns + newLen;
    if (ns < 0) { ns = 0; ne = newLen; }
    if (ne > allCandles.length) { ne = allCandles.length; ns = allCandles.length - newLen; }
    if (ns < 0) ns = 0;
    setViewStart(ns);
    setViewEnd(ne);
  };

  const zoomOut = () => {
    const len = viewEnd - viewStart;
    const newLen = Math.min(allCandles.length, Math.round(len * 1.4));
    const center = Math.round((viewStart + viewEnd) / 2);
    let ns = center - Math.round(newLen / 2);
    let ne = ns + newLen;
    if (ns < 0) { ns = 0; ne = Math.min(newLen, allCandles.length); }
    if (ne > allCandles.length) { ne = allCandles.length; ns = Math.max(0, allCandles.length - newLen); }
    setViewStart(ns);
    setViewEnd(ne);
  };

  const resetZoom = () => {
    setViewStart(0);
    setViewEnd(allCandles.length);
  };

  const candles = allCandles.slice(viewStart, viewEnd);

  const up      = (data.change ?? 0) >= 0;
  const sign    = up ? "+" : "";
  const chgStr  = `${sign}${fmtPrice(data.change)} (${sign}${data.changePercent?.toFixed(2)}%)`;
  const state   = data.marketState || "CLOSED";
  const curr    = data.currency === "USD" ? "$" : (data.currency ?? "") + " ";

  const stats = [
    { label: "Open",       value: curr + fmtPrice(data.open) },
    { label: "Prev Close", value: curr + fmtPrice(data.previousClose) },
    { label: "Day High",   value: curr + fmtPrice(data.dayHigh) },
    { label: "Day Low",    value: curr + fmtPrice(data.dayLow) },
    { label: "Volume",     value: fmtVolume(data.volume) },
    { label: "Market Cap", value: fmtCap(data.marketCap) },
    { label: "P/E Ratio",  value: data.pe   ? data.pe.toFixed(2)         : "\u2014" },
    { label: "EPS",        value: data.eps  ? curr + data.eps.toFixed(2) : "\u2014" },
    { label: "52W High",   value: curr + fmtPrice(data.week52High) },
    { label: "52W Low",    value: curr + fmtPrice(data.week52Low) },
    { label: "Avg Volume", value: fmtVolume(data.avgVolume) },
    { label: "Beta",       value: data.beta          ? data.beta.toFixed(2)           : "\u2014" },
    { label: "Div Yield",  value: data.dividendYield ? (data.dividendYield * 100).toFixed(2) + "%" : "\u2014" },
  ];

  const hovStr = hovered
    ? `${fmtDate(hovered.time)}  ·  O:${curr}${fmtPrice(hovered.o)}  H:${curr}${fmtPrice(hovered.h)}  L:${curr}${fmtPrice(hovered.l)}  C:${curr}${fmtPrice(hovered.c)}  Vol:${fmtVolume(hovered.v)}`
    : "";

  return (
    <div>
      <div className="refresh-row">
        <span className="refresh-info">{lastUpdated ? `Updated ${lastUpdated}` : ""} {"\u00b7"} Auto-refresh every 30s</span>
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
            <div className="zoom-bar">
              <button className="btn-zoom" onClick={zoomIn} disabled={visibleCount <= MIN_VISIBLE} title="Zoom In">+</button>
              <button className="btn-zoom" onClick={zoomOut} disabled={!isZoomed} title="Zoom Out">{"−"}</button>
              {isZoomed && <button className="btn-sm" onClick={resetZoom}>{"↺ Reset"}</button>}
              {isZoomed && <span className="zoom-level">{zoomPercent}%</span>}
            </div>
            <div className="btn-group">
              {RANGES.map((r) => (
                <button key={r} className={`btn-sm${range === r ? " active" : ""}`} onClick={() => setRange(r)}>{r.toUpperCase()}</button>
              ))}
            </div>
          </div>
          <div className="crosshair-info">{hovStr}</div>
          <div
            className={`chart-outer${isZoomed ? " zoomed" : ""}${isDragging ? " dragging" : ""}`}
            ref={chartContainerRef}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
          >
            <div className="chart-wrap">
              {chartType === "Candlestick" && <CandlestickChart candles={candles} range={range} onHover={setHovered}/>}
              {chartType === "Line"        && <LineAreaChart    candles={candles} range={range} onHover={setHovered} filled={false}/>}
              {chartType === "Area"        && <LineAreaChart    candles={candles} range={range} onHover={setHovered} filled={true}/>}
            </div>
          </div>
          {!isZoomed && <div className="zoom-hint">{"Scroll to zoom · Drag to pan when zoomed"}</div>}
        </>
      )}
    </div>
  );
}

// ─── LEARN SECTION ────────────────────────────────────────────────────────────
function LearnSection() {
  const [tab, setTab] = useState("basics");
  const [expanded, setExpanded] = useState(null);
  const toggle = (id) => setExpanded(expanded === id ? null : id);

  const tabs = [
    { id: "basics", label: "\ud83d\udcd6 Basics" },
    { id: "candles", label: "\ud83d\udd6f\ufe0f Candles" },
    { id: "numbers", label: "\ud83d\udd22 Numbers" },
    { id: "patterns", label: "\ud83d\udcd0 Patterns" },
    { id: "glossary", label: "\ud83d\udcda Glossary" },
  ];

  const dataMap = { basics: LEARN_BASICS, candles: LEARN_CANDLES, numbers: LEARN_NUMBERS, patterns: LEARN_PATTERNS };

  const renderAccordion = (items) => items.map((item) => (
    <div key={item.id} className={`learn-accordion ${expanded === item.id ? "expanded" : ""}`}>
      <button className="learn-acc-btn" onClick={() => toggle(item.id)}>
        <span>{item.q}</span>
        <span className="learn-acc-arrow">\u25bc</span>
      </button>
      {expanded === item.id && <div className="learn-acc-body">{item.a}</div>}
    </div>
  ));

  const renderGlossary = () => LEARN_GLOSSARY.map((g, i) => (
    <div key={i} className="glossary-row">
      <span className="glossary-term">{g.term}</span>
      <span className="glossary-def">{g.def}</span>
    </div>
  ));

  return (
    <div className="card">
      <h2>{"\ud83c\udf93 Learn Stock Trading"}</h2>
      <p style={{ color: "#8899a6", fontSize: 13, marginBottom: 14 }}>
        Tap any topic to learn what the numbers, charts, and terms mean in plain English.
      </p>
      <div className="learn-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`learn-tab ${tab === t.id ? "active" : ""}`}
            onClick={() => { setTab(t.id); setExpanded(null); }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="learn-scroll">
        {tab === "glossary" ? renderGlossary() : renderAccordion(dataMap[tab])}
      </div>
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
    ? `Live data \u2014 Price: $${fmtPrice(stock.price)}, Change: ${(stock.change??0)>=0?"+":""}${fmtPrice(stock.change)} (${stock.changePercent?.toFixed(2)}%), Day range: $${fmtPrice(stock.dayLow)}\u2013$${fmtPrice(stock.dayHigh)}, Volume: ${fmtVolume(stock.volume)}, Market Cap: ${fmtCap(stock.marketCap)}, P/E: ${stock.pe?stock.pe.toFixed(1):"N/A"}, Beta: ${stock.beta?stock.beta.toFixed(2):"N/A"}. `
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

  useEffect(() => {
    if (!activeTicker) return;
    loadStock(activeTicker, range);
  }, [range]); // eslint-disable-line

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
      <h1>{"\ud83d\udcc8"} Stock AI Dashboard</h1>
      <p className="subtitle">{"Real-time prices \u00b7 Candlestick charts \u00b7 AI-powered analysis \u00b7 Auto-refresh every 30s"}</p>

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
          {stockLoading && !stockData && <div className="response loading">{"\u27f3 Fetching live market data\u2026"}</div>}
          {stockErr && !stockData      && <div className="response error">{"\u26a0"} {stockErr}</div>}
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
          {aiLoading && <div className="response loading">{"\u27f3 Generating AI analysis\u2026"}</div>}
          {aiError   && <div className="response error">{"\u26a0"} {aiError}</div>}
          {response  && <div className="response">{response}</div>}
        </div>
      )}

      <LearnSection />
    </div>
  );
}
