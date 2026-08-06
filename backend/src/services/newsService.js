const fetch = require('node-fetch');
const Parser = require('rss-parser');
const { scrapeGoogleNews } = require('./scraperService');
const rssParser = new Parser({ timeout: 8000 });

// ── Area query map ────────────────────────────────────────────────────────────
const AREA_QUERY_MAP = {
  vizag: 'Visakhapatnam', vijayawada: 'Vijayawada', guntur: 'Guntur',
  tirupati: 'Tirupati', kurnool: 'Kurnool', nellore: 'Nellore',
  rajahmundry: 'Rajahmundry', kakinada: 'Kakinada', eluru: 'Eluru',
  ongole: 'Ongole', kadapa: 'Kadapa', anantapur: 'Anantapur',
  srikakulam: 'Srikakulam', vizianagaram: 'Vizianagaram',
  hyderabad: 'Hyderabad', hyderabad_hitech: 'HiTech City Hyderabad',
  hyderabad_secunderabad: 'Secunderabad Hyderabad',
  warangal: 'Warangal', karimnagar: 'Karimnagar', nizamabad: 'Nizamabad',
  khammam: 'Khammam', nalgonda: 'Nalgonda', adilabad: 'Adilabad',
  delhi: 'New Delhi', noida: 'Noida', gurgaon: 'Gurgaon', faridabad: 'Faridabad',
  lucknow: 'Lucknow', kanpur: 'Kanpur', varanasi: 'Varanasi',
  agra: 'Agra', meerut: 'Meerut',
  jaipur: 'Jaipur', jodhpur: 'Jodhpur', udaipur: 'Udaipur',
  bhopal: 'Bhopal', indore: 'Indore',
  patna: 'Patna', chandigarh: 'Chandigarh', amritsar: 'Amritsar',
  bangalore: 'Bangalore', chennai: 'Chennai', kochi: 'Kochi',
  mumbai: 'Mumbai', pune: 'Pune', ahmedabad: 'Ahmedabad',
  kolkata: 'Kolkata',
  national: 'India', international: 'World',
};

// ── Direct RSS feeds ──────────────────────────────────────────────────────────
const NEWSPAPER_RSS = {
  times_of_india:    'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
  the_hindu:         'https://www.thehindu.com/news/feeder/default.rss',
  indian_express:    'https://indianexpress.com/feed/',
  hindustan_times:   'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml',
  deccan_herald:     'https://www.deccanherald.com/rss-feed/national.rss',
  deccan_chronicle:  'https://www.deccanchronicle.com/rss_feed/',
  new_indian_express:'https://www.newindianexpress.com/rss/feeds/online/national.xml',
  economic_times:    'https://economictimes.indiatimes.com/rssfeedstopstories.cms',
  business_standard: 'https://www.business-standard.com/rss/home_page_top_stories.rss',
  bbc:               'https://feeds.bbci.co.uk/news/world/rss.xml',
  reuters:           'https://feeds.reuters.com/reuters/topNews',
  guardian:          'https://www.theguardian.com/world/rss',
  al_jazeera:        'https://www.aljazeera.com/xml/rss/all.xml',
  cnn:               'http://rss.cnn.com/rss/edition.rss',
  eenadu:            'https://www.eenadu.net/rss/telugu-news.xml',
  sakshi:            'https://www.sakshi.com/rss/telugu-news.xml',
  andhrajyothy:      'https://www.andhrajyothy.com/rss/top-news.xml',
  namaste_telangana: 'https://www.namasttelangana.com/rss/top-news.xml',
  telangana_today:   'https://telanganatoday.com/feed',
  vaartha:           'https://www.vaartha.com/feed',
  great_andhra:      'https://www.greatandhra.com/rss/news.xml',
  andhra_bhoomi:     'https://www.andhrabhoomi.net/rss/news.xml',
  prajasakti:        'https://www.prajasakti.com/feed',
  suryaa:            'https://www.suryaa.com/feed',
  dainik_jagran:     'https://www.jagran.com/rss/news-national.xml',
  dainik_bhaskar:    'https://www.bhaskar.com/rss-feed/8491/',
  amar_ujala:        'https://www.amarujala.com/rss/breaking-news.xml',
  navbharat_times:   'https://navbharattimes.indiatimes.com/rssfeedstopstories.cms',
  hindustan_hindi:   'https://www.livehindustan.com/rss/national.xml',
  rajasthan_patrika: 'https://www.patrika.com/rss/national-news.xml',
  jansatta:          'https://www.jansatta.com/feed/',
  nai_dunia:         'https://www.naidunia.com/rss/news.xml',
  haribhoomi:        'https://www.haribhoomi.com/feed',
  punjab_kesari:     'https://www.punjabkesari.in/rss/news.xml',
};

