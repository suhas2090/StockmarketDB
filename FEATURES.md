# Feature List — Detailed Backend Descriptions

---

## 1. Live Stock / Index / Macro Prices

**What it does:** Displays real-time prices for 60+ NSE stocks, 5 indices (NIFTY, SENSEX, BANKNIFTY, DJI, NASDAQ), and 5 macro indicators (USD/INR, Crude, Gold, G-Sec yield, India VIX) in the ticker bar, left sidebar, and macro health cards.

**Data Flow:**
1. `refreshAllLiveData()` fires on page load and every 5 minutes
2. Sends three parallel `workerFetch()` calls to `WORKER_URL?symbols=TCS.NS,RELIANCE.NS,...`
3. Worker proxies to Yahoo Finance `/v8/finance/chart` endpoint, returns `{price, chgAmt, chgPct}`
4. `applyToUI()` stores formatted data in `window.priceCache[shortName]` and updates DOM:
   - Stocks → ticker bar, watchlist, sector badges
   - Indices → sidebar index cards (NIFTY, SENSEX, BANKNIFTY, DJI, NASDAQ, SGX)
   - Macro → right sidebar macro health grid (USD/INR, Crude, Gold, G-Sec, VIX)
5. `mbFetch()` (every 3 minutes) also feeds ticker data back through `applyToUI()` for additional refreshes

**Refresh:** 5 min interval (`refreshAllLiveData`), 3 min interval (`mbFetch`)

---

## 2. Market Breadth Engine

**What it does:** Real-time market breadth dashboard showing advance/decline, 52-week highs/lows, put-call ratio (PCR), breadth pulse score, index-level A/D breakdown, and top gainers/losers.

**Data Flow:**
1. `mbFetch()` calls `WORKER_URL/api/dashboard` every 3 minutes
2. Worker endpoint (worker.js `handleDashboard`):
   - Fetches all stock prices via Yahoo Finance
   - Fetches 52-week highs/lows via Yahoo `quoteSummary` endpoint
   - Fetches NSE PCR via NSE option chain API (with cookie-based auth)
   - Fetches full option chain data (NSE → Strike fallback)
   - Computes `computeMarketBreadth()`: advances (change > +0.2%), declines (change < -0.2%), A/D ratio, new highs/lows
   - Computes `computeMarketPulse()`: weighted composite of VIX score (25%), A/D ratio (30%), index momentum (25%), breadth quality (20%)
   - Returns `{indices, breadth, pulse, pcr, optionChain, stocks, ticker}`
3. Frontend `mbRender()` populates 4 scorecards (A/D, 52W, PCR, Pulse), index A/D bars, gainers/losers tabs, and signal strip
4. Also feeds ticker data back through `applyToUI()` for additional refresh

**Mode switching:** `toggleMarketBreadth()` collapses/expands the panel; on first expand triggers fetch. Tab switcher toggles between breadth view and heatmap view.

**Refresh:** 3 min (while expanded); immediate on first expand

---

## 3. Market Mood Index (MMI)

**What it does:** Gauge showing market sentiment from "Extreme Fear" to "Extreme Greed" based on India VIX levels.

**Data Flow:**
1. `fetchMMI()` calls `WORKER_URL?mmi=1` (worker `handleMMI`)
2. Worker fetches `^INDIAVIX` from Yahoo Finance
3. Maps VIX to MMI score: VIX < 12 → 75 (greed), 12-15 → 65, 15-18 → 50, 18-22 → 35, > 22 → 25 (fear)
4. Frontend renders gauge: SVG arc fill, score number, zone label ("Extreme Fear" through "Extreme Greed"), needle position on gradient bar

**Refresh:** On load, then every 30 minutes

---

## 4. News Headlines Panel

**What it does:** Displays latest Indian market news headlines in the right sidebar news panel and scrolling ticker.

**Data Flow:**
1. **Newsdesk (primary):** `mnpRenderHeadlines('newsdesk')` fires on load and every 5 minutes
   - Fetches `NEWSDESK_URL = WORKER_URL + '?news=1'`
   - Worker (`handleNews`) fetches ET Markets RSS feed, parses via `parseRSSItems()`, returns up to 30 items with `{title, link, description, pubDate, image, category, source}`
2. **RSS fallback:** If worker fails, `mnpFetchRSSFeeds()` iterates 5 RSS feeds (ET Markets, Moneycontrol, Livemint, BS Markets, NSE India) via 3 CORS proxies (allorigins.win, corsproxy.io, codetabs.com)
3. **News ticker:** Separate `fetch(NEWSDESK_URL)` on 3s delay populates `newsdeskData[]` for the scrolling ticker strip at page top

