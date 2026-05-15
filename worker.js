// @ts-nocheck
// DALAL.AI Worker v9.0 — Yahoo Finance + NSE Option Chain + GROQ AI + Market Positioning
const YAHOO_SYMBOLS = {
  'RELIANCE': 'RELIANCE.NS', 'TCS': 'TCS.NS', 'HDFCBANK': 'HDFCBANK.NS',
  'ICICIBANK': 'ICICIBANK.NS', 'INFY': 'INFY.NS', 'HINDUNILVR': 'HINDUNILVR.NS',
  'ITC': 'ITC.NS', 'SBIN': 'SBIN.NS', 'BHARTIARTL': 'BHARTIARTL.NS',
  'KOTAKBANK': 'KOTAKBANK.NS', 'LT': 'LT.NS', 'HDFC': 'HDFC.NS',
  'AXISBANK': 'AXISBANK.NS', 'ASIANPAINT': 'ASIANPAINT.NS', 'BAJFINANCE': 'BAJFINANCE.NS',
  'SUNPHARMA': 'SUNPHARMA.NS', 'TITAN': 'TITAN.NS', 'WIPRO': 'WIPRO.NS',
  'NESTLEIND': 'NESTLEIND.NS', 'ULTRACEMCO': 'ULTRACEMCO.NS', 'MARUTI': 'MARUTI.NS',
  'TATASTEEL': 'TATASTEEL.NS', 'POWERGRID': 'POWERGRID.NS', 'NTPC': 'NTPC.NS',
  'ONGC': 'ONGC.NS', 'COALINDIA': 'COALINDIA.NS', 'JSWSTEEL': 'JSWSTEEL.NS',
  'TECHM': 'TECHM.NS', 'M&M': 'M&M.NS', 'BAJAJFINSV': 'BAJAJFINSV.NS',
  'ADANIPORTS': 'ADANIPORTS.NS', 'CIPLA': 'CIPLA.NS', 'DRREDDY': 'DRREDDY.NS',
  'EICHERMOTORS': 'EICHERMOT.NS', 'GRASIM': 'GRASIM.NS', 'HCLTECH': 'HCLTECH.NS',
  'HEROMOTOCO': 'HEROMOTOCO.NS', 'HINDZINC': 'HINDZINC.NS', 'IOC': 'IOC.NS',
  'INDUSINDBK': 'INDUSINDBK.NS', 'NMDC': 'NMDC.NS', 'PNB': 'PNB.NS',
  'SBILIFE': 'SBILIFE.NS', 'SHREECEM': 'SHREECEM.NS', 'UPL': 'UPL.NS',
  'VEDL': 'VEDL.NS', 'ADANIENT': 'ADANIENT.NS', 'ADANIGREEN': 'ADANIGREEN.NS',
  'ADANIPOWER': 'ADANIPOWER.NS', 'ADANIENSOL': 'ADANIENSOL.NS',
  'BAJAJHLDNG': 'BAJAJHLDNG.NS', 'BEL': 'BEL.NS', 'BPCL': 'BPCL.NS',
  'BRITANNIA': 'BRITANNIA.NS', 'DABUR': 'DABUR.NS', 'DIVISLAB': 'DIVISLAB.NS',
  'GODREJCP': 'GODREJCP.NS', 'HAVELLS': 'HAVELLS.NS', 'HDFCLIFE': 'HDFCLIFE.NS',
  'JSWENERGY': 'JSWENERGY.NS', 'LICI': 'LICINEW.NS', 'LTIM': 'LTIM.NS',
  'PERSISTENT': 'PERSISTENT.NS', 'PFC': 'PFC.NS', 'PIDILITIND': 'PIDILITIND.NS',
  'SIEMENS': 'SIEMENS.NS', 'TATACONSUM': 'TATACONSUM.NS', 'TRENT': 'TRENT.NS',
  'ZOMATO': 'ZOMATO.NS', 'COLPAL': 'COLPAL.NS',
};
const TICKER_SYMBOLS = [
  { yahoo: 'TCS.NS', name: 'TCS' },
  { yahoo: 'RELIANCE.NS', name: 'RELIANCE' },
  { yahoo: 'HDFCBANK.NS', name: 'HDFCBANK' },
  { yahoo: 'INFY.NS', name: 'INFY' },
  { yahoo: 'WIPRO.NS', name: 'WIPRO' },
  { yahoo: 'ICICIBANK.NS', name: 'ICICIBANK' },
  { yahoo: 'SUNPHARMA.NS', name: 'SUNPHARMA' },
  { yahoo: 'ADANIPORTS.NS', name: 'ADANIPORTS' },
  { yahoo: 'MARUTI.NS', name: 'MARUTI' },
  { yahoo: 'TATAMOTORS.NS', name: 'TATAMOTORS' },
  { yahoo: 'SBIN.NS', name: 'SBIN' },
  { yahoo: 'BAJFINANCE.NS', name: 'BAJFINANCE' },
  { yahoo: 'TITAN.NS', name: 'TITAN' },
  { yahoo: 'ONGC.NS', name: 'ONGC' },
  { yahoo: 'LTIM.NS', name: 'LTIM' },
  { yahoo: '^NSEI', name: 'NIFTY' },
  { yahoo: '^BSESN', name: 'SENSEX' },
  { yahoo: '^NSEBANK', name: 'BANKNIFTY' },
  { yahoo: '^DJI', name: 'DJI' },
  { yahoo: '^IXIC', name: 'NASDAQ' },
  { yahoo: 'USDINR=X', name: 'USDINR' },
  { yahoo: 'BZ=F', name: 'CRUDE' },
  { yahoo: 'GC=F', name: 'GOLD' },
  { yahoo: 'IN10Y=X', name: 'GSEC' },
  { yahoo: '^INDIAVIX', name: 'VIX' },
];
const NEWS_FEED_CONFIGS = [
  { id: 'et-markets', name: 'ET Markets', url: 'https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms', category: 'Markets', color: '#1A73E8' },
];
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};
const num = (v) => {
  if (v === null || v === undefined) return null;
  const n = parseFloat(String(v).replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
};
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
async function yahooFetch(symbol, options = {}) {
  const { retries = 2 } = options;
  for (let i = 0; i <= retries; i++) {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=10d`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DalalAI/1.0)', 'Accept': 'application/json' },
        cf: { cacheTtl: 30, cacheEverything: true }
      });
      if (res.status === 429) { await delay(1000 * (i + 1)); continue; }
      if (!res.ok) return null;
      const data = await res.json();
      const result = data?.chart?.result?.[0];
      if (!result) return null;
      const meta = result.meta;
      const quote = result.indicators?.quote?.[0];
      const closes = (quote?.close || []).filter(c => c !== null && c !== undefined);
      const price = meta.regularMarketPrice;
      let prevClose = null;
      if (closes.length >= 2) {
        prevClose = closes[closes.length - 2];
      } else {
        prevClose = meta.chartPreviousClose || meta.regularMarketPreviousClose || price;
      }
      const change = price - prevClose;
      const changePct = prevClose && prevClose !== 0 ? ((price - prevClose) / prevClose) * 100 : 0;
      return {
        symbol, price, prevClose, change, changePct,
        chgAmt: change, chgPct: changePct,
        dayHigh: meta.regularMarketDayHigh,
        dayLow: meta.regularMarketDayLow,
        volume: meta.regularMarketVolume,
        closes,
      };
    } catch (e) {
      if (i === retries) return null;
      await delay(500);
    }
  }
  return null;
}
async function yahooQuoteSummary(symbol, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=summaryDetail,defaultKeyStatistics`;
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DalalAI/1.0)', 'Accept': 'application/json' },
        cf: { cacheTtl: 3600, cacheEverything: true }
      });
      if (res.status === 429) { await delay(1000 * (i + 1)); continue; }
      if (!res.ok) return null;
      const data = await res.json();
      const r = data?.quoteSummary?.result?.[0];
      if (!r) return null;
      const sum = r.summaryDetail || {};
      const stats = r.defaultKeyStatistics || {};
      return {
        symbol,
        fiftyTwoWeekHigh: num(sum.fiftyTwoWeekHigh?.raw ?? stats.fiftyTwoWeekHigh?.raw),
        fiftyTwoWeekLow: num(sum.fiftyTwoWeekLow?.raw ?? stats.fiftyTwoWeekLow?.raw),
      };
    } catch (e) {
      if (i === retries) return null;
      await delay(500);
    }
  }
  return null;
}
async function batchFetch(symbols, batchSize = 5, delayMs = 150) {
  const results = [];
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(s => yahooFetch(s)));
    results.push(...batchResults);
    if (i + batchSize < symbols.length) await delay(delayMs);
  }
  return results;
}
async function batchQuoteSummary(symbols, batchSize = 3, delayMs = 200) {
  const results = [];
  for (let i = 0; i < symbols.length; i += batchSize) {
    const batch = symbols.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(s => yahooQuoteSummary(s)));
    results.push(...batchResults);
    if (i + batchSize < symbols.length) await delay(delayMs);
  }
  return results;
}
function parseRSSItems(xml, feedConfig) {
  const items = [];
  const itemMatches = xml.match(/<item[^>]*>[\s\S]*?<\/item>/g) || [];
  for (const item of itemMatches.slice(0, 8)) {
    const getTag = (tag) => {
      const m = item.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\/${tag}>`));
      if (m) return m[1];
      const m2 = item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\/${tag}>`));
      return m2 ? m2[1].replace(/<!\[CDATA\[/g, '').replace(/\]\]>/g, '').trim() : '';
    };
    const getAttr = (tag, attr) => {
      const m = item.match(new RegExp(`<${tag}[^>]*${attr}="([^"]*)"`));
      return m ? m[1] : '';
    };
    const title = getTag('title');
    if (title && title.length > 5) {
      // Extract image from media:content or enclosure
      let image = '';
      const mediaMatch = item.match(/<media:content[^>]*url="([^"]+)"/);
      if (mediaMatch) image = mediaMatch[1];
      if (!image) image = getAttr('enclosure', 'url');
      // Extract source from <source> element (Google News includes it)
      const gnSource = getTag('source');
      const sourceName = gnSource || feedConfig.name;
      const desc = getTag('description').replace(/<[^>]+>/g, '').substring(0, 300);
      items.push({
        id: feedConfig.id + '-' + items.length,
        title: title.trim().replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"'),
        link: getTag('link').trim(),
        description: desc.replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
        pubDate: getTag('pubDate'),
        image,
        category: feedConfig.category,
        source: { id: feedConfig.id, name: sourceName, color: feedConfig.color },
      });
    }
  }
  return items;
}
// NSE Cookie cache
let nseCookieCache = null;
let nseCookieTime = 0;
const NSE_COOKIE_TTL = 5 * 60 * 1000;

