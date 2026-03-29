const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestGet(context) {
  const url    = new URL(context.request.url);
  const ticker = url.searchParams.get("ticker")?.toUpperCase()?.trim();
  const range  = url.searchParams.get("range") || "1d";

  if (!ticker) {
    return new Response(JSON.stringify({ error: "ticker query param is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }

  const INTERVAL_MAP = {
    "1d":  "5m",
    "5d":  "15m",
    "1mo": "1h",
    "3mo": "1d",
    "6mo": "1d",
    "1y":  "1wk",
  };
  const interval = INTERVAL_MAP[range] || "5m";

  const YF_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "application/json, */*",
    "Accept-Language": "en-US,en;q=0.9",
    "Referer": "https://finance.yahoo.com",
    "Origin": "https://finance.yahoo.com",
    "Cache-Control": "no-cache",
  };

  // Use only v8 chart endpoint — more reliable from Cloudflare Workers
  // It includes quote-level data in the meta field
  const path = `/v8/finance/chart/${encodeURIComponent(ticker)}?interval=${interval}&range=${range}&includePrePost=true`;
  const urls = [
    `https://query1.finance.yahoo.com${path}`,
    `https://query2.finance.yahoo.com${path}`,
  ];

  let chartData = null;
  let lastErr = null;

  for (const u of urls) {
    try {
      const r = await fetch(u, { headers: YF_HEADERS });
      if (r.ok) {
        chartData = await r.json();
        break;
      }
      lastErr = `Yahoo returned ${r.status}`;
    } catch (e) {
      lastErr = e.message;
    }
  }

  if (!chartData) {
    return new Response(
      JSON.stringify({ error: `Failed to fetch stock data: ${lastErr}` }),
      { status: 502, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }

  try {
    const chart = chartData?.chart?.result?.[0];
    if (!chart) {
      const errMsg = chartData?.chart?.error?.description || `Ticker "${ticker}" not found. Please check the symbol and try again.`;
      return new Response(
        JSON.stringify({ error: errMsg }),
        { status: 404, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
      );
    }

    const meta = chart.meta || {};
    const q    = chart.indicators?.quote?.[0] || {};
    const ts   = chart.timestamp || [];

    // Build OHLCV candle array
    const candles = ts
      .map((t, i) => ({
        t,
        time: new Date(t * 1000).toISOString(),
        o: q.open?.[i]   ?? null,
        h: q.high?.[i]   ?? null,
        l: q.low?.[i]    ?? null,
        c: q.close?.[i]  ?? null,
        v: q.volume?.[i] ?? 0,
      }))
      .filter((d) => d.c != null && d.o != null && d.h != null && d.l != null);

    // Extract quote data from chart meta
    const price         = meta.regularMarketPrice ?? candles[candles.length - 1]?.c ?? null;
    const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? null;
    const change        = (price != null && previousClose != null) ? price - previousClose : null;
    const changePercent = (change != null && previousClose) ? (change / previousClose) * 100 : null;

    // Day high/low from candles if range is 1d
    let dayHigh = null, dayLow = null, volume = 0;
    if (range === "1d" && candles.length > 0) {
      dayHigh = Math.max(...candles.map(c => c.h));
      dayLow  = Math.min(...candles.map(c => c.l));
      volume  = candles.reduce((sum, c) => sum + (c.v || 0), 0);
    } else {
      dayHigh = meta.regularMarketDayHigh ?? null;
      dayLow  = meta.regularMarketDayLow ?? null;
      volume  = meta.regularMarketVolume ?? 0;
    }

    return new Response(
      JSON.stringify({
        symbol:        meta.symbol || ticker,
        shortName:     meta.shortName || meta.longName || meta.symbol || ticker,
        price,
        change,
        changePercent,
        open:          candles[0]?.o ?? null,
        previousClose,
        dayHigh,
        dayLow,
        volume,
        marketCap:     meta.marketCap ?? null,
        pe:            meta.trailingPE ?? null,
        eps:           meta.epsTrailingTwelveMonths ?? null,
        week52High:    meta.fiftyTwoWeekHigh ?? null,
        week52Low:     meta.fiftyTwoWeekLow ?? null,
        avgVolume:     meta.averageDailyVolume3Month ?? null,
        beta:          meta.beta ?? null,
        dividendYield: meta.dividendYield ?? null,
        marketState:   meta.marketState ?? "CLOSED",
        currency:      meta.currency ?? "USD",
        candles,
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }
}