**Refresh:** 5 min (panel), immediate (ticker on initial load)

---

## 5. D.AI — Deep AI Research

**What it does:** Full-screen AI-powered stock research overlay. User enters a query ("Analyze TCS fundamentals"), and the system fetches live prices + macro context + Groq AI analysis.

**Data Flow:**
1. `runQuery(query)` extracts a stock symbol via:
   - Local `extractSymbol()` dictionary (200+ NSE/BSE ticker → short name mappings)
   - If not found, calls `WORKER_URL?search=...` for Yahoo Finance autocomplete
2. Fetches live price via `workerFetch()` for the resolved symbol
3. Builds context from `window.LIVE_MACRO`, `window.mbData` (indices, breadth, pulse, PCR)
4. Calls Groq API (via direct fetch or worker proxy depending on config) with:
   - System prompt containing live macro data, price overrides, and source URLs
   - User query as the analysis question
5. Renders structured analysis: company snapshot, financials, technicals, valuation, verdict

**Data Sources:** Cloudflare Worker (Yahoo Finance prices + search), Groq API (Llama 3.3 70B analysis), local `LIVE_MACRO` + `mbData` for context

**Refresh:** On-demand (user triggers via search input or watchlist click)

---

## 6. FII/DII Institutional Flow Tracker

**What it does:** Tracks Foreign Portfolio Investor (FPI/FII) and Domestic Institutional Investor (DII) net flows in the cash market. Shows historical trends and FPI sectoral allocation.

**Data Flow:**
1. `loadFiiDiiData()` runs on page load and on overlay open
2. **4-tier fallback chain:**
   - Tier 1: Local server `http://localhost:3000/api/history-full` + `/api/data` + `/api/sectors` (5s timeout)
   - Tier 2: MrChartist API `https://fii-diidata.mrchartist.com/api/history-full` + `/api/data` (8s timeout)
   - Tier 3: GitHub raw `https://raw.githubusercontent.com/MrChartist/fii-dii-data/main/data/latest.json` + `history.json` (10s timeout)
   - Tier 4: Worker fallback `WORKER_URL?fiidii=1&full=1`
3. Data stored in `window.fiidiiData = {...latestData, history, sectors}`
4. Home card (main page) shows FII net + DII net with color-coded bar + value
5. Full overlay shows:
   - Date + latest FII/DII net/buy/sell values
   - Cash market + F&O breakdown
   - FPI sectoral allocation chart (rendered via Canvas)
   - Historical trend chart (rendered via Canvas)
6. `checkFIIDII()` (called from `refreshAllLiveData`) uses hourly throttle (localStorage timestamp) to avoid excess calls

**Data Sources:** MrChartist API → GitHub raw → Cloudflare Worker (tiered fallback)
**Refresh:** Page load + on overlay open; daily check from main refresh cycle

---

## 7. DCF Valuation Model

**What it does:** Discounted Cash Flow valuation calculator covering 8 major Indian companies (RELIANCE, TCS, HDFCBANK, INFY, ITC, SBIN, ADANIPORTS, MARUTI). Interactive sliders for growth rate, WACC, terminal value assumptions. Includes Monte Carlo simulation, sensitivity heatmap, and scenario comparison.

**Data Flow:**
1. Hardcoded `dcfData` object contains fundamental data for 8 companies (market cap, P/E, P/B, ROCE, ROE, NPM, D/E, EPS, dividend yield, book value, FCF, debt)
2. Live market prices fetched from `priceCache` (worker data) via `updateDCFDataFromLive()` on overlay open
3. `calculateDCF(inputs)` — pure client-side computation:
   - Projects FCF through high-growth phase (compounding at growth rate)
   - Fade phase: linearly interpolates growth → fade rate over fade years
   - Terminal value: perpetuity method (FCF × (1+g) / (WACC - g)) or exit multiple
   - Discounts to present value using WACC
   - Computes enterprise value → equity value → per-share intrinsic value
4. Renders: intrinsic vs market price, safety margin, implied growth rate (binary search), verdict (undervalued/overvalued)
5. Visualizations (Canvas):
   - `drawDCFChart()`: Projected FCFs + terminal value waterfall
   - `drawDCFPieChart()`: Enterprise value breakdown (PV FCFs vs PV terminal)
   - `drawDCFSensitivity()`: Growth × WACC heatmap
   - `drawDCFScenarios()`: Bull / Base / Bear projections
6. `runMonteCarlo()`: 3000 iterations randomizing growth, WACC, terminal rate (chunked 500/frame)

**Data Sources:** Hardcoded fundamentals, `priceCache` for live prices
**Refresh:** On-demand; real-time updates on slider changes (150ms debounce)