async function fetchNSEHeaders() {
  if (nseCookieCache && (Date.now() - nseCookieTime) < NSE_COOKIE_TTL) {
    return nseCookieCache;
  }
  
  try {
    const homeRes = await fetch('https://www.nseindia.com/', {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
      },
      cf: { cacheTtl: 300 }
    });
    
    const cookies = [];
    homeRes.headers.forEach((value, key) => {
      if (key.toLowerCase() === 'set-cookie') {
        cookies.push(value.split(';')[0]);
      }
    });
    const cookieStr = cookies.join('; ');
    
    await fetch('https://www.nseindia.com/api/marketStatus', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.nseindia.com/',
        'Cookie': cookieStr,
        'X-Requested-With': 'XMLHttpRequest',
      },
      cf: { cacheTtl: 60 }
    });
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.nseindia.com/',
      'Cookie': cookieStr,
      'X-Requested-With': 'XMLHttpRequest',
    };
    
    nseCookieCache = { headers, cookieStr };
    nseCookieTime = Date.now();
    return nseCookieCache;
  } catch (e) {
    return {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
        'Referer': 'https://www.nseindia.com/',
      }
    };
  }
}

async function fetchNSEData(path, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      const { headers } = await fetchNSEHeaders();
      const res = await fetch('https://www.nseindia.com' + path, { 
        headers, 
        cf: { cacheTtl: 60 } 
      });
      
      if (res.status === 401 || res.status === 403) {
        nseCookieCache = null;
        nseCookieTime = 0;
        if (i < retries) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        continue;
      }
      
      if (!res.ok) {
        if (i < retries) {
          await new Promise(r => setTimeout(r, 500 * (i + 1)));
          continue;
        }
        return null;
      }
      
      return await res.json();
    } catch (e) {
      if (i < retries) {
        await new Promise(r => setTimeout(r, 500 * (i + 1)));
        continue;
      }
      return null;
    }
  }
  return null;
}
async function fetchNSEPCR() {
  try {
    const data = await fetchNSEData('/api/option-chain-indices?symbol=NIFTY');
    if (!data) return { pcr: null, error: 'NSE unavailable' };
    const records = data?.records?.data || [];
    let totalCallOI = 0, totalPutOI = 0;
    for (const rec of records) {
      totalCallOI += num(rec.ce?.openInterest) || 0;
      totalPutOI += num(rec.pe?.openInterest) || 0;
    }
    const pcr = totalPutOI > 0 ? totalCallOI / totalPutOI : null;
    return { pcr: pcr !== null ? parseFloat(pcr.toFixed(3)) : null, timestamp: data?.records?.timestamp || new Date().toISOString() };
  } catch (e) {
    return { pcr: null, error: e.message };
  }
}
async function fetchOptionChainFull() {
  // Try NSE first
  try {
    const data = await fetchNSEData('/api/option-chain-indices?symbol=NIFTY');
    if (data && data.records?.data?.length > 0) {
      return processOptionChainData(data);
    }
  } catch (e) { /* try fallback */ }
  
  // Try alternative: NSE equity option chain (different endpoint)
  try {
    const data = await fetchNSEData('/api/option-chain-equities?symbol=NIFTY');
    if (data && data.records?.data?.length > 0) {
      return processOptionChainData(data);
    }
  } catch (e) { /* try next fallback */ }
  
  // Try alternative from Strike API (public, no auth needed)
  try {
    const strikeRes = await fetch('https://strike-options-api.vercel.app/api/chain?symbol=NIFTY', {
      headers: { 'Accept': 'application/json' },
      cf: { cacheTtl: 60 }
    });
    if (strikeRes.ok) {
      const strikeData = await strikeRes.json();
      if (strikeData && strikeData.records?.data?.length > 0) {
        return processOptionChainData(strikeData);
      }
    }
  } catch (e) { /* last fallback */ }
  
  // Try Strike Finance API
  try {
    const strikeFinRes = await fetch('https://api.strike.finance/v1/option-chain/NIFTY', {
      headers: { 'Accept': 'application/json' },
      cf: { cacheTtl: 60 }
    });
    if (strikeFinRes.ok) {
      const sData = await strikeFinRes.json();
      if (sData) {
        return processOptionChainFromStrike(sData);
      }
    }
  } catch (e) { /* give up */ }
  
  return { available: false, error: 'NSE option chain blocked by firewall. Data available only during market hours (9:15 AM - 3:30 PM IST)' };
}

