const router = require('express').Router();
const fetch = require('node-fetch');
const { URL } = require('url');

// ── Verified Telegram public channels ────────────────────────────────────────
const TELEGRAM_CHANNELS = {
  // Telugu
  eenadu:            ['eenaduepaper', 'eenadu_epaper', 'EenaduEpaper'],
  sakshi:            ['sakshiepaper', 'sakshi_epaper'],
  andhrajyothy:      ['andhrajyothyepaper', 'ajepaper'],
  namaste_telangana: ['namasttelanganaepaper', 'namasthetelangana'],
  telangana_today:   ['telanganatoday_epaper', 'telanganatoday'],
  vaartha:           ['vaarthaepaper', 'vaartha_news'],
  andhra_bhoomi:     ['andhrabhoomiepaper', 'andhra_bhoomi'],
  prajasakti:        ['prajasaktiepaper', 'prajasakti_epaper'],
  suryaa:            ['suryaaepaper', 'suryaa_epaper'],
  visalaandhra:      ['visalaandhra_epaper', 'visalaandhra'],
  // Hindi
  dainik_jagran:     ['jagranepaper', 'dainikjagran_epaper'],
  dainik_bhaskar:    ['bhaskarnewspaper', 'dainikbhaskar_epaper'],
  amar_ujala:        ['amarujalaepaper', 'amar_ujala_epaper'],
  navbharat_times:   ['navbharattimesepaper', 'nbt_epaper'],
  hindustan_hindi:   ['hindustanepaper', 'hindustan_epaper'],
  rajasthan_patrika: ['patrikaepaper', 'rajasthanpatrika_epaper'],
  nai_dunia:         ['naiduniaepaper', 'naidunia_epaper'],
  haribhoomi:        ['haribhoomiepaper', 'haribhoomi_epaper'],
  punjab_kesari:     ['punjabkesariepaper', 'punjabkesari_epaper'],
  // English
  times_of_india:    ['toiepaper', 'timesofindiaepaper'],
  the_hindu:         ['thehinduepaper', 'thehindu_epaper'],
  indian_express:    ['indianexpressepaper', 'ie_epaper'],
  hindustan_times:   ['hindustantimesepaper', 'ht_epaper'],
  deccan_herald:     ['deccanheraldepaper', 'dh_epaper'],
  new_indian_express:['nieepaper', 'newindianexpress_epaper'],
  economic_times:    ['economictimesepaper', 'et_epaper'],
  the_tribune:       ['tribuneepaper', 'tribune_epaper'],
  the_pioneer:       ['pioneerepaper', 'pioneer_epaper'],
};

// ── Direct epaper PDF/image URLs (known working) ─────────────────────────────
const DIRECT_EPAPER_URLS = {
  eenadu:            (dd, mm, yyyy) => `https://epaper.eenadu.net/Home/GetAllpages?editionid=1&editiondate=${dd}/${mm}/${yyyy}`,
  sakshi:            (dd, mm, yyyy) => `https://epaper.sakshi.com/Home/GetDefaultFirstpagesListServiceDynamic?currenteditiondate=${dd}/${mm}/${yyyy}`,
  andhrajyothy:      (dd, mm, yyyy) => `https://epaper.andhrajyothy.com/Home/GetDefaultFirstpagesListServiceDynamic?currenteditiondate=${dd}/${mm}/${yyyy}`,
  amar_ujala:        (dd, mm, yyyy) => `https://epaper.amarujala.com/svww_index1.php?Iss_dt=${dd}-${mm}-${yyyy}`,
};