const NEWSPAPER_NAME_MAP = {
  times_of_india: 'Times of India', the_hindu: 'The Hindu',
  indian_express: 'The Indian Express', hindustan_times: 'Hindustan Times',
  deccan_herald: 'Deccan Herald', deccan_chronicle: 'Deccan Chronicle',
  new_indian_express: 'New Indian Express',
  economic_times: 'Economic Times', business_standard: 'Business Standard',
  bbc: 'BBC News', reuters: 'Reuters', guardian: 'The Guardian',
  al_jazeera: 'Al Jazeera', cnn: 'CNN',
  eenadu: 'Eenadu', sakshi: 'Sakshi', andhrajyothy: 'Andhra Jyothy',
  namaste_telangana: 'Namasthe Telangana', telangana_today: 'Telangana Today',
  vaartha: 'Vaartha', great_andhra: 'Great Andhra',
  andhra_bhoomi: 'Andhra Bhoomi', prajasakti: 'Prajasakti', suryaa: 'Suryaa',
  dainik_jagran: 'Dainik Jagran', dainik_bhaskar: 'Dainik Bhaskar',
  amar_ujala: 'Amar Ujala', hindustan_hindi: 'Hindustan (Hindi)',
  navbharat_times: 'Navbharat Times', rajasthan_patrika: 'Rajasthan Patrika',
  jansatta: 'Jansatta', nai_dunia: 'Nai Dunia',
  haribhoomi: 'Haribhoomi', punjab_kesari: 'Punjab Kesari',
};

const AREA_NATIVE_NAMES = {
  vizag: ['విశాఖపట్నం','విశాఖ','వైజాగ్'], vijayawada: ['విజయవాడ'],
  guntur: ['గుంటూరు'], tirupati: ['తిరుపతి'], kurnool: ['కర్నూలు'],
  nellore: ['నెల్లూరు'], rajahmundry: ['రాజమహేంద్రవరం','రాజమండ్రి'],
  kakinada: ['కాకినాడ'], eluru: ['ఏలూరు'], ongole: ['ఒంగోలు'],
  kadapa: ['కడప'], anantapur: ['అనంతపురం'], srikakulam: ['శ్రీకాకుళం'],
  vizianagaram: ['విజయనగరం'], hyderabad: ['హైదరాబాద్','హైదరాబాద'],
  warangal: ['వరంగల్'], karimnagar: ['కరీంనగర్'], nizamabad: ['నిజామాబాద్'],
  khammam: ['ఖమ్మం'], nalgonda: ['నల్గొండ'], adilabad: ['ఆదిలాబాద్'],
  delhi: ['दिल्ली','नई दिल्ली'], noida: ['नोएडा'],
  gurgaon: ['गुरुग्राम','गुड़गांव'], lucknow: ['लखनऊ'], kanpur: ['कानपुर'],
  varanasi: ['वाराणसी','बनारस'], agra: ['आगरा'], meerut: ['मेरठ'],
  jaipur: ['जयपुर'], jodhpur: ['जोधपुर'], udaipur: ['उदयपुर'],
  bhopal: ['भोपाल'], indore: ['इंदौर'], patna: ['पटना'],
  mumbai: ['मुंबई'], pune: ['पुणे'],
};

const GOOGLE_LANG = { en: 'en', hi: 'hi', te: 'te' };

