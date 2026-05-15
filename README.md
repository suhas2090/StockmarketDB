# DALAL.AI — Indian Market Intelligence Platform

Single-page application for real-time Indian stock market analysis with AI-powered research, FII/DII tracking, options chain, DCF valuation, scenario simulation, and supply chain risk mapping.

Built as a static HTML/CSS/JS frontend that talks to a Cloudflare Worker (Yahoo Finance proxy + NSE scraper + RSS aggregator) and optionally to Groq (LLaMA 3.3 70B) and Alpha Vantage APIs.

## Architecture

```
Browser (index.html)
 ├── Cloudflare Worker ─── Yahoo Finance (prices, indices, macros)
 │                      ├── NSE India (option chain, breadth, PCR)
 │                      ├── Groq API (AI summaries)
 │                      ├── RSS feeds (news aggregation)
 │                      └── ForexFactory (economic calendar)
 ├── Groq API (direct) ──── D.AI research, Scenario AI, Supply Chain AI
 ├── Alpha Vantage ──────── Macro indicators (CPI, GDP, Fed rate, crude)
 ├── MrChartist API ─────── FII/DII institutional flow data
 └── localStorage ───────── Watchlist, API keys, CPI overrides, FPI cache
```

## Setup

1. Deploy `worker.js` to Cloudflare Workers (free tier works)
2. Set `WORKER_URL` in `js/config.js` to your worker URL
3. (Optional) Add a Groq API key via the in-app modal for AI features
4. (Optional) Add an Alpha Vantage API key for CPI/GDP/fed rate macros
5. Serve `index.html` from any static host (no build step needed)

## Tech Stack

- **Frontend:** Single-file HTML (vanilla JS, CSS Grid/Flexbox, SVG)
- **Backend:** Cloudflare Workers (Yahoo Finance proxy, NSE scraper)
- **AI:** Groq API (Llama 3.3 70B) for research, scenario analysis
- **Data:** Yahoo Finance, NSE India, RSS feeds, Alpha Vantage
- **Visualization:** Canvas (charts), D3.js (3D globe), SVG (gauges)