const PAPER_DISPLAY_NAME = {
  eenadu: 'Eenadu', sakshi: 'Sakshi', andhrajyothy: 'Andhra Jyothy',
  namaste_telangana: 'Namasthe Telangana', telangana_today: 'Telangana Today', vaartha: 'Vaartha',
  andhra_bhoomi: 'Andhra Bhoomi', prajasakti: 'Prajasakti', suryaa: 'Suryaa', visalaandhra: 'Visala Andhra',
  dainik_jagran: 'Dainik Jagran', dainik_bhaskar: 'Dainik Bhaskar', amar_ujala: 'Amar Ujala',
  navbharat_times: 'Navbharat Times', hindustan_hindi: 'Live Hindustan', rajasthan_patrika: 'Rajasthan Patrika',
  nai_dunia: 'Nai Dunia', haribhoomi: 'Haribhoomi', punjab_kesari: 'Punjab Kesari',
  times_of_india: 'Times of India', the_hindu: 'The Hindu', indian_express: 'Indian Express',
  hindustan_times: 'Hindustan Times', deccan_herald: 'Deccan Herald', new_indian_express: 'New Indian Express',
  economic_times: 'Economic Times', the_tribune: 'The Tribune', the_pioneer: 'The Pioneer',
};

const PAPER_LANGUAGE = {
  eenadu: 'te', sakshi: 'te', andhrajyothy: 'te', namaste_telangana: 'te', telangana_today: 'te',
  vaartha: 'te', andhra_bhoomi: 'te', prajasakti: 'te', suryaa: 'te', visalaandhra: 'te',
  dainik_jagran: 'hi', dainik_bhaskar: 'hi', amar_ujala: 'hi', navbharat_times: 'hi',
  hindustan_hindi: 'hi', rajasthan_patrika: 'hi', nai_dunia: 'hi', haribhoomi: 'hi', punjab_kesari: 'hi',
  times_of_india: 'en', the_hindu: 'en', indian_express: 'en', hindustan_times: 'en',
  deccan_herald: 'en', new_indian_express: 'en', economic_times: 'en', the_tribune: 'en', the_pioneer: 'en',
};

// ── Helper: parse date ────────────────────────────────────────────────────────
function parseDateParts(date) {
  const d = date ? new Date(date) : new Date();
  return {
    dd:   String(d.getDate()).padStart(2, '0'),
    mm:   String(d.getMonth() + 1).padStart(2, '0'),
    yyyy: String(d.getFullYear()),
    iso:  d.toISOString().split('T')[0],
  };
}

// ── Helper: fetch with retries and optional headers ──────────────────────────
async function fetchWithRetry(url, opts = {}, retries = 2, backoff = 500) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, opts);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return res;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, backoff * (i + 1)));
    }
  }
}

