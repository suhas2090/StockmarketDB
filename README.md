# DALAL.AI — Indian Stock Market Dashboard
A single-page dashboard for Indian equity markets with live Nifty/Bank Nifty/Sensex, market breadth, option chain, DCF valuation, market regime classification, and earnings calendar.
## Features
- **Live Indices** — Nifty, Bank Nifty, Sensex, VIX, USD/INR, Gold, Crude, G-Sec
- **Market Breadth** — A/D ratio, advance/decline counts, 52-week highs/lows
- **Option Chain** — PCR, max pain, OI buildup, support/resistance levels
- **DCF Valuation** — Two-stage discounted cash flow with sensitivity tables, Monte Carlo simulation, and scenario analysis for 8 Nifty stocks
- **Market Regime Engine** — Multi-factor classification (breadth, volatility, momentum, smart money, trend, cross-asset) with continuous scoring
- **Earnings Calendar** — Upcoming earnings, macro events, and IPOs with impact prediction
- **Latest Intelligence** — Live RSS news feeds from ET Markets, Moneycontrol, Livemint, etc.
- **Sector Heatmap** — Real-time sector performance visualization
- **Market Mood Index** — VIX-based sentiment gauge
- **FII/DII Data** — Foreign and domestic institutional flow tracking
- **AI Analysis** — Groq-powered market research assistant (requires API key)
## Deployment
Two components need to be deployed:
### 1. Cloudflare Worker (backend API)
Upload `worker.js` to Cloudflare Workers as a free worker.
1. Go to https://dash.cloudflare.com → Workers & Pages → Create Worker
2. Name it `dalal-prices` (or update the URL in `index.html` CONFIG block)
3. Paste the entire `worker.js` code → Deploy
### 2. Cloudflare Pages (frontend)
Upload `index.html` (and the `styles/` and `js/` folders if present) to Cloudflare Pages as a static site.
1. Go to https://dash.cloudflare.com → Workers & Pages → Create → Pages
2. Upload the files or connect a git repository
3. No build command needed (it's a static HTML file)
### Configuration
In `index.html`, find the `CONFIG` block (around line 4200):
```
WORKER_URL: "https://dalal-prices.your-name.workers.dev",
```
Update this to match your worker's URL. The GROQ_API_KEY is optional — without it, AI chat and scenario analysis won't work.
## Data Sources
- **Yahoo Finance** — Stock prices, indices, 52-week highs/lows
- **NSE India** — Option chain, PCR (only during market hours, 9:15 AM - 3:30 PM IST)
- **RSS Feeds** — ET Markets, Moneycontrol, Livemint, Business Standard Markets, NSE India
- **Yahoo Finance Calendar** — Earnings events
## Limitations & Flaws
- NSE option chain data is only available during market hours (NSE blocks API access outside trading hours)
- Free API proxies can be unreliable — some data may fail to load on first attempt
- DCF valuations are simplified estimates using public data, not professional research
- Market regime classification uses heuristic thresholds and may not capture all market conditions
- No authentication — anyone with the URL can access the dashboard
- Cloudflare Worker free plan has 100k requests/day limit
- This is a side project, not a financial advisory tool. Verify all data before making trading decisions.
## Disclaimer
This tool is for educational and informational purposes only. It does not constitute investment advice. Always verify data from official sources. The creators are not responsible for any financial losses incurred using this tool.