const NEWSPAPER_GOOGLE_QUERY = {
  eenadu: 'Eenadu', sakshi: 'Sakshi', andhrajyothy: 'Andhra Jyothy',
  namaste_telangana: 'Namasthe Telangana', telangana_today: 'Telangana Today',
  vaartha: 'Vaartha', great_andhra: 'Great Andhra',
  andhra_bhoomi: 'Andhra Bhoomi', prajasakti: 'Prajasakti', suryaa: 'Suryaa',
  dainik_jagran: 'Dainik Jagran', dainik_bhaskar: 'Dainik Bhaskar',
  amar_ujala: 'Amar Ujala', hindustan_hindi: 'Hindustan',
  navbharat_times: 'Navbharat Times', rajasthan_patrika: 'Rajasthan Patrika',
  jansatta: 'Jansatta', nai_dunia: 'Nai Dunia',
  haribhoomi: 'Haribhoomi', punjab_kesari: 'Punjab Kesari',
  times_of_india: 'Times of India', the_hindu: 'The Hindu',
  indian_express: 'Indian Express', hindustan_times: 'Hindustan Times',
  deccan_herald: 'Deccan Herald', deccan_chronicle: 'Deccan Chronicle',
  new_indian_express: 'New Indian Express',
  economic_times: 'Economic Times', business_standard: 'Business Standard',
  bbc: 'BBC News', reuters: 'Reuters', guardian: 'The Guardian',
  al_jazeera: 'Al Jazeera', cnn: 'CNN',
};

// ── Date helpers ──────────────────────────────────────────────────────────────
// Normalise any publishedAt value to a YYYY-MM-DD string in IST (UTC+5:30).
// Handles ISO strings, RFC-2822 strings, and already-formatted YYYY-MM-DD values.
function toISTDateStr(publishedAt) {
  if (!publishedAt) return '';
  // Already a plain date string — treat as-is (no timezone shift needed)
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(publishedAt).trim())) return String(publishedAt).trim();
  const d = new Date(publishedAt);
  if (isNaN(d.getTime())) return '';
  // Shift to IST = UTC + 5h 30m
  const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

// Strict date filter — keeps only articles whose IST publish date matches selectedDate.
function filterByDate(articles, selectedDate) {
  if (!selectedDate) return articles;
  return articles.filter(a => {
    const d = toISTDateStr(a.publishedAt);
    return d === selectedDate;
  });
}

// Today's date in IST as YYYY-MM-DD
function todayIST() {
  return toISTDateStr(new Date().toISOString());
}

function googleNewsRSS(query, lang = 'en') {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${lang}-IN&gl=IN&ceid=IN:${lang}`;
}

// ── API: GNews (100 req/day, supports hi/te, has `from` date param) ───────────
async function fetchFromGNews({ query, language = 'en', country = 'in', max = 20, fromDate } = {}) {
  if (!process.env.GNEWS_API_KEY) return [];
  try {
    const params = new URLSearchParams({
      q: query || 'India',
      lang: language,
      country,
      max: String(max),
      apikey: process.env.GNEWS_API_KEY,
    });
    if (fromDate) {
      params.set('from', `${fromDate}T00:00:00Z`);
      params.set('to',   `${fromDate}T23:59:59Z`);
    }
    const res = await fetch(`https://gnews.io/api/v4/search?${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.articles || []).map(a => ({
      title: a.title || '',
      description: a.description || '',
      url: a.url || '',
      urlToImage: a.image || null,
      publishedAt: a.publishedAt || '',
      source: { name: a.source?.name || 'GNews' },
    }));
  } catch { return []; }
}