function processOptionChainData(data) {
  const records = data?.records?.data || [];
  if (records.length === 0) return { available: false, error: 'No option chain data' };

  const spotPrice = num(data?.records?.underlyingValue) || null;
  let totalCallOI = 0, totalPutOI = 0;
  let totalCallChgOI = 0, totalPutChgOI = 0;
  let maxPECEoi = 0, maxCECEOi = 0;
  let resistanceStrike = null, supportStrike = null;
  let maxPain = 0, maxPainOI = 0;
  const strikes = {};

  for (const rec of records) {
    const ce = rec.ce || {};
    const pe = rec.pe || {};
    const strike = num(rec.strikePrice) || 0;
    const ceOI = num(ce.openInterest) || 0;
    const peOI = num(pe.openInterest) || 0;
    const ceChgOI = num(ce.changeinOpenInterest) || 0;
    const peChgOI = num(pe.changeinOpenInterest) || 0;

    totalCallOI += ceOI;
    totalPutOI += peOI;
    totalCallChgOI += ceChgOI;
    totalPutChgOI += peChgOI;

    if (peOI > maxPECEoi) { maxPECEoi = peOI; supportStrike = strike; }
    if (ceOI > maxCECEOi) { maxCECEOi = ceOI; resistanceStrike = strike; }

    if (strike > 0) {
      strikes[strike] = (strikes[strike] || 0) + ceOI + peOI;
      if (strikes[strike] > maxPainOI) { maxPainOI = strikes[strike]; maxPain = strike; }
    }
  }

  const pcrOI = totalPutOI > 0 ? totalCallOI / totalPutOI : null;
  const pcrVol = (totalPutChgOI / totalCallChgOI) || null;

  const pcrSignal = pcrOI === null ? 'neutral' : pcrOI > 1.2 ? 'bullish' : pcrOI > 1.0 ? 'cautious_bullish' : pcrOI > 0.7 ? 'neutral' : pcrOI > 0.5 ? 'cautious_bearish' : 'bearish';
  const pcrLabel = pcrOI === null ? 'N/A' : pcrOI.toFixed(2);
  const pcrColor = pcrOI === null ? 'var(--muted)' : pcrOI > 1.1 ? 'var(--green)' : pcrOI < 0.8 ? 'var(--red)' : 'var(--gold)';

  const pcrInterpretation = pcrOI === null ? 'PCR data unavailable' :
    pcrOI > 1.3 ? 'Very high PCR — contrarian bullish signal (oversold)' :
    pcrOI > 1.1 ? 'Elevated PCR — hedging activity elevated, potential reversal' :
    pcrOI > 0.9 ? 'Normal PCR — balanced positioning' :
    pcrOI > 0.7 ? 'Below average PCR — caution warranted' :
    'Very low PCR — complacency signal, bearish warning';

  const netOIChg = totalCallChgOI - totalPutChgOI;
  const buildupSignal = netOIChg > 0 ? 'Short Buildup' : 'Long Buildup';
  const buildupColor = netOIChg > 0 ? 'var(--red)' : 'var(--green)';
  const buildupText = netOIChg > 0
    ? `OI increased by ${Math.abs(netOIChg).toLocaleString()} — bears adding shorts`
    : `OI increased by ${Math.abs(netOIChg).toLocaleString()} — bulls building longs`;

  const oiConcentration = maxPainOI > 0 && (totalCallOI + totalPutOI) > 0
    ? parseFloat(((maxPainOI / (totalCallOI + totalPutOI)) * 100).toFixed(1))
    : 0;

  return {
    available: true,
    underlying: data?.records?.underlying || 'NIFTY',
    spotPrice,
    pcr: { value: pcrOI, volume: pcrVol, label: pcrLabel, color: pcrColor, signal: pcrSignal, interpretation: pcrInterpretation },
    support: supportStrike,
    resistance: resistanceStrike,
    maxPain,
    oiConcentration,
    totalCallOI: Math.round(totalCallOI),
    totalPutOI: Math.round(totalPutOI),
    netOIChg,
    buildupSignal,
    buildupColor,
    buildupText,
    timestamp: data?.records?.timestamp || new Date().toISOString(),
  };
}