---

## 8. Stock Comparison Tool

**What it does:** Side-by-side comparison of up to 4 stocks across 10 fundamental metrics with radar charts and simulated performance visualization.

**Data Flow:**
1. `openCompare()` fetches live prices then opens overlay
2. `renderCompareChips()` shows selected stocks with colored borders
3. `updateCompare()` builds a comparison table:
   - 10 metrics: Price, Market Cap, P/E, P/B, ROCE, ROE, NPM, D/E, EPS, Dividend Yield
   - Best value per metric highlighted with star
4. Canvas charts: 30-day simulated price, radar (5 metrics), revenue bars, profitability radar

**Data Sources:** Hardcoded `dcfData` fundamentals, `priceCache` for live prices
**Refresh:** On-demand

---

## 9. Watchlist (Persistent)

**What it does:** User-customizable stock watchlist in the left sidebar. Stocks can be added/removed, and each shows live price + change %. Clicking a stock opens D.AI research.

**Data Flow:**
1. `getWatchlist()` reads `localStorage.getItem('dalal_watchlist')` (JSON array of short symbols)
2. Falls back to all `SYMBOLS.stocks` if nothing saved
3. `renderWatchlist()` iterates symbols, reads `priceCache[sym]` for formatted price, renders each as clickable row
4. `addToWatchlist(sym)` / `removeFromWatchlist(sym)` update localStorage + re-render
5. `openStockPicker()` shows overlay with searchable list of all available worker symbols
6. Prices update in-place via `applyToUI()` during normal refresh cycles

**Data Sources:** localStorage (persistence), `priceCache` (live prices via worker)
**Refresh:** On load; prices update every 5 min via normal refresh

---

## 10. Scenario Simulator

**What it does:** Macroeconomic scenario modeling tool. Users adjust 6 sliders (interest rate, oil, inflation, FX, GDP, commodity prices) or select from 5 presets, and the system computes sector impacts + portfolio risk + optional Groq AI analysis.

**Data Flow:**
1. `openScenario()` shows overlay with 6 macro sliders + 5 preset buttons
2. `prefillFromLiveMacro()` optionally fills sliders from `window.LIVE_MACRO` (Alpha Vantage data)
3. `runScenario()`:
   - Computes 12 sector impact scores via correlation matrix (SIM_SECTORS × SIM_ASSETS)
   - Computes portfolio risk: drawdown probability, value change, risk score
4. **With Groq key:** Replaced monkey-patched version sends sector/asset data + live macro context to Groq for AI-generated analysis (headline, assessment, risks, opportunities, RBI response, FII flow projection, timeline)
5. Renders: sector heatmap grid, portfolio risk summary, Groq AI analysis panel (if available)

**Data Sources:** Client-side correlation computation, Alpha Vantage (slider prefill), Groq API (AI analysis)
**Refresh:** On-demand; recomputes on each "Run Scenario" click

---

## 11. Supply Chain Risk Map

**What it does:** Analyzes a company's supply chain dependencies, geospatial risk exposure, and disruption vulnerability. Covers 7 companies with hardcoded data + optional Groq AI generation.

**Data Flow:**
1. `openSupplyChain()` shows overlay with company selector
2. Select company → `scRunAnalysisGroq()` (if Groq key set) or `_baseScRunAnalysis()` (fallback)
3. **Groq path:** Sends company name to Groq → receives JSON with `{suppliers, riskScores, geoExposure, alerts, disruptionScenarios}` → cached in `SC_GROQ_CACHE` (10-min TTL)
4. **Fallback path:** Uses hardcoded `SC_CO_DATA` for 7 companies (RELIANCE, TCS, MARUTI, SUNPHARMA, TATASTEEL, HDFCBANK)
5. Renders: Canvas network diagram, geospatial heatmap, risk score cards, disruption scenario alerts, dependency tree

**Data Sources:** Hardcoded `SC_CO_DATA`, Groq API (generative, cached 10 min)
**Refresh:** On-demand; company selector buttons

---

## 12. Global Indices Globe (D3.js)

**What it does:** 3D interactive globe showing ~50 global equity indices with color-coded markers for performance. Decorative/educational — data is simulated, not real-time.

**Data Flow:**
1. `openGlobeIndices()` loads D3.js v7 + TopoJSON v3 from CDN
2. `gInitD3()` renders orthographic projection globe with:
   - World countries from inline TopoJSON topology
   - Graticules and axis rotation
   - Marker circles for 50+ global indices (price + change%)
3. `gRenderSidebar()` shows searchable/filterable index list
4. `gSimulate()` timer (30s) rotates globe and applies random walk to prices
5. Hover tooltip shows symbol name, price, change %

