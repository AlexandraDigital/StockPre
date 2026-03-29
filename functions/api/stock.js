const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const YF_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// ---------- helpers ----------

// Step 1: Hit fc.yahoo.com to get a consent cookie
// Step 2: Use that cookie to fetch a crumb from /v1/test/getcrumb
// Returns { crumb, cookie } or null
async function getYahooCrumb() {
  try {
    // Get initial cookies
    const initResp = await fetch("https://fc.yahoo.com", {
      headers: { "User-Agent": YF_UA },
      redirect: "manual",
    });
    // Collect Set-Cookie headers
    const rawCookies = initResp.headers.getAll?.("set-cookie")
      || [initResp.headers.get("set-cookie")].filter(Boolean);
    // Parse just the key=value parts
    const cookiePairs = rawCookies
      .map((c) => c.split(";")[0])
      .filter(Boolean);
    const cookieStr = cookiePairs.join("; ");

    // Now fetch the crumb
    const crumbResp = await fetch("https://query2.finance.yahoo.com/v1/test/getcrumb", {
      headers: {
        "User-Agent": YF_UA,
        "Cookie": cookieStr,
      },
    });
    if (!crumbResp.ok) return null;
    const crumb = (await crumbResp.text()).trim();
    if (!crumb || crumb.includes("<")) return null; // HTML error page
    return { crumb, cookie: cookieStr };
  } catch {
    return null;
  }
}

export async function onRequestOptions() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function onRequestGet(context) {
  const url    = new URL(context.request.url);
  const ticker = url.searchParams.get("ticker")?.toUpperCase()?.trim();
  const range  = url.searchParams.get("range") || "1d";

  if (!ticker) {
    return json({ error: "ticker query param is required" }, 400);
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

  // ---------- fetch chart data ----------
  let chartData = null;
  let lastErr   = null;

  // Strategy 1: crumb + cookie (most reliable from Workers)
  const auth = await getYahooCrumb();
  if (auth) {
    const hosts = ["query2.finance.yahoo.com", "query1.finance.yahoo.com"];
    for (const host of hosts) {
      try {
        const chartUrl = `https://${host}/v8/finance/chart/${encodeURIComponent(ticker)}?interval=${interval}&range=${range}&includePrePost=true&crumb=${encodeURIComponent(auth.crumb)}`;
        const r = await fetch(chartUrl, {
          headers: {
            "User-Agent": YF_UA,
            "Cookie": auth.cookie,
            "Accept": "application/json",
          },
        });
        if (r.ok) {
          chartData = await r.json();
          break;
        }
        lastErr = `Yahoo returned ${r.status}`;
      } catch (e) {
        lastErr = e.message;
      }
    }
  }

  // Strategy 2: plain request without crumb (fallback)
  if (!chartData) {
    const hosts = ["query1.finance.yahoo.com", "query2.finance.yahoo.com"];
    for (const host of hosts) {
      try {
        const chartUrl = `https://${host}/v8/finance/chart/${encodeURIComponent(ticker)}?interval=${interval}&range=${range}&includePrePost=true`;
        const r = await fetch(chartUrl, {
          headers: {
            "User-Agent": YF_UA,
            "Accept": "application/json",
            "Referer": "https://finance.yahoo.com",
            "Origin": "https://finance.yahoo.com",
          },
        });
        if (r.ok) {
          chartData = await r.json();
          break;
        }
        lastErr = `Yahoo returned ${r.status}`;
      } catch (e) {
        lastErr = e.message;
      }
    }
  }

  if (!chartData) {
    return json({ error: `Failed to fetch stock data: ${lastErr}` }, 502);
  }

  // ---------- parse response ----------
  try {
    const chart = chartData?.chart?.result?.[0];
    if (!chart) {
      const errMsg = chartData?.chart?.error?.description
        || `Ticker "${ticker}" not found. Please check the symbol and try again.`;
      return json({ error: errMsg }, 404);
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

    // Quote data from chart meta
    const price         = meta.regularMarketPrice ?? candles[candles.length - 1]?.c ?? null;
    const previousClose = meta.chartPreviousClose ?? meta.previousClose ?? null;
    const change        = (price != null && previousClose != null) ? price - previousClose : null;
    const changePercent = (change != null && previousClose) ? (change / previousClose) * 100 : null;

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

    return json({
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
    }, 200);
  } catch (err) {
    return json({ error: err.message || "Internal server error" }, 500);
  }
}

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
  });
}