// ── API: NewsAPI.org (100 req/day, English only, ~1 month history) ────────────
async function fetchFromNewsAPI({ query, language = 'en', fromDate } = {}) {
  if (!process.env.NEWS_API_KEY) return [];
  try {
    const params = new URLSearchParams({
      q: query || 'India',
      sortBy: 'publishedAt',
      pageSize: '20',
      apiKey: process.env.NEWS_API_KEY,
    });
    const supported = ['en','ar','de','es','fr','it','nl','no','pt','ru','sv','zh'];
    if (supported.includes(language)) params.set('language', language);
    if (fromDate) {
      params.set('from', fromDate);
      params.set('to',   fromDate);
    }
    const res = await fetch(`https://newsapi.org/v2/everything?${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.articles || []).filter(a => a.title && a.title !== '[Removed]');
  } catch { return []; }
}

// ── API: The Guardian (500 req/day, English, supports from-date/to-date) ──────
async function fetchFromGuardian({ query, pageSize = 20, fromDate } = {}) {
  if (!process.env.GUARDIAN_API_KEY) return [];
  try {
    const params = new URLSearchParams({
      q: query || 'India',
      'page-size': String(pageSize),
      'order-by': 'newest',
      'show-fields': 'trailText,thumbnail',
      'api-key': process.env.GUARDIAN_API_KEY,
    });
    if (fromDate) {
      params.set('from-date', fromDate);
      params.set('to-date',   fromDate);
    }
    const res = await fetch(`https://content.guardianapis.com/search?${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.response?.results || []).map(a => ({
      title: a.webTitle || '',
      description: a.fields?.trailText || '',
      url: a.webUrl || '',
      urlToImage: a.fields?.thumbnail || null,
      publishedAt: a.webPublicationDate || '',
      source: { name: 'The Guardian' },
    }));
  } catch { return []; }
}

// ── API: MediaStack (500 req/month, supports date param) ─────────────────────
async function fetchFromMediaStack({ keywords, languages = 'en', countries = 'in', limit = 20, fromDate } = {}) {
  if (!process.env.MEDIASTACK_API_KEY) return [];
  try {
    const params = new URLSearchParams({
      access_key: process.env.MEDIASTACK_API_KEY,
      keywords: keywords || 'India',
      languages,
      countries,
      limit: String(limit),
      sort: 'published_desc',
    });
    if (fromDate) params.set('date', fromDate);
    const res = await fetch(`http://api.mediastack.com/v1/news?${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).map(a => ({
      title: a.title || '',
      description: a.description || '',
      url: a.url || '',
      urlToImage: a.image || null,
      publishedAt: a.published_at || '',
      source: { name: a.source || 'MediaStack' },
    }));
  } catch { return []; }
}

// ── API: NewsCatcher (100 req/day, supports from param) ──────────────────────
async function fetchFromNewsCatcher({ query, language = 'en', countries = 'IN', pageSize = 20, fromDate } = {}) {
  if (!process.env.NEWSCATCHER_API_KEY) return [];
  try {
    const params = new URLSearchParams({
      q: query || 'India',
      lang: language,
      countries,
      page_size: String(pageSize),
      sort_by: 'date',
    });
    if (fromDate) params.set('from', fromDate);
    const res = await fetch(`https://api.newscatcherapi.com/v2/search?${params}`, {
      headers: { 'x-api-key': process.env.NEWSCATCHER_API_KEY },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.articles || []).map(a => ({
      title: a.title || '',
      description: a.summary || '',
      url: a.link || '',
      urlToImage: a.media || null,
      publishedAt: a.published_date || '',
      source: { name: a.clean_url || 'NewsCatcher' },
    }));
  } catch { return []; }
}

// ── RSS: Direct newspaper feed ───────────────────────────────────────────────
// For today: return all items. For a past date: filter by that date.
async function fetchFromRSS(newspaper, area, fromDate) {
  const url = NEWSPAPER_RSS[newspaper];
  if (!url) return [];
  try {
    const feed = await rssParser.parseURL(url);
    let items = feed.items.slice(0, 100).map(item => ({
      title: item.title || '',
      description: item.contentSnippet || item.summary || '',
      url: item.link || '',
      urlToImage: item.enclosure?.url || item['media:content']?.['$']?.url || null,
      publishedAt: item.pubDate || item.isoDate || '',
      source: { name: NEWSPAPER_NAME_MAP[newspaper] || newspaper },
    }));
    // Apply date filter if requested
    if (fromDate) {
      const dated = items.filter(a => toISTDateStr(a.publishedAt) === fromDate);
      if (dated.length > 0) items = dated;
      else return []; // RSS has no items for that date
    }
    const areaName = area && AREA_QUERY_MAP[area];
    if (areaName && area !== 'national' && area !== 'international') {
      const terms = [areaName.toLowerCase(), ...(AREA_NATIVE_NAMES[area] || [])];
      const filtered = items.filter(a => {
        const text = (a.title + ' ' + a.description).toLowerCase();
        return terms.some(t => text.includes(t.toLowerCase()));
      });
      if (filtered.length > 0) items = filtered;
    }
    return items.slice(0, 20);
  } catch { return []; }
}