function processOptionChainFromStrike(data) {
  const records = data?.data || data?.records?.data || [];
  if (records.length === 0) return { available: false, error: 'No strike data' };
  
  const spotPrice = num(data.underlyingPrice || data.spotPrice) || null;
  let totalCallOI = 0, totalPutOI = 0;
  let totalCallChgOI = 0, totalPutChgOI = 0;
  let maxPECEoi = 0, maxCECEOi = 0;
  let resistanceStrike = null, supportStrike = null;
  let maxPain = 0, maxPainOI = 0;
  const strikes = {};

  for (const rec of records) {
    const ce = rec.ce || rec.call || {};
    const pe = rec.pe || rec.put || {};
    const strike = num(rec.strikePrice || rec.strike) || 0;
    const ceOI = num(ce.openInterest || ce.OI) || 0;
    const peOI = num(pe.openInterest || pe.OI) || 0;
    const ceChgOI = num(ce.changeinOpenInterest || ce.changeOI) || 0;
    const peChgOI = num(pe.changeinOpenInterest || pe.changeOI) || 0;

    totalCallOI += ceOI;
    totalPutOI += peOI;
    totalCallChgOI += ceChgOI;
    totalPutChgOI += peChgOI;

    if (peOI > maxPECEoi) { maxPECEoi = peOI; supportStrike = strike; }
    if (ceOI > maxCECEOi) { maxCECEOi = ceOI; resistanceStrike = strike; }

    if (strike > 0) {
      strikes[strike] = (strikes[strike] || 0) + ceOI + peOI;
      if (strikes[strike] > maxPainOI) { maxPainOI = strikes[strike]; maxPain = strike; }
    }
  }

  const pcrOI = totalPutOI > 0 ? totalCallOI / totalPutOI : null;
  const pcrVol = (totalPutChgOI / totalCallChgOI) || null;
  const pcrSignal = pcrOI === null ? 'neutral' : pcrOI > 1.2 ? 'bullish' : pcrOI > 1.0 ? 'cautious_bullish' : pcrOI > 0.7 ? 'neutral' : pcrOI > 0.5 ? 'cautious_bearish' : 'bearish';
  const pcrLabel = pcrOI === null ? 'N/A' : pcrOI.toFixed(2);
  const pcrColor = pcrOI === null ? 'var(--muted)' : pcrOI > 1.1 ? 'var(--green)' : pcrOI < 0.8 ? 'var(--red)' : 'var(--gold)';
  const pcrInterpretation = pcrOI === null ? 'PCR data unavailable' :
    pcrOI > 1.3 ? 'Very high PCR — contrarian bullish signal (oversold)' :
    pcrOI > 1.1 ? 'Elevated PCR — hedging activity elevated, potential reversal' :
    pcrOI > 0.9 ? 'Normal PCR — balanced positioning' :
    pcrOI > 0.7 ? 'Below average PCR — caution warranted' :
    'Very low PCR — complacency signal, bearish warning';

  const netOIChg = totalCallChgOI - totalPutChgOI;
  const buildupSignal = netOIChg > 0 ? 'Short Buildup' : 'Long Buildup';
  const buildupColor = netOIChg > 0 ? 'var(--red)' : 'var(--green)';
  const buildupText = netOIChg > 0
    ? `OI increased by ${Math.abs(netOIChg).toLocaleString()} — bears adding shorts`
    : `OI increased by ${Math.abs(netOIChg).toLocaleString()} — bulls building longs`;

  const oiConcentration = maxPainOI > 0 && (totalCallOI + totalPutOI) > 0
    ? parseFloat(((maxPainOI / (totalCallOI + totalPutOI)) * 100).toFixed(1))
    : 0;

  return {
    available: true,
    underlying: data.underlying || 'NIFTY',
    spotPrice,
    pcr: { value: pcrOI, volume: pcrVol, label: pcrLabel, color: pcrColor, signal: pcrSignal, interpretation: pcrInterpretation },
    support: supportStrike,
    resistance: resistanceStrike,
    maxPain,
    oiConcentration,
    totalCallOI: Math.round(totalCallOI),
    totalPutOI: Math.round(totalPutOI),
    netOIChg,
    buildupSignal,
    buildupColor,
    buildupText,
    timestamp: data.timestamp || new Date().toISOString(),
  };
}
function computeMarketBreadth(stocks, summaryMap) {
  let advances = 0, declines = 0, unchanged = 0;
  let newHighs = 0, newLows = 0;
  const ADV = 0.2, DEC = -0.2;
  for (const s of stocks) {
    const pct = s.changePct || 0;
    if (pct > ADV) advances++;
    else if (pct < DEC) declines++;
    else unchanged++;
    const summary = summaryMap?.[s.yahooSymbol];
    if (summary) {
      if (summary.fiftyTwoWeekHigh && s.price >= summary.fiftyTwoWeekHigh * 0.998) newHighs++;
      if (summary.fiftyTwoWeekLow && s.price <= summary.fiftyTwoWeekLow * 1.002) newLows++;
    }
  }
  const sorted = [...stocks].sort((a, b) => (b.changePct || 0) - (a.changePct || 0));
  const gainers = sorted.filter(s => (s.changePct || 0) > 0).slice(0, 5);
  const losers = sorted.filter(s => (s.changePct || 0) < 0).slice(-5).reverse();
  const total = advances + declines + unchanged || 1;
  const adRatio = declines > 0 ? parseFloat((advances / declines).toFixed(2)) : advances;
  return { advances, declines, unchanged, total, newHighs, newLows, adRatio, gainers, losers };
}
function computeMarketPulse(breadth, niftyChgPct, vix) {
  const vixScore = clamp(100 - ((vix - 10) / 25) * 100, 0, 100);
  const adScore = breadth.adRatio > 0 ? clamp((breadth.adRatio / (breadth.adRatio + 1)) * 100, 0, 100) : 50;
  const indexScore = clamp(50 + niftyChgPct * 10, 0, 100);
  const breadthQuality = breadth.newHighs > breadth.newLows ? 60 : breadth.newLows > breadth.newHighs ? 40 : 50;
  const pulse = Math.round(vixScore * 0.25 + adScore * 0.30 + indexScore * 0.25 + breadthQuality * 0.20);
  const signal = pulse >= 65 ? 'BULLISH' : pulse >= 45 ? 'NEUTRAL' : 'BEARISH';
  return { pulse, signal, vixScore: Math.round(vixScore), adScore: Math.round(adScore), indexScore: Math.round(indexScore), breadthQuality };
}
async function handleSymbols(symbolsParam, corsHeaders) {
  const syms = symbolsParam.split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
  const ySyms = syms.map(s => YAHOO_SYMBOLS[s] || (s.includes('.') || s.includes('=') || s.includes('^') || s.includes(':') ? s : s + '.NS'));
  const results = await batchFetch(ySyms, 5, 100);
  const output = {};
  for (let i = 0; i < syms.length; i++) {
    const d = results[i];
    if (d) output[syms[i]] = { price: d.price, chgAmt: d.chgAmt, chgPct: d.changePct };
  }
  return new Response(JSON.stringify(output), { headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=30' } });
}
async function handleDashboard(corsHeaders) {
  try {
    const tickerSyms = TICKER_SYMBOLS.map(t => t.yahoo);
    const breadthSyms = Object.values(YAHOO_SYMBOLS).filter(Boolean);
    const timed = (p, ms) => Promise.race([p, new Promise((_,r)=>setTimeout(()=>r(),ms))]);
    const [tickerResults, breadthResults, summaryResults, pcrData, optionChain] = await Promise.all([
      batchFetch(tickerSyms, 5, 100),
      batchFetch(breadthSyms, 5, 150),
      batchQuoteSummary(breadthSyms, 3, 200),
      timed(fetchNSEPCR(), 8000),
      timed(fetchOptionChainFull(), 10000),
    ]);
    const tickerMap = {};
    for (let i = 0; i < TICKER_SYMBOLS.length; i++) {
      if (tickerResults[i]) tickerMap[TICKER_SYMBOLS[i].yahoo] = tickerResults[i];
    }
    const indices = {};
    for (const yahoo of ['^NSEI', '^BSESN', '^NSEBANK', 'USDINR=X', 'BZ=F', 'GC=F', 'IN10Y=X', '^INDIAVIX']) {
      if (tickerMap[yahoo]) indices[yahoo] = tickerMap[yahoo];
    }
    const stockByYahoo = {};
    for (const d of breadthResults) { if (d) stockByYahoo[d.symbol] = d; }
    const stocks = [];
    const summaryMap = {};
    for (const [nseSym, yahooSym] of Object.entries(YAHOO_SYMBOLS)) {
      const d = stockByYahoo[yahooSym];
      if (d) stocks.push({ symbol: nseSym, yahooSymbol: yahooSym, price: d.price, change: d.change, changePct: d.changePct });
    }
    for (const s of summaryResults) { if (s) summaryMap[s.symbol] = s; }
    const breadth = computeMarketBreadth(stocks, summaryMap);
    const nifty = indices['^NSEI'] || {};
    const vix = indices['^INDIAVIX']?.price || 17;
    const pulse = computeMarketPulse(breadth, nifty.changePct || 0, vix);
    return new Response(JSON.stringify({
      ok: true, timestamp: new Date().toISOString(),
      indices, breadth, pulse,
      pcr: pcrData,
      optionChain,
      stocks: stocks.slice(0, 20),
      ticker: tickerMap,
    }), { headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=30' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), { status: 500, headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=15' } });
  }
}
async function handleOptionChain(corsHeaders) {
  const result = await fetchOptionChainFull();
  if (!result.available) {
    return new Response(JSON.stringify({ available: false, error: result.error || 'NSE data unavailable' }), {
      status: 503, headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=60' }
    });
  }
  return new Response(JSON.stringify(result), { headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=60' } });
}
async function handleNews(corsHeaders) {
  try {
    const feedConfig = NEWS_FEED_CONFIGS[0]; // ET Markets
    const res = await fetch(feedConfig.url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'application/rss+xml, application/xml, text/xml, */*' },
      cf: { cacheTtl: 600, cacheEverything: true }
    });
    const xml = res.ok ? await res.text() : '';
    const items = xml ? parseRSSItems(xml, feedConfig) : [];
    return new Response(JSON.stringify({ status: 'ok', items: items.slice(0, 30), count: items.length }), {
      headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=300' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ status: 'error', items: [], count: 0, message: e.message }), {
      headers: corsHeaders
    });
  }
}
async function fetchCalendarFX() {
  try {
    const res = await fetch('https://www.forexfactory.com/calendar', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
      cf: { cacheTtl: 3600, cacheEverything: true }
    });
    if (!res.ok) return [];
    const html = await res.text();
    return parseForexfactoryHTML(html);
  } catch (e) {
    return [];
  }
}