function makeHeadersForUrl(url) {
  try {
    const u = new URL(url);
    // site-specific referer/user-agent adjustments
    const host = u.hostname.replace(/^www\./, '');
    const common = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' };
    if (host.includes('eenadu')) return { ...common, Referer: 'https://epaper.eenadu.net/' };
    if (host.includes('sakshi')) return { ...common, Referer: 'https://epaper.sakshi.com/' };
    if (host.includes('andhrajyothy')) return { ...common, Referer: 'https://epaper.andhrajyothy.com/' };
    if (host.includes('amarujala')) return { ...common, Referer: 'https://epaper.amarujala.com/' };
    return common;
  } catch {
    return { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' };
  }
}

// ── Source 1: Telegram public web preview ────────────────────────────────────
async function fetchTelegram(channels, date) {
  const { iso } = parseDateParts(date);
  const dateVariants = [iso, iso.replace(/-/g, ''), iso.replace(/-/g, '.')];

  for (const channel of channels) {
    try {
      const url = `https://t.me/s/${channel}`;
      const res = await fetchWithRetry(url, { headers: makeHeadersForUrl(url), timeout: 10000 }, 2, 400);
      if (!res.ok) continue;
      const html = await res.text();

      const imgs = new Set();
      // background-image style URLs
      const bgRe = /background-image:\s*url\(['"]?(https:\/\/cdn\d*\.telegram[^'"\)]+)['"]?\)/g;
      let m;
      while ((m = bgRe.exec(html)) !== null) imgs.add(m[1]);
      // direct img src
      const srcRe = /<img[^>]+src=["'](https:\/\/cdn\d*\.telegram[^"']+)["']/g;
      while ((m = srcRe.exec(html)) !== null) imgs.add(m[1]);

      if (imgs.size === 0) continue;

      const all = [...imgs];
      // prefer images from the requested date
      const dated = all.filter(u => dateVariants.some(v => u.includes(v)));
      const result = dated.length > 0 ? dated : all.slice(-8); // latest posts
      return { source: `Telegram @${channel}`, images: result.slice(0, 10) };
    } catch { continue; }
  }
  return null;
}

// ── Source 2: GNews API — search for epaper images ───────────────────────────
async function fetchGNewsEpaper(paperName, date, language = 'en') {
  if (!process.env.GNEWS_API_KEY) return null;
  try {
    const { iso } = parseDateParts(date);
    const params = new URLSearchParams({
      q: `"${paperName}" epaper today`,
      lang: language,
      country: 'in',
      max: '5',
      from: iso,
      apikey: process.env.GNEWS_API_KEY,
    });
    const url = `https://gnews.io/api/v4/search?${params}`;
    const res = await fetchWithRetry(url, { headers: makeHeadersForUrl(url), timeout: 10000 }, 2, 400);
    if (!res.ok) return null;
    const data = await res.json();
    const articles = (data.articles || []).filter(a => a.image);
    if (!articles.length) return null;
    return {
      source: 'GNews API',
      images: articles.map(a => a.image),
      articles: articles.map(a => ({ title: a.title, url: a.url, image: a.image })),
    };
  } catch { return null; }
}

// ── Source 3: NewsCatcher API ─────────────────────────────────────────────────
async function fetchNewsCatcherEpaper(paperName, date, language = 'en') {
  if (!process.env.NEWSCATCHER_API_KEY) return null;
  try {
    const { iso } = parseDateParts(date);
    const params = new URLSearchParams({
      q: `"${paperName}" epaper`,
      countries: 'IN',
      languages: language,
      page_size: '5',
      from: iso,
      sort_by: 'date',
    });
    const res = await fetch(`https://api.newscatcherapi.com/v2/search?${params}`, {
      headers: { 'x-api-key': process.env.NEWSCATCHER_API_KEY },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const articles = (data.articles || []).filter(a => a.media);
    if (!articles.length) return null;
    return {
      source: 'NewsCatcher API',
      images: articles.map(a => a.media),
      articles: articles.map(a => ({ title: a.title, url: a.link, image: a.media })),
    };
  } catch { return null; }
}

// ── Source 4: NewsAPI.org ─────────────────────────────────────────────────────
async function fetchNewsAPIEpaper(paperName, date) {
  if (!process.env.NEWS_API_KEY) return null;
  try {
    const { iso } = parseDateParts(date);
    const params = new URLSearchParams({
      q: `"${paperName}" epaper`,
      from: iso,
      sortBy: 'publishedAt',
      pageSize: '5',
      apiKey: process.env.NEWS_API_KEY,
    });
    const res = await fetch(`https://newsapi.org/v2/everything?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    const articles = (data.articles || []).filter(a => a.urlToImage && a.title !== '[Removed]');
    if (!articles.length) return null;
    return {
      source: 'NewsAPI',
      images: articles.map(a => a.urlToImage),
      articles: articles.map(a => ({ title: a.title, url: a.url, image: a.urlToImage })),
    };
  } catch { return null; }
}

// ── Source 5: MediaStack ──────────────────────────────────────────────────────
async function fetchMediaStackEpaper(paperName, date, language = 'en') {
  if (!process.env.MEDIASTACK_API_KEY) return null;
  try {
    const { iso } = parseDateParts(date);
    const params = new URLSearchParams({
      access_key: process.env.MEDIASTACK_API_KEY,
      keywords: `${paperName} epaper`,
      countries: 'in',
      languages: language,
      date: iso,
      limit: '5',
      sort: 'published_desc',
    });
    const res = await fetch(`http://api.mediastack.com/v1/news?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    const articles = (data.data || []).filter(a => a.image);
    if (!articles.length) return null;
    return {
      source: 'MediaStack',
      images: articles.map(a => a.image),
      articles: articles.map(a => ({ title: a.title, url: a.url, image: a.image })),
    };
  } catch { return null; }
}

// ── Source 6: The Guardian API ──────────────────────────────────────────────────
async function fetchGuardianEpaper(paperName, date) {
  if (!process.env.GUARDIAN_API_KEY) return null;
  try {
    const { iso } = parseDateParts(date);
    const params = new URLSearchParams({
      q: `"${paperName}" epaper`,
      'from-date': iso,
      'to-date': iso,
      'show-fields': 'thumbnail,trailText',
      'page-size': '5',
      'api-key': process.env.GUARDIAN_API_KEY,
    });
    const res = await fetch(`https://content.guardianapis.com/search?${params}`);
    if (!res.ok) return null;
    const data = await res.json();
    const articles = (data.response?.results || []).filter(a => a.fields?.thumbnail);
    if (!articles.length) return null;
    return {
      source: 'The Guardian API',
      images: articles.map(a => a.fields.thumbnail),
      articles: articles.map(a => ({ title: a.webTitle, url: a.webUrl, image: a.fields.thumbnail })),
    };
  } catch { return null; }
}

// ── Source 7: Google News RSS ───────────────────────────────────────────────────
function makeAbsoluteUrl(url, baseUrl = 'https://news.google.com') {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('//')) return `https:${url}`;
  try { return new URL(url, baseUrl).href; } catch { return null; }
}

async function fetchGoogleNewsRSSEpaper(paperName, date, language = 'en') {
  const Parser = require('rss-parser');
  const rssParser = new Parser({ timeout: 8000 });
  try {
    const { iso } = parseDateParts(date);
    const query = encodeURIComponent(`${paperName} epaper ${iso}`);
    const langCode = language === 'te' ? 'te' : language === 'hi' ? 'hi' : 'en';
    const url = `https://news.google.com/rss/search?q=${query}&hl=${langCode}-IN&gl=IN&ceid=IN:${langCode}`;
    const feed = await rssParser.parseURL(url);
    const articles = feed.items.slice(0, 5).map(item => ({
      title: item.title?.replace(/ - [^-]+$/, '') || '',
      url: makeAbsoluteUrl(item.link || item.guid || item.id || '', 'https://news.google.com'),
      image: null,
    })).filter(a => a.url);
    if (!articles.length) return null;
    return { source: 'Google News RSS', images: [], articles };
  } catch { return null; }
}

// ── Source 8: Direct RSS feeds ───────────────────────────────────────────────────
const NEWSPAPER_RSS = {
  eenadu: 'https://www.eenadu.net/rss/telugu-news.xml',
  sakshi: 'https://www.sakshi.com/rss/telugu-news.xml',
  andhrajyothy: 'https://www.andhrajyothy.com/rss/top-news.xml',
  namaste_telangana: 'https://www.namasttelangana.com/rss/top-news.xml',
  telangana_today: 'https://telanganatoday.com/feed',
  vaartha: 'https://www.vaartha.com/feed',
  andhra_bhoomi: 'https://www.andhrabhoomi.net/rss/news.xml',
  prajasakti: 'https://www.prajasakti.com/feed',
  suryaa: 'https://www.suryaa.com/feed',
  dainik_jagran: 'https://www.jagran.com/rss/news-national.xml',
  dainik_bhaskar: 'https://www.bhaskar.com/rss-feed/8491/',
  amar_ujala: 'https://www.amarujala.com/rss/breaking-news.xml',
  navbharat_times: 'https://navbharattimes.indiatimes.com/rssfeedstopstories.cms',
  hindustan_hindi: 'https://www.livehindustan.com/rss/national.xml',
  rajasthan_patrika: 'https://www.patrika.com/rss/national-news.xml',
  nai_dunia: 'https://www.naidunia.com/rss/news.xml',
  haribhoomi: 'https://www.haribhoomi.com/feed',
  punjab_kesari: 'https://www.punjabkesari.in/rss/news.xml',
  times_of_india: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
  the_hindu: 'https://www.thehindu.com/news/feeder/default.rss',
  indian_express: 'https://indianexpress.com/feed/',
  hindustan_times: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml',
  deccan_herald: 'https://www.deccanherald.com/rss-feed/national.rss',
  new_indian_express: 'https://www.newindianexpress.com/rss/feeds/online/national.xml',
  economic_times: 'https://economictimes.indiatimes.com/rssfeedstopstories.cms',
  the_tribune: 'https://www.tribuneindia.com/rss/feed',
  the_pioneer: 'https://www.dailypioneer.com/rss.xml',
};

function extractImageFromHtml(html, baseUrl) {
  if (!html) return null;
  const images = [];
  const add = (raw) => {
    if (!raw) return;
    const trimmed = raw.trim();
    if (/^https?:\/\//i.test(trimmed)) images.push(trimmed);
    else if (/^\/\//.test(trimmed)) images.push(`https:${trimmed}`);
    else {
      try { images.push(new URL(trimmed, baseUrl).href); } catch { /* ignore invalid */ }
    }
  };

  const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
  if (og && og[1]) add(og[1]);

  const imgRe = /<img[^>]+(?:src|data-src|data-srcset)=["']([^"']+)["']/ig;
  let m;
  while ((m = imgRe.exec(html)) !== null) add(m[1]);

  const bgRe = /background-image:\s*url\(["']?([^"')]+)["']?\)/ig;
  while ((m = bgRe.exec(html)) !== null) add(m[1]);

  return images.filter(Boolean)[0] || null;
}

async function fetchDirectRSSEpaper(paperId, date) {
  const Parser = require('rss-parser');
  const rssParser = new Parser({ timeout: 8000 });
  const rssUrl = NEWSPAPER_RSS[paperId];
  if (!rssUrl) return null;
  try {
    const feed = await rssParser.parseURL(rssUrl);
    const articles = feed.items.slice(0, 5).map(item => {
      const url = item.link || item.guid || item.id || '';
      const baseUrl = url || rssUrl;
      const imageFromEnclosure = item.enclosure?.url || item['media:content']?.['$']?.url || item['media:thumbnail']?.url || null;
      const imageFromContent = extractImageFromHtml(item['content:encoded'] || item.content || item.description || '', baseUrl);
      return {
        title: item.title || '',
        url,
        image: imageFromEnclosure || imageFromContent || null,
      };
    });
    if (!articles.length) return null;
    const images = articles.map(a => a.image).filter(Boolean);
    return { source: 'Direct RSS', images, articles };
  } catch { return null; }
}

// ── Source 9: Puppeteer scrape ───────────────────────────────────────────────────
async function fetchViaScraper(paperId, paperName, date) {
  try {
    const { scrapeGoogleNews } = require('../services/scraperService');
    const { iso } = parseDateParts(date);
    const results = await scrapeGoogleNews(`${paperName} epaper ${iso} front page`, 5);
    const withImages = results.filter(r => r.urlToImage);
    if (!withImages.length) return null;
    return {
      source: 'Web Scraper',
      images: withImages.map(r => r.urlToImage),
      articles: withImages.map(r => ({ title: r.title, url: r.url, image: r.urlToImage })),
    };
  } catch { return null; }
}

// ── Source 1 (moved here): Direct epaper API ─────────────────────────────────
async function fetchDirectEpaper(paperId, date) {
  const urlFn = DIRECT_EPAPER_URLS[paperId];
  if (!urlFn) return null;
  try {
    const { dd, mm, yyyy } = parseDateParts(date);
    const url = urlFn(dd, mm, yyyy);
    const res = await fetchWithRetry(url, { headers: makeHeadersForUrl(url), timeout: 10000 }, 2, 400);
    if (!res.ok) return null;
    let data = await res.json();
    if (typeof data === 'string') {
      try { data = JSON.parse(data); } catch { /* ignore invalid string */ }
    }
    const pages = Array.isArray(data)
      ? data
      : data && typeof data === 'object'
        ? Object.values(data).flat()
        : [];
    const images = Array.isArray(pages)
      ? pages.map(p => p.HighResolution || p.PageImage || p.ImageUrl).filter(Boolean)
      : [];
    if (!images.length) return null;
    return { source: 'Direct Epaper API', images: images.slice(0, 12) };
  } catch { return null; }
}

// ── Fallback: extract image from article page (og:image or first img) ───────
async function fetchImageFromArticle(url) {
  try {
    const res = await fetch(url, { headers: makeHeadersForUrl(url), timeout: 10000 });
    if (!res.ok) return null;
    const html = await res.text();
    const baseUrl = new URL(url);

    const absoluteUrl = (raw) => {
      if (!raw) return null;
      const trimmed = raw.trim();
      if (/^https?:\/\//i.test(trimmed)) return trimmed;
      if (/^\/\//.test(trimmed)) return `${baseUrl.protocol}${trimmed}`;
      try { return new URL(trimmed, baseUrl).href; } catch { return null; }
    };

    const og = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+itemprop=["']image["'][^>]+content=["']([^"']+)["']/i);
    if (og && og[1]) return absoluteUrl(og[1]);

    const img = html.match(/<img[^>]+(?:src|data-src|data-srcset)=["']([^"']+)["']/i);
    if (img && img[1]) return absoluteUrl(img[1]);

    const bg = html.match(/background-image:\s*url\(["']?([^"')]+)["']?\)/i);
    if (bg && bg[1]) return absoluteUrl(bg[1]);

    return null;
  } catch {
    return null;
  }
}

async function fetchImagesFromArticles(articles, limit = 6) {
  const images = [];
  for (const article of articles.slice(0, limit)) {
    const url = article.url || article.link || article.urlToImage || '';
    if (!url) continue;
    try {
      const image = await fetchImageFromArticle(url);
      if (image) images.push(image);
    } catch { /* ignore per-url failures */ }
    if (images.length >= limit) break;
  }
  return Array.from(new Set(images));
}

// ── Main route: GET /api/epaper/:paperId ─────────────────────────────────────
router.get('/:paperId', async (req, res) => {
  const { paperId } = req.params;
  const { date, paperName } = req.query;
  const name = paperName || PAPER_DISPLAY_NAME[paperId] || paperId;
  const language = PAPER_LANGUAGE[paperId] || 'en';

  // Run all 8 sources in parallel
  const [direct, telegram, gnews, newscatcher, newsapi, mediastack, guardian, rss, googleRss] = await Promise.all([
    fetchDirectEpaper(paperId, date),
    fetchTelegram(TELEGRAM_CHANNELS[paperId] || [], date),
    fetchGNewsEpaper(name, date, language),
    fetchNewsCatcherEpaper(name, date, language),
    fetchNewsAPIEpaper(name, date),
    fetchMediaStackEpaper(name, date, language),
    fetchGuardianEpaper(name, date),
    fetchDirectRSSEpaper(paperId, date),
    fetchGoogleNewsRSSEpaper(name, date, language),
  ]);

  // Priority: Direct API > Telegram > GNews > NewsCatcher > NewsAPI > MediaStack > Guardian > Direct RSS > Google RSS > Scraper
  const result = direct || telegram || gnews || newscatcher || newsapi || mediastack || guardian || rss || googleRss;
  if (result) {
    // If no images but we have article URLs, try to extract images from article pages as a fallback
    if ((result.images || []).length === 0 && (result.articles || []).length > 0) {
      const fallbackImages = await fetchImagesFromArticles(result.articles, 6);
      if (fallbackImages.length > 0) result.images = fallbackImages;
    }
    return res.json(result);
  }

  // Last resort: Puppeteer
  const scraped = await fetchViaScraper(paperId, name, date);
  res.json(scraped || { source: null, images: [], articles: [] });
});

module.exports = router;
