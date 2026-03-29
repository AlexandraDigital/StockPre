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

  // Map range to interval for chart candles
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
    "Cache-Control": "no-cache",
  };

  // Try query1 first (less rate-limited), fall back to query2
  async function yfFetch(path) {
    const urls = [
      `https://query1.finance.yahoo.com${path}`,
      `https://query2.finance.yahoo.com${path}`,
    ];
    for (const u of urls) {
      try {
        const r = await fetch(u, { headers: YF_HEADERS });
        if (r.ok) return r.json();
      } catch (_) {
        // try next
      }
    }
    // last attempt — throw on failure
    const r = await fetch(urls[1], { headers: YF_HEADERS });
    return r.json();
  }

  try {
    const [quoteData, chartData] = await Promise.all([
      yfFetch(`/v7/finance/quote?symbols=${encodeURIComponent(ticker)}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketOpen,regularMarketPreviousClose,regularMarketDayHigh,regularMarketDayLow,regularMarketVolume,marketCap,trailingPE,epsTrailingTwelveMonths,fiftyTwoWeekHigh,fiftyTwoWeekLow,averageDailyVolume3Month,beta,dividendYield,currency,marketState,shortName,longName`),
      yfFetch(`/v8/finance/chart/${encodeURIComponent(ticker)}?interval=${interval}&range=${range}`),
    ]);

    const quote = quoteData?.quoteResponse?.result?.[0];
    if (!quote) {
      return new Response(
        JSON.stringify({ error: `Ticker "${ticker}" not found. Please check the symbol and try again.` }),
        { status: 404, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
      );
    }

    // Build OHLCV candle array
    const chart      = chartData?.chart?.result?.[0];
    const q          = chart?.indicators?.quote?.[0] || {};
    const timestamps = chart?.timestamp || [];
    const candles    = timestamps
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

    return new Response(
      JSON.stringify({
        symbol:        quote.symbol,
        shortName:     quote.shortName || quote.longName || quote.symbol,
        price:         quote.regularMarketPrice,
        change:        quote.regularMarketChange,
        changePercent: quote.regularMarketChangePercent,
        open:          quote.regularMarketOpen,
        previousClose: quote.regularMarketPreviousClose,
        dayHigh:       quote.regularMarketDayHigh,
        dayLow:        quote.regularMarketDayLow,
        volume:        quote.regularMarketVolume,
        marketCap:     quote.marketCap,
        pe:            quote.trailingPE,
        eps:           quote.epsTrailingTwelveMonths,
        week52High:    quote.fiftyTwoWeekHigh,
        week52Low:     quote.fiftyTwoWeekLow,
        avgVolume:     quote.averageDailyVolume3Month,
        beta:          quote.beta,
        dividendYield: quote.dividendYield,
        marketState:   quote.marketState,
        currency:      quote.currency,
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