function parseForexfactoryHTML(html) {
  const events = [];
  let currentDate = null;
  const rows = html.split(/<tr\s/);
  for (const row of rows) {
    const dayMatch = row.match(/calendar__row--day-header[^>]*>[\s\S]*?calendar__day-header[^>]*>([^<]+)</);
    if (dayMatch) {
      const raw = dayMatch[1].replace(/<[^>]+>/g, '').trim();
      const d = new Date(raw);
      if (!isNaN(d.getTime())) { currentDate = d; }
      continue;
    }
    if (row.includes('calendar__row--event')) {
      const currency = (row.match(/calendar__currency[^>]*>([^<]+)</) || [])[1] || '';
      let importance = 'LOW';
      if (row.includes('icon--red')) importance = 'HIGH';
      else if (row.includes('icon--orange')) importance = 'MEDIUM';
      const eventName = ((row.match(/calendar__event[^>]*>[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/) || [])[1] || '').trim();
      if (!eventName || !currentDate) continue;
      const timeMatch = row.match(/calendar__time[^>]*>([^<]+)</);
      let eventDate = new Date(currentDate);
      if (timeMatch) {
        const t = timeMatch[1].trim().toLowerCase().replace(/\s/g, '');
        const isPM = t.includes('pm');
        let parts = t.replace(/[ap]m/, '').split(':');
        let h = parseInt(parts[0]) || 0, m = parseInt(parts[1]) || 0;
        if (isPM && h !== 12) h += 12;
        if (!isPM && h === 12) h = 0;
        eventDate.setHours(h, m, 0);
      }
      const impactPred = importance === 'HIGH' ? 'BULLISH' : importance === 'MEDIUM' ? 'NEUTRAL' : null;
      events.push({
        date: eventDate.toISOString(),
        company: eventName,
        type: 'MACRO',
        importance,
        impactPrediction: impactPred,
        currency,
      });
    }
  }
  return events;
}

async function fetchYahooEarnings() {
  try {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    const from = Math.floor(startDate.getTime() / 1000);
    const to = Math.floor(endDate.getTime() / 1000);
    const url = `https://query1.finance.yahoo.com/v1/finance/calendar/earnings?period1=${from}&period2=${to}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DalalAI/1.0)', 'Accept': 'application/json' },
      cf: { cacheTtl: 3600, cacheEverything: true }
    });
    if (!res.ok) return [];
    const data = await res.json();
    const earnings = data?.data?.rows || data?.calendarEvents?.earnings || [];
    return earnings.map(e => ({
      date: e.start || e.earningsDate || e.date || today.toISOString().split('T')[0],
      company: e.symbol || e.ticker || e.name || 'Unknown',
      type: 'EARNINGS',
      importance: estimateImportance(e.symbol || ''),
      eps: e.epsEstimate || e.estimatedEPS || null,
      revenue: e.revenueEstimate || null,
      impactPrediction: null,
    }));
  } catch (e) {
    return [];
  }
}

function estimateImportance(symbol) {
  const highImpact = ['RELIANCE','TCS','HDFCBANK','INFY','ICICIBANK','HINDUNILVR','ITC','SBIN','BHARTIARTL','LT','WIPRO','HCLTECH','ASIANPAINT','AXISBANK','BAJFINANCE','MARUTI','SUNPHARMA','TITAN','NTPC','POWERGRID','KOTAKBANK','ULTRACEMCO','BAJAJFINSV','TATASTEEL','ADANIPORTS','ONGC','NESTLEIND','M&M','JSWSTEEL','TECHM'];
  const medImpact = ['INDUSINDBK','SBILIFE','ICICIPRU','DIVISLAB','EICHERMOT','DRREDDY','CIPLA','GRASIM','SHREECEM','COALINDIA','BRITANNIA','TATACONSUM','HINDALCO','BPCL','IOC','HEROMOTOCO','GAIL','TRENT','DMART','PIDILITIND','DABUR','GODREJCP','HAVELLS','COLPAL','MARICO','BANDHANBNK','PEL','BOSCHLTD','ZOMATO','LICI'];
  if (highImpact.includes(symbol.toUpperCase())) return 'HIGH';
  if (medImpact.includes(symbol.toUpperCase())) return 'MEDIUM';
  return 'LOW';
}

async function handleCalendar(corsHeaders) {
  try {
    const [macroEvents, earningsEvents] = await Promise.all([
      fetchCalendarFX(),
      fetchYahooEarnings(),
    ]);
    const allEvents = [...macroEvents, ...earningsEvents].sort((a, b) => new Date(a.date) - new Date(b.date));
    return new Response(JSON.stringify({ events: allEvents }), {
      headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=1800' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ events: [] }), { headers: corsHeaders });
  }
}

async function handleMMI(corsHeaders) {
  try {
    const vix = await yahooFetch('^INDIAVIX');
    const v = vix?.price || 17;
    let mmi = v < 12 ? 75 : v < 15 ? 65 : v < 18 ? 50 : v < 22 ? 35 : 25;
    return new Response(JSON.stringify({ value: mmi, vix: v }), { headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=300' } });
  } catch (e) {
    return new Response(JSON.stringify({ value: 50, vix: 17 }), { headers: corsHeaders });
  }
}
async function handleFIIDII(corsHeaders) {
  try {
    const data = await fetchNSEData('/api/live-equities?index=NIFTY_50');
    if (!data) throw new Error('NSE unavailable');
    const records = data?.data || [];
    let totalBuyVal = 0, totalSellVal = 0;
    for (const r of records) {
      totalBuyVal += (num(r.totalBuyQuantity) || 0) * (num(r.lastPrice) || 0);
      totalSellVal += (num(r.totalSellQuantity) || 0) * (num(r.lastPrice) || 0);
    }
    const fpiNet = (totalSellVal - totalBuyVal) / 10000000;
    return new Response(JSON.stringify({ fpi_net: fpiNet.toFixed(0), dii_net: null, date: new Date().toLocaleDateString('en-IN') }), {
      headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=300' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ fpi_net: null, dii_net: null, error: e.message }), {
      headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=60' }
    });
  }
}
async function handleGroqAI(body, corsHeaders) {
  try {
    const { apiKey, context } = body || {};
    if (!apiKey) return new Response(JSON.stringify({ error: 'API key required' }), { status: 401, headers: corsHeaders });
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile', max_tokens: 400, temperature: 0.3,
        messages: [
          { role: 'system', content: 'You are DALAL.AI, India premier AI stock market analyst. Be direct, data-driven, and specific.' },
          { role: 'user', content: `Indian market summary:\n${context || 'No data'}\n\n1) Verdict 2) NIFTY levels 3) Sectors 4) FII/DII 5) PCR. Under 200 words.` }
        ]
      })
    });
    if (!res.ok) return new Response(JSON.stringify({ error: `Groq: ${res.status}` }), { status: res.status, headers: corsHeaders });
    const data = await res.json();
    return new Response(JSON.stringify({ summary: data?.choices?.[0]?.message?.content || 'Unavailable', model: 'llama-3.3-70b-versatile', timestamp: new Date().toISOString() }), {
      headers: { ...corsHeaders, 'Cache-Control': 'no-cache' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
}
async function handleTicker(corsHeaders) {
  const syms = TICKER_SYMBOLS.map(t => t.yahoo);
  const results = await batchFetch(syms, 5, 100);
  const output = {};
  for (let i = 0; i < syms.length; i++) { if (results[i]) output[syms[i]] = results[i]; }
  return new Response(JSON.stringify(output), { headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=30' } });
}
async function handleMacro(corsHeaders) {
  try {
    const [vix, nifty] = await Promise.all([yahooFetch('^INDIAVIX'), yahooFetch('^NSEI')]);
    const v = vix?.price || 17;
    let mmi = v < 12 ? 75 : v < 15 ? 65 : v < 18 ? 50 : v < 22 ? 35 : 25;
    return new Response(JSON.stringify({ mmi, vix: v, nifty_chg: nifty?.changePct || 0, timestamp: new Date().toISOString() }), {
      headers: { ...corsHeaders, 'Cache-Control': 'public, max-age=300' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
  }
}
export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
    const url = new URL(request.url);
    const params = url.searchParams;
    if (url.pathname === '/api/dashboard') return handleDashboard(corsHeaders);
    if (url.pathname === '/api/ticker') return handleTicker(corsHeaders);
    if (url.pathname === '/api/macro') return handleMacro(corsHeaders);
    if (url.pathname === '/api/optionchain') return handleOptionChain(corsHeaders);
    if (params.get('symbols')) return handleSymbols(params.get('symbols'), corsHeaders);
    if (params.get('news')) return handleNews(corsHeaders);
    if (params.get('calendar')) return handleCalendar(corsHeaders);
    if (params.get('mmi')) return handleMMI(corsHeaders);
    if (params.get('fiidii')) return handleFIIDII(corsHeaders);
    if (params.get('fpi')) return handleFIIDII(corsHeaders);
    if (params.get('ai') || params.get('groq')) {
      let body = {};
      try { if (request.method === 'POST') body = await request.json(); } catch (e) {}
      return handleGroqAI(body, corsHeaders);
    }
    return new Response(JSON.stringify({ error: 'No route matched', available: ['/api/dashboard', '/api/ticker', '/api/macro', '/api/optionchain', '?symbols=', '?news=1', '?calendar=1', '?mmi=1', '?fiidii=1', '?ai=1'] }), { status: 400, headers: corsHeaders });
  }
};

