import { useState, useEffect, useCallback } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;600&family=Saira+Condensed:wght@400;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;scrollbar-width:thin;scrollbar-color:#1e3040 #080d14}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#080d14}::-webkit-scrollbar-thumb{background:#1e3040}
body{background:#080d14;font-family:'IBM Plex Mono',monospace}
.app{min-height:100vh;background:#080d14;color:#b8ccd8}
.hdr{display:flex;align-items:center;justify-content:space-between;padding:14px 20px;border-bottom:1px solid #142030;background:#060b11;position:sticky;top:0;z-index:50}
.brand{font-family:'Saira Condensed',sans-serif;font-weight:800;font-size:22px;letter-spacing:5px;color:#00d4ff;text-shadow:0 0 20px rgba(0,212,255,.4)}
.brand span{color:#3a5a70;font-weight:400}
.hdr-right{display:flex;align-items:center;gap:14px}
.live-badge{display:flex;align-items:center;gap:5px;font-size:10px;letter-spacing:2px;color:#00ff88}
.pulse{width:7px;height:7px;border-radius:50%;background:#00ff88;box-shadow:0 0 8px #00ff88;animation:blink 1.5s infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
.clk{font-size:10px;color:#3a5a70;letter-spacing:2px}
.tabs{display:flex;padding:0 20px;border-bottom:1px solid #142030;background:#060b11}
.tab{font-family:'Saira Condensed',sans-serif;font-weight:600;font-size:13px;letter-spacing:3px;padding:11px 22px;cursor:pointer;color:#3a5a70;border-bottom:2px solid transparent;transition:all .2s}
.tab:hover{color:#7aa8c0}.tab.active{color:#00d4ff;border-bottom-color:#00d4ff}
.main{padding:18px 20px;max-width:1400px;margin:0 auto}
.srow{display:flex;gap:8px;margin-bottom:14px}
.sinput{flex:1;background:#0d1825;border:1px solid #1e3040;color:#00d4ff;font-family:'IBM Plex Mono',monospace;font-size:12px;padding:9px 14px;outline:none;letter-spacing:2px;text-transform:uppercase}
.sinput:focus{border-color:#00d4ff}.sinput::placeholder{color:#1e3040}
.btn{background:transparent;border:1px solid #00d4ff;color:#00d4ff;font-family:'IBM Plex Mono',monospace;font-size:11px;padding:9px 16px;cursor:pointer;letter-spacing:2px;transition:all .2s;white-space:nowrap}
.btn:hover{background:#00d4ff;color:#080d14}.btn:disabled{opacity:.3;cursor:not-allowed}
.btn2{border-color:#1e3040;color:#3a5a70}.btn2:hover{border-color:#7aa8c0;color:#7aa8c0;background:transparent}
.chips{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:18px}
.chip{background:#0d1825;border:1px solid #1e3040;color:#3a5a70;font-family:'IBM Plex Mono',monospace;font-size:9px;padding:4px 10px;cursor:pointer;letter-spacing:1px;transition:all .2s}
.chip:hover{border-color:#00d4ff;color:#00d4ff}.chip.on{border-color:#00ff88;color:#00ff88}
.mbar{display:flex;overflow-x:auto;margin-bottom:18px;border:1px solid #142030}
.mi{flex:1;min-width:110px;padding:9px 14px;border-right:1px solid #142030;background:#0a1520}
.mi:last-child{border-right:none}
.mn{font-size:9px;letter-spacing:2px;color:#3a5a70;margin-bottom:3px}
.mv{font-size:13px;color:#b8ccd8}.mc{font-size:9px;margin-top:2px}
.up{color:#00ff88}.dn{color:#ff4455}.nt{color:#3a5a70}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:10px;margin-bottom:18px}
.card{background:#0a1520;border:1px solid #142030;cursor:pointer;transition:all .2s;animation:fu .3s ease;position:relative;overflow:hidden}
.card:hover{border-color:#2a5a70;transform:translateY(-1px)}.card.sel{border-color:#00d4ff;box-shadow:0 0 16px rgba(0,212,255,.08)}
@keyframes fu{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
.ctop{padding:12px 12px 0}
.chdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:7px}
.tlbl{font-family:'Saira Condensed',sans-serif;font-weight:700;font-size:20px;letter-spacing:2px;color:#00d4ff}
.cname{font-size:9px;color:#3a5a70;letter-spacing:1px;margin-top:1px}
.rmbtn{background:none;border:none;color:#1e3040;cursor:pointer;font-size:17px;transition:color .2s;line-height:1}
.rmbtn:hover{color:#ff4455}
.pbig{font-size:24px;letter-spacing:1px;color:#e0eef5;margin-bottom:4px}
.crow{display:flex;gap:8px;align-items:center;margin-bottom:8px}
.cv{font-size:11px;letter-spacing:1px}
.spark{height:56px}
.cmeta{display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid #142030}
.mc2{padding:7px 10px;border-right:1px solid #142030;font-size:9px;color:#3a5a70;letter-spacing:1px}
.mc2:last-child{border-right:none}.mv2{display:block;color:#7aa8c0;font-size:11px;margin-top:2px}
.lbar{position:absolute;bottom:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,#00d4ff,transparent);animation:sw 1.2s linear infinite}
@keyframes sw{from{transform:translateX(-100%)}to{transform:translateX(100%)}}
.detail{background:#0a1520;border:1px solid #142030;margin-bottom:18px;animation:fu .3s ease}
.dhdr{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid #142030;flex-wrap:wrap;gap:10px}
.dtitle{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.dticker{font-family:'Saira Condensed',sans-serif;font-weight:800;font-size:28px;letter-spacing:3px;color:#00d4ff}
.dprice{font-size:28px;color:#e0eef5;letter-spacing:1px}
.rtabs{display:flex}
.rtab{font-size:9px;padding:5px 12px;cursor:pointer;letter-spacing:1px;color:#3a5a70;border:1px solid #142030;margin-left:-1px;transition:all .2s}
.rtab:hover{color:#7aa8c0}.rtab.active{color:#00d4ff;border-color:#00d4ff;z-index:1;position:relative}
.cwrap{padding:14px 14px 6px}
.cload{display:flex;align-items:center;justify-content:center;height:180px;color:#3a5a70;font-size:10px;letter-spacing:2px}
.dstats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid #142030}
@media(max-width:600px){.dstats{grid-template-columns:repeat(2,1fr)}}
.sc{padding:10px 14px;border-right:1px solid #142030;border-bottom:1px solid #142030}
.sc:nth-child(4n){border-right:none}.sl{font-size:8px;color:#3a5a70;letter-spacing:2px;margin-bottom:3px}.sv{font-size:12px;color:#b8ccd8}
.ctt{background:#060b11;border:1px solid #1e3040;padding:7px 11px;font-size:9px;letter-spacing:1px}
.ttl{color:#3a5a70;margin-bottom:3px}.ttv{color:#00d4ff;font-size:12px}
.psum{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px}
@media(max-width:600px){.psum{grid-template-columns:repeat(2,1fr)}}
.pcard{background:#0a1520;border:1px solid #142030;padding:14px}
.plbl{font-size:8px;color:#3a5a70;letter-spacing:2px;margin-bottom:5px}.pval{font-size:18px;color:#e0eef5}
.pform{background:#0a1520;border:1px solid #142030;padding:18px;margin-bottom:18px}
.frow{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px}
.frow input{background:#060b11;border:1px solid #1e3040;color:#b8ccd8;font-family:'IBM Plex Mono',monospace;font-size:11px;padding:7px 12px;outline:none;flex:1;min-width:90px}
.frow input:focus{border-color:#00d4ff}.frow input::placeholder{color:#1e3040}
.ptbl{width:100%;border-collapse:collapse}
.ptbl th{font-size:8px;letter-spacing:2px;color:#3a5a70;padding:7px 10px;text-align:left;border-bottom:1px solid #142030}
.ptbl td{font-size:11px;padding:9px 10px;border-bottom:1px solid #0d1825}
.ptbl tr:hover td{background:#0d1825}
.pp{color:#00ff88}.pn{color:#ff4455}
.lgrid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}
@media(max-width:700px){.lgrid{grid-template-columns:1fr}}
.lcard{background:#0a1520;border:1px solid #142030;overflow:hidden;cursor:pointer;transition:all .2s}
.lcard:hover{border-color:#2a5a70}.lcard.open{border-color:#00d4ff}
.lchdr{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:#0d1825}
.lct{font-family:'Saira Condensed',sans-serif;font-size:15px;font-weight:700;letter-spacing:2px;color:#00d4ff}
.lcs{font-size:8px;color:#3a5a70;letter-spacing:1px;margin-top:2px}
.lbody{padding:16px;font-size:10px;line-height:1.85;color:#7aa8c0;letter-spacing:.5px;border-top:1px solid #142030;animation:fu .2s ease}
.lbody h4{font-family:'Saira Condensed',sans-serif;font-size:13px;color:#00d4ff;letter-spacing:2px;margin:12px 0 5px}
.lbody h4:first-child{margin-top:0}.lbody p{margin-bottom:9px}.lbody ul{padding-left:14px;margin-bottom:9px}.lbody li{margin-bottom:4px}
.lbody .pill{display:inline-block;background:#0d1825;border:1px solid #1e3040;padding:1px 8px;font-size:9px;color:#7aa8c0;margin:2px;letter-spacing:1px}
.tag{display:inline-block;padding:1px 7px;font-size:8px;letter-spacing:1px;margin-right:3px;margin-top:2px}
.tg{background:rgba(0,255,136,.1);color:#00ff88;border:1px solid rgba(0,255,136,.2)}
.tr{background:rgba(255,68,85,.1);color:#ff4455;border:1px solid rgba(255,68,85,.2)}
.tb{background:rgba(0,212,255,.1);color:#00d4ff;border:1px solid rgba(0,212,255,.2)}
.ty{background:rgba(255,214,0,.1);color:#ffd600;border:1px solid rgba(255,214,0,.2)}
.glos{background:#0a1520;border:1px solid #142030;padding:18px}
.glos h3{font-family:'Saira Condensed',sans-serif;font-size:16px;letter-spacing:3px;color:#00d4ff;margin-bottom:14px;padding-bottom:9px;border-bottom:1px solid #142030}
.ggrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px}
.gi{padding:9px 12px;background:#0d1825;border-left:2px solid #1e3040}
.gt{font-family:'Saira Condensed',sans-serif;font-size:12px;letter-spacing:2px;color:#00d4ff;margin-bottom:2px}
.gd{font-size:9px;color:#5a7a8a;line-height:1.6;letter-spacing:.5px}
.slbl{font-size:8px;letter-spacing:3px;color:#1e3040;margin-bottom:10px;display:flex;align-items:center;gap:8px}
.slbl::after{content:'';flex:1;height:1px;background:#142030}
.empty{text-align:center;padding:40px 20px;color:#1e3040;font-size:10px;letter-spacing:3px;border:1px dashed #142030}
.err{color:#ff4455;font-size:10px;letter-spacing:1px}
`;

const PRESETS = ["AAPL","MSFT","NVDA","TSLA","GOOGL","AMZN","META","AMD","NFLX","BTC-USD","ETH-USD","SPY"];
const RANGES = ["1W","1M","3M","6M","1Y"];
const MKT_IDX = [{n:"S&P 500",k:"spx"},{n:"NASDAQ",k:"ndx"},{n:"DOW",k:"dji"},{n:"VIX",k:"vix"},{n:"BTC",k:"btc"},{n:"GOLD",k:"gold"}];

async function aiCall(prompt) {
  const r = await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,
      tools:[{type:"web_search_20250305",name:"web_search"}],
      messages:[{role:"user",content:prompt}]})
  });
  const d = await r.json();
  return d.content.filter(b=>b.type==="text").map(b=>b.text).join("");
}

function parseJSON(text) {
  const clean = text.replace(/```json|```/g,"").trim();
  const m = clean.match(/\{[\s\S]*\}/);
  if(!m) throw new Error("no JSON");
  return JSON.parse(m[0]);
}

async function fetchQuote(ticker) {
  const text = await aiCall(
    `Search for current stock data for ${ticker}. Return ONLY this JSON (no markdown, no text):
{"ticker":"${ticker}","companyName":"Full name","price":0.0,"change":0.0,"changePercent":0.0,"open":0.0,"high":0.0,"low":0.0,"volume":"0M","marketCap":"0B","pe":"N/A","week52High":0.0,"week52Low":0.0,"avgVolume":"0M","beta":"1.0","dividend":"N/A","sector":"Technology"}`
  );
  return parseJSON(text);
}

async function fetchHistory(ticker, range) {
  const ptMap = {"1W":7,"1M":22,"3M":65,"6M":128,"1Y":250};
  const pts = ptMap[range]||22;
  const text = await aiCall(
    `Give me ${pts} daily closing prices for ${ticker} over the past ${range}. Use real historical data, search if needed. Return ONLY:
{"data":[{"date":"MMM DD","price":0.0,"volume":1000000},...]}`
  );
  const parsed = parseJSON(text);
  return parsed.data||[];
}

async function fetchMarket() {
  const text = await aiCall(
    `Get current values for S&P 500, NASDAQ, Dow Jones, VIX, Bitcoin, Gold. Return ONLY JSON:
{"spx":{"value":"0","change":"+0.0%"},"ndx":{"value":"0","change":"+0.0%"},"dji":{"value":"0","change":"+0.0%"},"vix":{"value":"0","change":"+0.0%"},"btc":{"value":"0","change":"+0.0%"},"gold":{"value":"0","change":"+0.0%"}}`
  );
  return parseJSON(text);
}

const CTooltip = ({active,payload,label}) => {
  if(!active||!payload?.length) return null;
  return <div className="ctt"><div className="ttl">{label}</div><div className="ttv">${Number(payload[0].value).toFixed(2)}</div></div>;
};

function Sparkline({data,up}) {
  if(!data||data.length<2) return <div className="spark"/>;
  const col=up?"#00ff88":"#ff4455";
  const px=data.map(d=>d.price);
  const mn=Math.min(...px),mx=Math.max(...px);
  const W=300,H=56,p=3;
  const pts=px.map((v,i)=>`${p+(i/(px.length-1))*(W-p*2)},${H-p-(v-mn)/(mx-mn||1)*(H-p*2)}`).join(" ");
  const area=`M ${pts.split(" ")[0]} L ${pts} L ${W-p},${H} L ${p},${H} Z`;
  return <div className="spark"><svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
    <defs><linearGradient id={`g${up?1:0}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={col} stopOpacity=".22"/><stop offset="100%" stopColor={col} stopOpacity="0"/></linearGradient></defs>
    <path d={area} fill={`url(#g${up?1:0})`}/><polyline points={pts} fill="none" stroke={col} strokeWidth="1.5"/>
  </svg></div>;
}

const LEARN = [
  {id:"basics",icon:"📊",title:"STOCK BASICS",sub:"What stocks are & how they work",body:(<>
    <h4>WHAT IS A STOCK?</h4>
    <p>A stock (share/equity) represents fractional ownership in a company. Companies sell shares via an <strong style={{color:"#00d4ff"}}>IPO (Initial Public Offering)</strong> to raise capital. Shareholders own a piece of the company and benefit from its growth.</p>
    <h4>HOW PRICES MOVE</h4>
    <p>Purely supply & demand. More buyers than sellers = price rises. Key drivers:</p>
    <ul><li><span className="tag tg">BULLISH</span> Strong earnings, buybacks, new products, low rates</li><li><span className="tag tr">BEARISH</span> Missed earnings, rising rates, recession, scandals</li></ul>
    <h4>EXCHANGES</h4><p><span className="pill">NYSE</span><span className="pill">NASDAQ</span><span className="pill">AMEX</span> are primary US exchanges. Hours: 9:30AM–4:00PM EST. Pre-market (4–9:30AM) and after-hours (4–8PM) also exist with less liquidity.</p>
    <h4>HOW YOU MAKE MONEY</h4><p><strong style={{color:"#00ff88"}}>Capital appreciation</strong> — sell higher than you bought. <strong style={{color:"#00ff88"}}>Dividends</strong> — regular cash payments from company profits. Both compound over time.</p>
  </>)},
  {id:"charts",icon:"📈",title:"READING CHARTS",sub:"Technical analysis fundamentals",body:(<>
    <h4>CHART TYPES</h4>
    <ul><li><span className="tag tb">LINE</span> Plots closing prices. Best for long-term trend visibility.</li><li><span className="tag tb">CANDLESTICK</span> Shows open/high/low/close per bar. Green candle = closed higher than open. Red = closed lower.</li></ul>
    <h4>KEY INDICATORS</h4>
    <ul><li><strong style={{color:"#00d4ff"}}>Moving Averages (MA)</strong> — 50-day & 200-day MAs are most watched. Price crossing above 200MA is a major bullish signal.</li><li><strong style={{color:"#00d4ff"}}>RSI</strong> — 0–100 oscillator. Above 70 = overbought, below 30 = oversold.</li><li><strong style={{color:"#00d4ff"}}>MACD</strong> — Momentum indicator. Crossovers signal trend changes.</li><li><strong style={{color:"#00d4ff"}}>Volume</strong> — High volume confirms moves. Low volume = weak/unreliable signal.</li><li><strong style={{color:"#00d4ff"}}>Bollinger Bands</strong> — Volatility envelope. Price at upper band = potentially overbought.</li></ul>
    <h4>SUPPORT & RESISTANCE</h4>
    <p><strong>Support</strong> = price level where buyers reliably step in. <strong>Resistance</strong> = where sellers consistently take profits. When resistance breaks, it often flips to support.</p>
    <h4>CHART PATTERNS</h4><p><span className="pill">Head & Shoulders</span><span className="pill">Double Top/Bottom</span><span className="pill">Cup & Handle</span><span className="pill">Bull/Bear Flag</span><span className="pill">Wedges</span> — predictive patterns that statistically precede certain price moves.</p>
  </>)},
  {id:"options",icon:"⚡",title:"OPTIONS",sub:"Calls, puts & derivatives explained",body:(<>
    <h4>WHAT IS AN OPTION?</h4>
    <p>A contract granting the <strong style={{color:"#00d4ff"}}>right — but not obligation</strong> — to buy or sell 100 shares at a specific price (strike) before expiration. You pay a premium for this right.</p>
    <h4>CALL OPTIONS <span className="tag tg">BULLISH</span></h4>
    <p>Right to BUY at the strike price. Profit when stock rises above strike + premium. Example: AAPL at $200, buy $210 call for $3/share ($300 total). If AAPL hits $225, intrinsic value = $15/share = $1,500. Return: 400%.</p>
    <h4>PUT OPTIONS <span className="tag tr">BEARISH</span></h4>
    <p>Right to SELL at the strike price. Profit when stock falls below strike. Used for directional bets OR as insurance/hedge on long stock positions.</p>
    <h4>THE GREEKS</h4>
    <ul><li><strong style={{color:"#00d4ff"}}>Delta</strong> — How much option price moves per $1 stock move (0–1)</li><li><strong style={{color:"#00d4ff"}}>Theta</strong> — Daily time decay. Options lose value daily even if stock stays flat</li><li><strong style={{color:"#00d4ff"}}>Vega</strong> — Sensitivity to implied volatility changes</li><li><strong style={{color:"#00d4ff"}}>Gamma</strong> — Rate of change of Delta</li></ul>
    <h4>⚠️ WARNING</h4><p>Most retail options buyers lose money. Options can expire 100% worthless. Master the theory thoroughly before trading real money.</p>
  </>)},
  {id:"etfs",icon:"🗂️",title:"ETFs & INDEX FUNDS",sub:"Diversification & passive investing",body:(<>
    <h4>WHAT IS AN ETF?</h4>
    <p>A basket of securities that trades like a single stock. One share of <span className="pill">SPY</span> gives exposure to all 500 companies in the S&P 500. Instant diversification.</p>
    <h4>TYPES</h4>
    <ul><li><span className="tag tb">INDEX</span> SPY (S&P 500), QQQ (NASDAQ 100), DIA (Dow Jones)</li><li><span className="tag tb">SECTOR</span> XLK (Tech), XLE (Energy), XLV (Healthcare)</li><li><span className="tag tb">BOND</span> AGG, BND — fixed income exposure</li><li><span className="tag ty">LEVERAGED</span> TQQQ (3x NASDAQ) — extremely high risk/reward</li><li><span className="tag tr">INVERSE</span> SQQQ (bets against NASDAQ) — for hedging</li></ul>
    <h4>WHY ETFs WIN LONG-TERM</h4>
    <ul><li>Automatic diversification with one trade</li><li>Ultra-low fees: SPY charges just 0.09%/year vs 1%+ for mutual funds</li><li>Tax efficient, transparent, highly liquid</li><li>Warren Buffett publicly recommends index ETFs for most investors</li></ul>
    <h4>DOLLAR-COST AVERAGING (DCA)</h4>
    <p>Invest a fixed amount regularly (e.g. $500/month in QQQ) regardless of price. Removes timing pressure, reduces average cost in downturns. Historically beats most active strategies over 10+ years.</p>
  </>)},
  {id:"crypto",icon:"₿",title:"CRYPTO MARKETS",sub:"Digital assets & how they differ",body:(<>
    <h4>CRYPTO VS STOCKS</h4>
    <ul><li><span className="tag tb">STOCKS</span> Real companies with revenue, employees, and tangible assets</li><li><span className="tag ty">CRYPTO</span> Decentralized digital assets valued by utility, scarcity, and speculation</li><li>Crypto markets are <strong style={{color:"#00ff88"}}>open 24/7/365</strong> — no closing bell</li><li>Crypto is 3–10× more volatile than typical equities</li></ul>
    <h4>MAJOR ASSETS</h4>
    <ul><li><strong style={{color:"#ffd600"}}>Bitcoin (BTC)</strong> — Digital gold. Fixed supply of 21M. Halving every ~4 years cuts new supply, historically preceding bull runs.</li><li><strong style={{color:"#7b68ee"}}>Ethereum (ETH)</strong> — Programmable blockchain. Smart contracts, DeFi, and NFT backbone.</li><li><strong style={{color:"#00ff88"}}>Stablecoins</strong> — USDC/USDT pegged 1:1 to USD. Used in DeFi protocols.</li></ul>
    <h4>KEY CONCEPTS</h4>
    <ul><li><strong style={{color:"#00d4ff"}}>Halving</strong> — BTC reward to miners cuts in half every ~4 years, reducing new supply inflation</li><li><strong style={{color:"#00d4ff"}}>DeFi</strong> — Decentralized Finance. Lending/borrowing/trading without banks.</li><li><strong style={{color:"#00d4ff"}}>Self-custody</strong> — Your keys, your coins. Hardware wallets protect against exchange failures.</li></ul>
    <h4>⚠️ RISK</h4><p>Unregulated in many countries. Exchanges can fail (see: FTX 2022). Projects can go to zero. Only invest what you can afford to lose entirely.</p>
  </>)},
  {id:"risk",icon:"🛡️",title:"RISK MANAGEMENT",sub:"Protecting and growing your capital",body:(<>
    <h4>THE GOLDEN RULES</h4>
    <ul><li>Never risk more than <strong style={{color:"#00ff88"}}>1–2% of portfolio</strong> per trade</li><li>Always define your stop-loss <strong>before</strong> entering a trade</li><li>Diversify across sectors — concentration kills portfolios</li><li>Don't invest money you'll need within 3–5 years</li></ul>
    <h4>POSITION SIZING FORMULA</h4>
    <p>$10,000 portfolio × 2% risk = $200 max loss. If stop-loss is 10% below entry, max position = $200 ÷ 0.10 = <strong style={{color:"#00ff88"}}>$2,000</strong>.</p>
    <h4>STOP-LOSS TYPES</h4>
    <ul><li><span className="tag tb">FIXED %</span> Exit if position drops 8–10% from entry</li><li><span className="tag tb">TRAILING</span> Stop moves up with price — locks in gains automatically</li><li><span className="tag tb">STRUCTURAL</span> Set below a key support level</li></ul>
    <h4>RISK/REWARD RATIO</h4>
    <p>Only take trades with potential gain ≥ 2× potential loss (2:1 R/R minimum). At 2:1, you can be right only 40% of the time and remain consistently profitable.</p>
    <h4>COMMON MISTAKES</h4>
    <ul><li><span className="tag tr">❌</span> Averaging down indefinitely on losing trades</li><li><span className="tag tr">❌</span> FOMO-buying after 50%+ moves already happened</li><li><span className="tag tr">❌</span> Revenge trading after losses — the account-killer</li><li><span className="tag tr">❌</span> Ignoring taxes on short-term gains (often 30–40%)</li></ul>
  </>)},
  {id:"fundamental",icon:"🔬",title:"FUNDAMENTAL ANALYSIS",sub:"Valuing companies like a professional",body:(<>
    <h4>PRICE/EARNINGS (P/E)</h4>
    <p>Stock Price ÷ EPS = P/E. A P/E of 25 means paying $25 per $1 of annual earnings. Always compare within the same industry — tech trades at higher P/E than utilities by nature.</p>
    <h4>CRITICAL METRICS</h4>
    <ul><li><strong style={{color:"#00d4ff"}}>Revenue Growth</strong> — Is the business growing? Consistency matters.</li><li><strong style={{color:"#00d4ff"}}>Gross Margin</strong> — Revenue minus cost of goods. Higher = stronger business model.</li><li><strong style={{color:"#00d4ff"}}>Free Cash Flow (FCF)</strong> — Cash after all expenses. The true health metric.</li><li><strong style={{color:"#00d4ff"}}>Debt/Equity</strong> — High debt + rising rates = danger. Look for manageable leverage.</li><li><strong style={{color:"#00d4ff"}}>Return on Equity (ROE)</strong> — Measures capital efficiency. Higher is generally better.</li><li><strong style={{color:"#00d4ff"}}>P/S Ratio</strong> — Price-to-Sales. Useful when a company isn't yet profitable.</li></ul>
    <h4>EARNINGS SEASON</h4>
    <p>4× per year companies report. Stocks can gap 10–30% on results vs analyst expectations. "Beat and raise" = price surges. "Miss" = price drops. Future <strong>guidance</strong> often matters more than past results.</p>
    <h4>DCF VALUATION</h4>
    <p>Discounted Cash Flow — project all future free cash flows and discount back to today using an appropriate rate. The gold standard of fundamental valuation. A stock is worth the sum of all future cash it will generate, in today's dollars.</p>
  </>)},
  {id:"strategies",icon:"♟️",title:"TRADING STRATEGIES",sub:"Different approaches to the market",body:(<>
    <h4>BY TIME HORIZON</h4>
    <ul><li><span className="tag ty">SCALPING</span> Seconds–minutes. Extremely demanding, requires tight spreads & deep focus.</li><li><span className="tag ty">DAY TRADING</span> Same-day open & close. No overnight risk. Requires $25K+ in US (PDT rule).</li><li><span className="tag tb">SWING TRADING</span> Days to weeks. Captures moves between support/resistance levels.</li><li><span className="tag tg">POSITION</span> Weeks to months. Fundamental + technical combined approach.</li><li><span className="tag tg">BUY & HOLD</span> Years to decades. Consistently beats most active strategies long-term.</li></ul>
    <h4>INVESTMENT FRAMEWORKS</h4>
    <ul><li><strong style={{color:"#00d4ff"}}>Momentum</strong> — Buy strength, short weakness. "Trend is your friend until it ends."</li><li><strong style={{color:"#00d4ff"}}>Mean Reversion</strong> — Overextended moves revert to average. Buy dips in uptrends.</li><li><strong style={{color:"#00d4ff"}}>Value Investing</strong> — Buy fundamentally cheap stocks (Buffett/Graham). Requires patience.</li><li><strong style={{color:"#00d4ff"}}>Growth Investing</strong> — Pay premium for high-growth companies. Higher risk/reward.</li><li><strong style={{color:"#00d4ff"}}>Dividend Growth</strong> — Compounding income from steadily growing dividends.</li></ul>
    <h4>THE MOST IMPORTANT RULE</h4>
    <p>Find a strategy that <strong style={{color:"#00ff88"}}>matches your personality</strong>. A technically valid strategy you can't emotionally execute will fail. If 10% drawdowns make you panic-sell, day trading leveraged ETFs will destroy you.</p>
  </>)},
];

const GLOSSARY = [
  {t:"Ask",d:"Lowest price a seller will accept for a share"},
  {t:"Bid",d:"Highest price a buyer is willing to pay for a share"},
  {t:"Bid-Ask Spread",d:"Difference between bid and ask — your immediate cost to trade"},
  {t:"Liquidity",d:"How easily shares can be bought/sold without moving the price"},
  {t:"Short Selling",d:"Borrowing shares to sell now, hoping to rebuy cheaper later"},
  {t:"Margin",d:"Borrowed money from broker to increase position size"},
  {t:"IPO",d:"Initial Public Offering — company's first sale of stock to public"},
  {t:"Market Order",d:"Buy/sell immediately at current best available price"},
  {t:"Limit Order",d:"Buy/sell only at your specified price or better"},
  {t:"Stop Order",d:"Triggers a market order once price hits your stop level"},
  {t:"Dividend",d:"Portion of profits paid to shareholders in cash"},
  {t:"Ex-Dividend Date",d:"Must hold shares before this date to receive next dividend"},
  {t:"Float",d:"Number of shares available for public trading"},
  {t:"Short Squeeze",d:"Short sellers forced to buy, driving price up rapidly"},
  {t:"Earnings Per Share",d:"Net income divided by total shares — key profitability metric"},
  {t:"Circuit Breaker",d:"Automatic market halt triggered by extreme % declines"},
  {t:"Dark Pool",d:"Private exchange for large institutional trades, off public markets"},
  {t:"Basis Points",d:"1/100th of a percent; 25bps = 0.25%"},
  {t:"Alpha",d:"Returns generated above the benchmark — skill-based outperformance"},
  {t:"Beta",d:"Stock volatility vs market. Beta > 1 = more volatile than market"},
  {t:"Sharpe Ratio",d:"Risk-adjusted return metric. Higher = better return per unit of risk"},
  {t:"Yield Curve",d:"Plot of interest rates across different bond maturities"},
  {t:"Hedge",d:"An offsetting position designed to reduce risk of another position"},
  {t:"Contango",d:"Futures price exceeds spot — common in commodity markets"},
];

export default function App() {
  const [tab, setTab] = useState("watchlist");
  const [tickers, setTickers] = useState(["AAPL","NVDA","TSLA"]);
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});
  const [sparks, setSparks] = useState({});
  const [sel, setSel] = useState(null);
  const [hist, setHist] = useState([]);
  const [range, setRange] = useState("1M");
  const [histLoad, setHistLoad] = useState(false);
  const [inp, setInp] = useState("");
  const [clk, setClk] = useState("");
  const [mkt, setMkt] = useState(null);
  const [openLearn, setOpenLearn] = useState(null);
  const [port, setPort] = useState([{id:1,ticker:"AAPL",shares:10,avgPrice:175},{id:2,ticker:"NVDA",shares:5,avgPrice:700}]);
  const [pInp, setPInp] = useState({ticker:"",shares:"",avgPrice:""});

  useEffect(()=>{
    const tick=()=>setClk(new Date().toLocaleTimeString("en-US",{hour12:false})+" EST");
    tick(); const id=setInterval(tick,1000); return ()=>clearInterval(id);
  },[]);

  const loadQ = useCallback(async(t)=>{
    setLoading(p=>({...p,[t]:true})); setErrors(p=>({...p,[t]:null}));
    try {
      const d=await fetchQuote(t); setQuotes(p=>({...p,[t]:d}));
      try{ const h=await fetchHistory(t,"1M"); if(h.length>1) setSparks(p=>({...p,[t]:h})); }catch(e){}
    } catch(e){ setErrors(p=>({...p,[t]:"FETCH ERROR"})); }
    finally{ setLoading(p=>({...p,[t]:false})); }
  },[]);

  useEffect(()=>{ tickers.forEach(t=>{if(!quotes[t])loadQ(t);}); fetchMarket().then(setMkt).catch(()=>{}); },[]);

  const loadHist = useCallback(async(t,r)=>{
    setHistLoad(true); setHist([]);
    try{ const h=await fetchHistory(t,r); setHist(h); setSparks(p=>({...p,[t]:h})); }catch(e){}
    finally{ setHistLoad(false); }
  },[]);

  const selectT = (t)=>{
    if(sel===t){setSel(null);return;}
    setSel(t); loadHist(t,range);
  };

  const chgRange = (r)=>{ setRange(r); if(sel) loadHist(sel,r); };

  const addT = ()=>{
    const t=inp.toUpperCase().trim();
    if(!t||tickers.includes(t)){setInp("");return;}
    setTickers(p=>[...p,t]); loadQ(t); setInp("");
  };

  const addPreset = (t)=>{ if(tickers.includes(t)){selectT(t);return;} setTickers(p=>[...p,t]); loadQ(t); };
  const removeT = (t)=>{ setTickers(p=>p.filter(x=>x!==t)); if(sel===t)setSel(null); };

  const q=sel?quotes[sel]:null;
  const cc=q?(q.change>=0?"#00ff88":"#ff4455"):"#00d4ff";
  const anyLoad=Object.values(loading).some(Boolean);

  const addPortPos = ()=>{
    const t=pInp.ticker.toUpperCase().trim();
    if(!t||!pInp.shares||!pInp.avgPrice)return;
    setPort(p=>[...p,{id:Date.now(),ticker:t,shares:Number(pInp.shares),avgPrice:Number(pInp.avgPrice)}]);
    setPInp({ticker:"",shares:"",avgPrice:""});
    if(!tickers.includes(t)){setTickers(p=>[...p,t]);loadQ(t);}
  };

  const totVal=port.reduce((a,p)=>{const qd=quotes[p.ticker];return a+(qd?qd.price*p.shares:p.avgPrice*p.shares);},0);
  const totCost=port.reduce((a,p)=>a+p.avgPrice*p.shares,0);
  const totPL=totVal-totCost;
  const totPct=totCost>0?(totPL/totCost*100):0;

  return(<>
    <style>{CSS}</style>
    <div className="app">
      <div className="hdr">
        <div className="brand">MKT<span>WATCH</span></div>
        <div className="hdr-right">
          <div className="live-badge"><div className="pulse"/>LIVE AI DATA</div>
          <div className="clk">{clk}</div>
        </div>
      </div>
      <div className="tabs">
        {["watchlist","portfolio","learn"].map(t=>(
          <div key={t} className={`tab${tab===t?" active":""}`} onClick={()=>setTab(t)}>{t.toUpperCase()}</div>
        ))}
      </div>
      <div className="main">

        {tab!=="learn"&&<div className="mbar">
          {MKT_IDX.map(({n,k})=>{
            const d=mkt?.[k]; const up=d&&!d.change.startsWith("-");
            return <div key={k} className="mi"><div className="mn">{n}</div><div className="mv">{d?d.value:"—"}</div>{d&&<div className={`mc ${up?"up":"dn"}`}>{d.change}</div>}</div>;
          })}
        </div>}

        {/* WATCHLIST */}
        {tab==="watchlist"&&<>
          <div className="srow">
            <input className="sinput" placeholder="SYMBOL (e.g. AMZN)" value={inp}
              onChange={e=>setInp(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&addT()} maxLength={10}/>
            <button className="btn" onClick={addT} disabled={!inp.trim()}>+ ADD</button>
            <button className="btn btn2" onClick={()=>tickers.forEach(t=>loadQ(t))} disabled={anyLoad}>{anyLoad?"LOADING…":"↻ REFRESH"}</button>
          </div>
          <div className="chips">{PRESETS.map(t=><div key={t} className={`chip${tickers.includes(t)?" on":""}`} onClick={()=>addPreset(t)}>{t}</div>)}</div>

          {sel&&<div className="detail">
            <div className="dhdr">
              <div className="dtitle">
                <div><div className="dticker">{sel}</div><div style={{fontSize:9,color:"#3a5a70",letterSpacing:1}}>{q?.companyName||"—"}</div></div>
                {q&&<div><div className="dprice">${typeof q.price==="number"?q.price.toFixed(2):q.price}</div>
                  <div className={`cv ${q.change>=0?"up":"dn"}`}>{q.change>=0?"▲":"▼"} {typeof q.change==="number"?q.change.toFixed(2):q.change} ({typeof q.changePercent==="number"?q.changePercent.toFixed(2):q.changePercent}%)</div>
                </div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
                <button className="rmbtn" style={{fontSize:20}} onClick={()=>setSel(null)}>×</button>
                <div className="rtabs">{RANGES.map(r=><div key={r} className={`rtab${range===r?" active":""}`} onClick={()=>chgRange(r)}>{r}</div>)}</div>
              </div>
            </div>
            <div className="cwrap">
              {histLoad?<div className="cload">FETCHING CHART DATA…</div>:hist.length>1?(
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={hist} margin={{top:4,right:4,bottom:0,left:0}}>
                    <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={cc} stopOpacity={.18}/><stop offset="95%" stopColor={cc} stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid stroke="#0d1825" strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="date" tick={{fill:"#2a4a5a",fontSize:8,fontFamily:"IBM Plex Mono"}} tickLine={false} axisLine={false} interval="preserveStartEnd"/>
                    <YAxis domain={["auto","auto"]} tick={{fill:"#2a4a5a",fontSize:8,fontFamily:"IBM Plex Mono"}} tickLine={false} axisLine={false} tickFormatter={v=>`$${v}`} width={52}/>
                    <Tooltip content={<CTooltip/>}/>
                    <Area type="monotone" dataKey="price" stroke={cc} strokeWidth={1.5} fill="url(#cg)" dot={false} activeDot={{r:3,fill:cc,strokeWidth:0}}/>
                  </AreaChart>
                </ResponsiveContainer>
              ):<div className="cload">NO DATA</div>}
            </div>
            {hist.length>1&&hist[0].volume!=null&&<div style={{padding:"0 14px 10px"}}>
              <div className="slbl" style={{marginBottom:4}}>VOLUME</div>
              <ResponsiveContainer width="100%" height={44}>
                <BarChart data={hist} margin={{top:0,right:4,bottom:0,left:0}}>
                  <Bar dataKey="volume" fill={cc} opacity={.35} radius={[1,1,0,0]}/><XAxis dataKey="date" hide/><YAxis hide/>
                </BarChart>
              </ResponsiveContainer>
            </div>}
            {q&&<div className="dstats">
              {[["OPEN",`$${q.open}`],["52W HIGH",`$${q.week52High}`],["VOLUME",q.volume],["P/E",q.pe],
                ["52W LOW",`$${q.week52Low}`],["MKT CAP",q.marketCap],["AVG VOL",q.avgVolume],["DIVIDEND",q.dividend],
                ["BETA",q.beta],["SECTOR",q.sector],["DAY HIGH",`$${q.high}`],["DAY LOW",`$${q.low}`]
              ].map(([l,v])=><div key={l} className="sc"><div className="sl">{l}</div><div className="sv">{v||"—"}</div></div>)}
            </div>}
          </div>}

          <div className="slbl">WATCHLIST — {tickers.length} SYMBOLS</div>
          {tickers.length===0?<div className="empty">NO SYMBOLS — ADD A TICKER ABOVE</div>:
          <div className="grid">{tickers.map(t=>{
            const s=quotes[t],isL=loading[t],err=errors[t];
            const dir=s?(s.change>0?"up":s.change<0?"dn":"nt"):"nt";
            return <div key={t} className={`card${sel===t?" sel":""}`} onClick={()=>selectT(t)}>
              {isL&&<div className="lbar"/>}
              <div className="ctop">
                <div className="chdr">
                  <div><div className="tlbl">{t}</div><div className="cname">{s?.companyName||"—"}</div></div>
                  <button className="rmbtn" onClick={e=>{e.stopPropagation();removeT(t);}}>×</button>
                </div>
                {isL&&!s?<div style={{color:"#1e3040",fontSize:10,letterSpacing:2,paddingBottom:12}}>FETCHING…</div>:
                 err&&!s?<div className="err">{err}<br/><button className="btn btn2" style={{fontSize:9,padding:"3px 8px",marginTop:5}} onClick={e=>{e.stopPropagation();loadQ(t);}}>RETRY</button></div>:
                 s?<><div className="pbig">${typeof s.price==="number"?s.price.toFixed(2):s.price}</div>
                 <div className="crow">
                   <span className={`cv ${dir}`}>{dir==="up"?"▲":dir==="dn"?"▼":"—"} {s.change>0?"+":""}{typeof s.change==="number"?s.change.toFixed(2):s.change}</span>
                   <span className={`cv ${dir}`}>({s.changePercent>0?"+":""}{typeof s.changePercent==="number"?s.changePercent.toFixed(2):s.changePercent}%)</span>
                 </div></>:null}
              </div>
              {sparks[t]&&<Sparkline data={sparks[t]} up={s?.change>=0}/>}
              {s&&<div className="cmeta">
                <div className="mc2">VOL<span className="mv2">{s.volume}</span></div>
                <div className="mc2">CAP<span className="mv2">{s.marketCap}</span></div>
                <div className="mc2">P/E<span className="mv2">{s.pe||"—"}</span></div>
              </div>}
            </div>;
          })}</div>}
        </>}

        {/* PORTFOLIO */}
        {tab==="portfolio"&&<>
          <div className="psum">
            <div className="pcard"><div className="plbl">TOTAL VALUE</div><div className="pval">${totVal.toLocaleString("en",{maximumFractionDigits:2})}</div></div>
            <div className="pcard"><div className="plbl">TOTAL COST</div><div className="pval">${totCost.toLocaleString("en",{maximumFractionDigits:2})}</div></div>
            <div className="pcard"><div className="plbl">TOTAL P&L</div><div className={`pval ${totPL>=0?"pp":"pn"}`}>{totPL>=0?"+":""}{totPL.toLocaleString("en",{maximumFractionDigits:2})}</div></div>
            <div className="pcard"><div className="plbl">RETURN %</div><div className={`pval ${totPct>=0?"pp":"pn"}`}>{totPct>=0?"+":""}{totPct.toFixed(2)}%</div></div>
          </div>
          <div className="pform">
            <div className="slbl">ADD POSITION</div>
            <div className="frow">
              <input placeholder="TICKER" value={pInp.ticker} onChange={e=>setPInp(p=>({...p,ticker:e.target.value.toUpperCase()}))} style={{maxWidth:110,textTransform:"uppercase"}}/>
              <input placeholder="SHARES" type="number" value={pInp.shares} onChange={e=>setPInp(p=>({...p,shares:e.target.value}))} style={{maxWidth:110}}/>
              <input placeholder="AVG PRICE ($)" type="number" value={pInp.avgPrice} onChange={e=>setPInp(p=>({...p,avgPrice:e.target.value}))} style={{maxWidth:150}}/>
              <button className="btn" onClick={addPortPos}>+ ADD</button>
            </div>
          </div>
          {port.length===0?<div className="empty">NO POSITIONS — ADD ONE ABOVE</div>:
          <div style={{background:"#0a1520",border:"1px solid #142030",overflowX:"auto"}}>
            <table className="ptbl">
              <thead><tr><th>SYMBOL</th><th>SHARES</th><th>AVG COST</th><th>CURRENT</th><th>MKT VALUE</th><th>P&L ($)</th><th>P&L (%)</th><th></th></tr></thead>
              <tbody>{port.map(pos=>{
                const qd=quotes[pos.ticker],cur=qd?.price||null;
                const mv=cur?cur*pos.shares:null,pl=mv?mv-pos.avgPrice*pos.shares:null,plp=pl!=null?(pl/(pos.avgPrice*pos.shares)*100):null;
                return <tr key={pos.id}>
                  <td style={{color:"#00d4ff",fontFamily:"Saira Condensed",fontSize:15,letterSpacing:2}}>{pos.ticker}</td>
                  <td>{pos.shares}</td><td>${pos.avgPrice.toFixed(2)}</td>
                  <td>{cur?`$${cur.toFixed(2)}`:<span style={{color:"#1e3040"}}>—</span>}</td>
                  <td>{mv?`$${mv.toLocaleString("en",{maximumFractionDigits:2})}`:"—"}</td>
                  <td className={pl!=null?(pl>=0?"pp":"pn"):""}>{pl!=null?`${pl>=0?"+":""}${pl.toFixed(2)}`:"—"}</td>
                  <td className={plp!=null?(plp>=0?"pp":"pn"):""}>{plp!=null?`${plp>=0?"+":""}${plp.toFixed(2)}%`:"—"}</td>
                  <td><button className="rmbtn" onClick={()=>setPort(p=>p.filter(x=>x.id!==pos.id))}>×</button></td>
                </tr>;
              })}</tbody>
            </table>
          </div>}
        </>}

        {/* LEARN */}
        {tab==="learn"&&<>
          <div className="slbl">MARKET EDUCATION — 8 TOPICS</div>
          <div className="lgrid">{LEARN.map(t=>(
            <div key={t.id} className={`lcard${openLearn===t.id?" open":""}`} onClick={()=>setOpenLearn(openLearn===t.id?null:t.id)}>
              <div className="lchdr">
                <div><div className="lct">{t.title}</div><div className="lcs">{t.sub}</div></div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:20}}>{t.icon}</span>
                  <span style={{color:"#3a5a70",fontSize:16,transition:"transform .2s",display:"inline-block",transform:openLearn===t.id?"rotate(45deg)":"none"}}>+</span>
                </div>
              </div>
              {openLearn===t.id&&<div className="lbody" onClick={e=>e.stopPropagation()}>{t.body}</div>}
            </div>
          ))}</div>
          <div className="glos">
            <h3>GLOSSARY — 24 TERMS</h3>
            <div className="ggrid">{GLOSSARY.map(g=><div key={g.t} className="gi"><div className="gt">{g.t}</div><div className="gd">{g.d}</div></div>)}</div>
          </div>
        </>}

      </div>
    </div>
  </>);
}