// ── RSS: Google News RSS ─────────────────────────────────────────────────────
async function fetchFromGoogleNews(newspaper, area, language, fromDate) {
  const paperQuery = NEWSPAPER_GOOGLE_QUERY[newspaper];
  if (!paperQuery) return [];
  const areaName = area && area !== 'national' && area !== 'international' && AREA_QUERY_MAP[area]
    ? ` ${AREA_QUERY_MAP[area]}` : '';
  const lang = GOOGLE_LANG[language] || 'en';
  try {
    const feed = await rssParser.parseURL(googleNewsRSS(`${paperQuery}${areaName}`, lang));
    let items = feed.items.slice(0, 50).map(item => ({
      title: item.title?.replace(/ - [^-]+$/, '') || '',
      description: item.contentSnippet || item.summary || '',
      url: item.link || '',
      urlToImage: null,
      publishedAt: item.pubDate || item.isoDate || '',
      source: { name: NEWSPAPER_NAME_MAP[newspaper] || paperQuery },
    }));
    if (fromDate) {
      const dated = items.filter(a => toISTDateStr(a.publishedAt) === fromDate);
      if (dated.length > 0) items = dated;
      else return [];
    }
    return items.slice(0, 20);
  } catch { return []; }
}

// ── Dedup + merge helpers ─────────────────────────────────────────────────────
function deduplicateArticles(articles) {
  const seen = new Set();
  return articles.filter(a => {
    const key = (a.url || '') + '|' + (a.title || '').slice(0, 60);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// Score article relevance: prefer items with image, description, and matching date
function scoreArticle(a, fromDate) {
  let score = 0;
  if (a.urlToImage) score += 2;
  if (a.description && a.description.length > 30) score += 1;
  if (fromDate && toISTDateStr(a.publishedAt) === fromDate) score += 5;
  return score;
}

function mergeAndRank(arrays, fromDate) {
  const all = [].concat(...arrays);
  const deduped = deduplicateArticles(all);
  return deduped.sort((a, b) => scoreArticle(b, fromDate) - scoreArticle(a, fromDate));
}

// ── Aggregation: specific newspaper — ALL APIs in parallel ───────────────────
async function fetchByNewspaper(newspaper, area, language, fromDate) {
  const paperName = NEWSPAPER_NAME_MAP[newspaper] || newspaper;
  const areaName  = AREA_QUERY_MAP[area] || 'India';
  const query     = `${paperName} ${areaName}`;
  const msLang    = language === 'te' ? 'te' : language === 'hi' ? 'hi' : 'en';

  // Run all sources in parallel
  const [rss, google, gnews, newsapi, guardian, newscatcher, mediastack] = await Promise.all([
    fetchFromRSS(newspaper, area, fromDate),
    fetchFromGoogleNews(newspaper, area, language, fromDate),
    fetchFromGNews({ query, language, max: 20, fromDate }),
    fetchFromNewsAPI({ query, language, fromDate }),
    language === 'en' ? fetchFromGuardian({ query, pageSize: 20, fromDate }) : Promise.resolve([]),
    fetchFromNewsCatcher({ query, language, pageSize: 20, fromDate }),
    fetchFromMediaStack({ keywords: query, languages: msLang, limit: 20, fromDate }),
  ]);

  // Strictly filter each batch by date before merging
  const filter = arr => fromDate ? filterByDate(arr, fromDate) : arr;
  const merged = mergeAndRank(
    [filter(rss), filter(google), filter(gnews), filter(newsapi),
     filter(guardian), filter(newscatcher), filter(mediastack)],
    fromDate
  );
  return merged.slice(0, 30);
}

// ── Aggregation: area + language + keywords — ALL APIs in parallel ────────────
async function fetchByAreaAndLanguage(area, language, keywords, fromDate) {
  const areaName = AREA_QUERY_MAP[area] || 'India';
  const query = keywords && keywords.length > 0
    ? `(${keywords.slice(0, 3).join(' OR ')}) ${areaName}`
    : areaName;
  const msLang = language === 'te' ? 'te' : language === 'hi' ? 'hi' : 'en';

  // Google News RSS for regional languages
  const googleRSSPromise = (language === 'hi' || language === 'te')
    ? rssParser.parseURL(googleNewsRSS(query, GOOGLE_LANG[language]))
        .then(feed => feed.items.slice(0, 50).map(item => ({
          title: item.title?.replace(/ - [^-]+$/, '') || '',
          description: item.contentSnippet || item.summary || '',
          url: item.link || '',
          urlToImage: null,
          publishedAt: item.pubDate || item.isoDate || '',
          source: { name: item.source?.title || 'Google News' },
        })))
        .catch(() => [])
    : Promise.resolve([]);

  const [googleRSS, gnews, newsapi, guardian, newscatcher, mediastack] = await Promise.all([
    googleRSSPromise,
    fetchFromGNews({ query, language: msLang, max: 20, fromDate }),
    fetchFromNewsAPI({ query, language, fromDate }),
    language === 'en' ? fetchFromGuardian({ query, pageSize: 20, fromDate }) : Promise.resolve([]),
    fetchFromNewsCatcher({ query, language, pageSize: 20, fromDate }),
    fetchFromMediaStack({ keywords: query, languages: msLang, limit: 20, fromDate }),
  ]);

  const filter = arr => fromDate ? filterByDate(arr, fromDate) : arr;
  const merged = mergeAndRank(
    [filter(googleRSS), filter(gnews), filter(newsapi),
     filter(guardian), filter(newscatcher), filter(mediastack)],
    fromDate
  );

  if (merged.length > 0) return merged.slice(0, 30);

  // Last resort: Puppeteer scrape (live only)
  if (!fromDate) return scrapeGoogleNews(query, 20);
  return [];
}

// ── Recommendations (always live) ────────────────────────────────────────────
async function fetchRecommendations(keywords, area, language) {
  if (!keywords || keywords.length === 0) return [];
  const areaName = AREA_QUERY_MAP[area] || 'India';
  const query = `(${keywords.slice(0, 3).join(' OR ')}) ${areaName}`;
  const msLang = language === 'te' ? 'te' : language === 'hi' ? 'hi' : 'en';

  const [gnews, googleRSS, newscatcher, guardian, newsapi] = await Promise.all([
    fetchFromGNews({ query, language: msLang, max: 10 }),
    rssParser.parseURL(googleNewsRSS(query, GOOGLE_LANG[language] || 'en'))
      .then(feed => feed.items.slice(0, 10).map(item => ({
        title: item.title?.replace(/ - [^-]+$/, '') || '',
        description: item.contentSnippet || '',
        url: item.link || '',
        urlToImage: null,
        publishedAt: item.pubDate || item.isoDate || '',
        source: { name: item.source?.title || 'Google News' },
      })))
      .catch(() => []),
    fetchFromNewsCatcher({ query, language, pageSize: 10 }),
    language === 'en' ? fetchFromGuardian({ query, pageSize: 10 }) : Promise.resolve([]),
    fetchFromNewsAPI({ query, language }),
  ]);

  return mergeAndRank([gnews, googleRSS, newscatcher, guardian, newsapi], null).slice(0, 10);
}

module.exports = {
  fetchFromNewsAPI,
  fetchFromGNews,
  fetchFromMediaStack,
  fetchFromNewsCatcher,
  fetchFromGuardian,
  fetchFromRSS,
  fetchByNewspaper,
  fetchByAreaAndLanguage,
  fetchRecommendations,
  filterByDate,
  deduplicateArticles,
  scoreArticle,
  toISTDateStr,
  AREA_QUERY_MAP,
  NEWSPAPER_NAME_MAP,
};
