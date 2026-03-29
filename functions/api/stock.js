const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const ticker = url.searchParams.get("ticker")?.toUpperCase()?.trim();

  if (!ticker) {
    return new Response(JSON.stringify({ error: "ticker query param is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }

  try {
    const YF_HEADERS = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/json",
    };

    const [quoteRes, chartRes] = await Promise.all([
      fetch(
        `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(ticker)}`,
        { headers: YF_HEADERS }
      ),
      fetch(
        `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=5m&range=1d`,
        { headers: YF_HEADERS }
      ),
    ]);

    const [quoteData, chartData] = await Promise.all([
      quoteRes.json(),
      chartRes.json(),
    ]);

    const quote = quoteData?.quoteResponse?.result?.[0];
    if (!quote) {
      return new Response(
        JSON.stringify({ error: `Ticker "${ticker}" not found. Please check the symbol and try again.` }),
        { status: 404, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
      );
    }

    const chart = chartData?.chart?.result?.[0];
    const closes     = chart?.indicators?.quote?.[0]?.close || [];
    const timestamps = chart?.timestamp || [];
    const sparkline  = timestamps
      .map((t, i) => ({ t, c: closes[i] }))
      .filter((d) => d.c != null);

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
        marketState:   quote.marketState, // REGULAR | PRE | POST | CLOSED
        currency:      quote.currency,
        sparkline,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
    );
  }
}