**Note:** Prices are generated client-side via random walk simulation — NOT real data. The globe is a visual exploration tool.

**Data Sources:** Hardcoded index list, D3.js + TopoJSON CDN
**Refresh:** Auto-rotation every 30s while open

---

## 13. AI Market Summary

**What it does:** Groq-powered daily market summary (NIFTY levels, sector performance, FII/DII, PCR) displayed in the right sidebar.

**Data Flow:**
1. `fetchAISummary()` fires on page load and every 10 minutes
2. Builds context from `window.mbData` (indices, breadth), `window.priceCache`, FII/DII data
3. Calls Groq API with system prompt for Indian market analysis
4. Caches result in `aiSummaryCache` (10-min TTL)
5. Renders in `#aiSummaryContent` as formatted text

**Data Sources:** Groq API, local `mbData` + `priceCache` for context
**Refresh:** 10 min; cached 10 min

---

## 14. Alpha Vantage Macro Dashboard

**What it does:** Tracks US/global macro indicators: USD/INR (FX), WTI Crude, GDP, CPI, Federal Funds Rate.

**Data Flow:**
1. If `ALPHA_VANTAGE_KEY` is set in localStorage, `fetchAlphaVantageMacro()` fires 3s after page load
2. Sequentially fetches 5 endpoints with ~13s gaps (API rate limit: 5 calls/min)
3. Populates `window.LIVE_MACRO = {fx, crude, gdp, cpi, rate}`
4. Updates relevant DOM elements, pre-populates scenario simulator sliders

**Data Sources:** Alpha Vantage API (requires free API key)
**Refresh:** On page load (3s delay); manual via CPI edit

---

## 15. Economic Calendar

**What it does:** Aggregated economic calendar showing macro events (ForexFactory) + earnings dates (Yahoo Finance).

**Data Flow:**
1. Frontend calls `WORKER_URL?calendar=1`
2. Worker parallel-fetches:
   - ForexFactory calendar page → parses HTML for event rows (currency, importance, time)
   - Yahoo Finance earnings calendar → maps symbols to importance levels
3. Returns merged sorted array of `{date, company, type, importance, impactPrediction, currency}`
4. Rendered in the D.AI overlay context

**Data Sources:** Cloudflare Worker (ForexFactory scraper + Yahoo Finance calendar)
**Refresh:** On-demand

---

## 16. API Key Management

**What it does:** Modal for configuring Groq and Alpha Vantage API keys (stored in localStorage).

**Data Flow:**
1. `openGroqModal()` shows overlay with pre-filled inputs from localStorage
2. `saveGroqKeys()` writes to `localStorage` (`dalal_groq_key`, `dalal_av_key`), updates `CONFIG` globals, triggers `fetchAlphaVantageMacro()` if AV key added
3. Keys never sent to any server except their respective API endpoints
4. Groq key button in header shows status indicator (configured/missing)

**Data Sources:** localStorage (read/write)
**Refresh:** On-demand

---

## 17. CPI Edit / Override

**What it does:** Allows manual override of CPI inflation value (persisted to localStorage) for use in macro dashboard and scenario simulator.

**Data Flow:**
1. Clicking CPI card opens `prompt()` for user to enter CPI value (0-30)
2. On save: updates DOM, writes to `localStorage` (`dalal_cpi_value`, `dalal_cpi_date`, `dalal_cpi_timestamp`)
3. `refreshCPI()` runs on page load and calendar month change — optionally uses Groq to auto-fetch latest CPI

**Data Sources:** User input, localStorage, Groq API (auto-fetch)
**Refresh:** On-demand + page load + month change

---

## Data Source Summary

| Feature | Primary API | Fallback(s) | Refresh |
|---------|------------|-------------|---------|
| Prices (stocks/indices/macro) | Worker → Yahoo Finance | — | 5 min |
| Market Breadth | Worker `/api/dashboard` | — | 3 min |
| MMI (Market Mood) | Worker `?mmi=1` | — | 30 min |
| News | Worker `?news=1` (RSS) | RSS via CORS proxies | 5 min |
| FII/DII | MrChartist API | GitHub raw → Worker | On open + daily |
| DCF | Hardcoded data | — | On demand |
| Scenario | Client-side correlation | Groq AI (optional) | On demand |
| Supply Chain | Hardcoded data | Groq AI (optional) | On demand |
| Globe | Hardcoded (simulated) | — | 30s rotation |
| Macros (AV) | Alpha Vantage | — | On page load |
| AI Summary | Groq API | — | 10 min |
| Calendar | Worker (ForexFactory + Yahoo) | — | On demand |
| Watchlist | localStorage | — | On change |
