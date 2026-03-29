# 📈 StockPre – Live Stock Tracker

A fully functional, zero-setup stock tracker that runs directly in your browser. No backend required — deploys instantly on GitHub Pages.

## Features

- 🔍 **Search any stock** by ticker symbol (AAPL, TSLA, GOOGL, etc.)
- 📊 **Three chart types** — Line, Candlestick (OHLC), and Volume
- ⏱️ **Five time ranges** — 1W, 1M, 3M, 6M, 1Y
- 📋 **Key metrics** — Price, % change, open/high/low, volume, market cap, P/E ratio, dividend yield, 52-week range
- 📚 **Chart Reading Guide** — expandable educational lessons on:
  - Reading line charts (trends, support/resistance)
  - Candlestick patterns (doji, hammer, engulfing, shooting star)
  - Volume analysis (confirming moves)
  - Key metrics explained (P/E, market cap, 52-week range, dividends)
  - Common investing mistakes to avoid
- ⚡ **Instant popular picks** — AAPL, TSLA, GOOGL, MSFT, AMZN, NVDA, META, and more

## Tech Stack

- **Vanilla HTML/CSS/JavaScript** — single `index.html`, no build step
- **Chart.js** + **chartjs-chart-financial** — for line, candlestick & volume charts
- **Luxon** + **chartjs-adapter-luxon** — for time-based x-axis
- **Yahoo Finance API** via CORS proxy — for live market data

## Deploy to GitHub Pages

1. Go to your repository **Settings → Pages**
2. Set **Source** to `Deploy from a branch`
3. Select `main` branch, `/ (root)` folder
4. Click **Save** — your app will be live at `https://yourusername.github.io/StockPre/`

## Local Usage

Simply open `index.html` in your browser — no server needed!

```bash
open index.html  # macOS
start index.html # Windows
```

## Data Source

Data is sourced from Yahoo Finance via [AllOrigins](https://allorigins.win/) CORS proxy. This is for **educational and demonstration purposes only**.

> ⚠️ **Disclaimer:** This tool is for educational purposes only. Nothing on this platform constitutes financial advice. Always conduct your own research before making any investment decisions.
