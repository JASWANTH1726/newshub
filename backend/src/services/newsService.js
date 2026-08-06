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
function toISTDateStr(publishedAt) {
  if (!publishedAt) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(String(publishedAt).trim())) return String(publishedAt).trim();
  const d = new Date(publishedAt);
  if (isNaN(d.getTime())) return '';
  const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
  return ist.toISOString().slice(0, 10);
}

function filterByDate(articles, selectedDate) {
  if (!selectedDate) return articles;
  return articles.filter(a => toISTDateStr(a.publishedAt) === selectedDate);
}

// Smart date filter: exact → ±1 day → closest available → all results
// Ensures we ALWAYS return something when articles exist
function smartDateFilter(articles, selectedDate) {
  if (!selectedDate || !articles.length) return articles;

  // 1. Exact match
  const exact = articles.filter(a => toISTDateStr(a.publishedAt) === selectedDate);
  if (exact.length >= 3) return exact;

  // 2. ±1 day window (catches timezone edge cases and near-date results)
  const sel = new Date(selectedDate + 'T00:00:00Z');
  const window1 = articles.filter(a => {
    const d = toISTDateStr(a.publishedAt);
    if (!d) return false;
    return Math.abs(new Date(d + 'T00:00:00Z') - sel) <= 86400000;
  });
  if (window1.length >= 3) return window1;

  // 3. ±3 day window
  const window3 = articles.filter(a => {
    const d = toISTDateStr(a.publishedAt);
    if (!d) return false;
    return Math.abs(new Date(d + 'T00:00:00Z') - sel) <= 3 * 86400000;
  });
  if (window3.length >= 3) return window3;

  // 4. Return all available articles sorted by proximity to selected date
  return articles
    .filter(a => toISTDateStr(a.publishedAt))
    .sort((a, b) => {
      const da = Math.abs(new Date(toISTDateStr(a.publishedAt) + 'T00:00:00Z') - sel);
      const db = Math.abs(new Date(toISTDateStr(b.publishedAt) + 'T00:00:00Z') - sel);
      return da - db;
    });
}

function googleNewsRSS(query, lang = 'en') {
  return `https://news.google.com/rss/search?q=${encodeURIComponent(query)}&hl=${lang}-IN&gl=IN&ceid=IN:${lang}`;
}

// ── API: GNews ────────────────────────────────────────────────────────────────
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

// ── API: NewsAPI.org ──────────────────────────────────────────────────────────
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

// ── API: The Guardian ─────────────────────────────────────────────────────────
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

// ── API: MediaStack ───────────────────────────────────────────────────────────
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

// ── API: NewsData.io (200 req/day, supports hi/te, country=in, date filter) ──
async function fetchFromNewsData({ query, language = 'en', fromDate } = {}) {
  if (!process.env.NEWSDATA_API_KEY) return [];
  try {
    const params = new URLSearchParams({
      apikey: process.env.NEWSDATA_API_KEY,
      q: query || 'India',
      country: 'in',
      language,
    });
    if (fromDate) {
      params.set('from_date', fromDate);
      params.set('to_date',   fromDate);
    }
    const res = await fetch(`https://newsdata.io/api/1/news?${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map(a => ({
      title: a.title || '',
      description: a.description || a.content || '',
      url: a.link || '',
      urlToImage: a.image_url || null,
      publishedAt: a.pubDate || '',
      source: { name: a.source_id || 'NewsData' },
    }));
  } catch { return []; }
}

// ── API: Currents API (600 req/day, 60+ languages, date filter) ───────────────
async function fetchFromCurrents({ query, language = 'en', fromDate } = {}) {
  if (!process.env.CURRENTS_API_KEY) return [];
  try {
    const params = new URLSearchParams({
      apiKey: process.env.CURRENTS_API_KEY,
      keywords: query || 'India',
      language,
    });
    if (fromDate) {
      params.set('start_date', `${fromDate} 00:00:00`);
      params.set('end_date',   `${fromDate} 23:59:59`);
    }
    const res = await fetch(`https://api.currentsapi.services/v1/search?${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.news || []).map(a => ({
      title: a.title || '',
      description: a.description || '',
      url: a.url || '',
      urlToImage: a.image !== 'None' ? a.image : null,
      publishedAt: a.published || '',
      source: { name: a.author || 'Currents' },
    }));
  } catch { return []; }
}

// ── API: TheNewsAPI (100 req/day, categories + date range) ────────────────────
async function fetchFromTheNewsAPI({ query, language = 'en', fromDate } = {}) {
  if (!process.env.THENEWSAPI_KEY) return [];
  try {
    const params = new URLSearchParams({
      api_token: process.env.THENEWSAPI_KEY,
      search: query || 'India',
      language,
      limit: '20',
      sort: 'published_at',
    });
    if (fromDate) {
      params.set('published_after',  `${fromDate}T00:00:00`);
      params.set('published_before', `${fromDate}T23:59:59`);
    }
    const res = await fetch(`https://api.thenewsapi.com/v1/news/all?${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.data || []).map(a => ({
      title: a.title || '',
      description: a.description || '',
      url: a.url || '',
      urlToImage: a.image_url || null,
      publishedAt: a.published_at || '',
      source: { name: a.source || 'TheNewsAPI' },
    }));
  } catch { return []; }
}

// ── API: World News API (1000 req/day, date range, multi-language) ────────────
async function fetchFromWorldNews({ query, language = 'en', fromDate } = {}) {
  if (!process.env.WORLD_NEWS_API_KEY) return [];
  try {
    const params = new URLSearchParams({
      'api-key': process.env.WORLD_NEWS_API_KEY,
      text: query || 'India',
      language,
      number: '20',
      sort: 'publish-time',
      'sort-direction': 'DESC',
    });
    if (fromDate) {
      params.set('earliest-publish-date', `${fromDate} 00:00:00`);
      params.set('latest-publish-date',   `${fromDate} 23:59:59`);
    }
    const res = await fetch(`https://api.worldnewsapi.com/search-news?${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.news || []).map(a => ({
      title: a.title || '',
      description: a.text ? a.text.slice(0, 200) : '',
      url: a.url || '',
      urlToImage: a.image || null,
      publishedAt: a.publish_date || '',
      source: { name: a.source_country || 'WorldNews' },
    }));
  } catch { return []; }
}

// ── API: NewsCatcher ──────────────────────────────────────────────────────────
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

// ── RSS: Google News RSS (all languages including English) ────────────────────
async function fetchFromGoogleNewsRSS(query, language) {
  const lang = GOOGLE_LANG[language] || 'en';
  try {
    const feed = await rssParser.parseURL(googleNewsRSS(query, lang));
    return feed.items.slice(0, 50).map(item => ({
      title: item.title?.replace(/ - [^-]+$/, '') || '',
      description: item.contentSnippet || item.summary || '',
      url: item.link || '',
      urlToImage: null,
      publishedAt: item.pubDate || item.isoDate || '',
      source: { name: item.source?.title || 'Google News' },
    }));
  } catch { return []; }
}

// ── RSS: Direct newspaper feed ────────────────────────────────────────────────
async function fetchFromRSS(newspaper, area) {
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
    const areaName = area && AREA_QUERY_MAP[area];
    if (areaName && area !== 'national' && area !== 'international') {
      const terms = [areaName.toLowerCase(), ...(AREA_NATIVE_NAMES[area] || [])];
      const filtered = items.filter(a => {
        const text = (a.title + ' ' + a.description).toLowerCase();
        return terms.some(t => text.includes(t.toLowerCase()));
      });
      if (filtered.length > 0) items = filtered;
    }
    return items.slice(0, 30);
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
  const paperGoogleQuery = NEWSPAPER_GOOGLE_QUERY[newspaper]
    ? `${NEWSPAPER_GOOGLE_QUERY[newspaper]} ${areaName !== 'India' ? areaName : ''}`.trim()
    : query;

  const [rss, googleRSS, gnews, newsapi, guardian, newscatcher, mediastack,
         newsdata, currents, thenews, worldnews] = await Promise.all([
    fetchFromRSS(newspaper, area),
    fetchFromGoogleNewsRSS(paperGoogleQuery, language),
    fetchFromGNews({ query, language, max: 20, fromDate }),
    fetchFromNewsAPI({ query, language, fromDate }),
    language === 'en' ? fetchFromGuardian({ query, pageSize: 20, fromDate }) : Promise.resolve([]),
    fetchFromNewsCatcher({ query, language, pageSize: 20, fromDate }),
    fetchFromMediaStack({ keywords: query, languages: msLang, limit: 20, fromDate }),
    fetchFromNewsData({ query, language, fromDate }),
    fetchFromCurrents({ query, language, fromDate }),
    fetchFromTheNewsAPI({ query, language, fromDate }),
    fetchFromWorldNews({ query, language, fromDate }),
  ]);

  const merged = mergeAndRank(
    [rss, googleRSS, gnews, newsapi, guardian, newscatcher, mediastack,
     newsdata, currents, thenews, worldnews],
    fromDate
  );
  return smartDateFilter(merged, fromDate).slice(0, 30);
}

// ── Aggregation: area + language + keywords — ALL APIs in parallel ────────────
async function fetchByAreaAndLanguage(area, language, keywords, fromDate) {
  const areaName = AREA_QUERY_MAP[area] || 'India';
  const query = keywords && keywords.length > 0
    ? `(${keywords.slice(0, 3).join(' OR ')}) ${areaName}`
    : areaName;
  const msLang = language === 'te' ? 'te' : language === 'hi' ? 'hi' : 'en';

  const [googleRSS, gnews, newsapi, guardian, newscatcher, mediastack,
         newsdata, currents, thenews, worldnews] = await Promise.all([
    fetchFromGoogleNewsRSS(query, language),
    fetchFromGNews({ query, language: msLang, max: 20, fromDate }),
    fetchFromNewsAPI({ query, language, fromDate }),
    language === 'en' ? fetchFromGuardian({ query, pageSize: 20, fromDate }) : Promise.resolve([]),
    fetchFromNewsCatcher({ query, language, pageSize: 20, fromDate }),
    fetchFromMediaStack({ keywords: query, languages: msLang, limit: 20, fromDate }),
    fetchFromNewsData({ query, language, fromDate }),
    fetchFromCurrents({ query, language, fromDate }),
    fetchFromTheNewsAPI({ query, language, fromDate }),
    fetchFromWorldNews({ query, language, fromDate }),
  ]);

  const merged = mergeAndRank(
    [googleRSS, gnews, newsapi, guardian, newscatcher, mediastack,
     newsdata, currents, thenews, worldnews],
    fromDate
  );

  const results = smartDateFilter(merged, fromDate);
  if (results.length > 0) return results.slice(0, 30);

  if (!fromDate) return scrapeGoogleNews(query, 20);
  return [];
}

// ── Recommendations (always live) ────────────────────────────────────────────
async function fetchRecommendations(keywords, area, language) {
  if (!keywords || keywords.length === 0) return [];
  const areaName = AREA_QUERY_MAP[area] || 'India';
  const query = `(${keywords.slice(0, 3).join(' OR ')}) ${areaName}`;
  const msLang = language === 'te' ? 'te' : language === 'hi' ? 'hi' : 'en';

  const [gnews, googleRSS, newscatcher, guardian, newsapi, newsdata, currents, thenews, worldnews] =
    await Promise.all([
      fetchFromGNews({ query, language: msLang, max: 10 }),
      fetchFromGoogleNewsRSS(query, language),
      fetchFromNewsCatcher({ query, language, pageSize: 10 }),
      language === 'en' ? fetchFromGuardian({ query, pageSize: 10 }) : Promise.resolve([]),
      fetchFromNewsAPI({ query, language }),
      fetchFromNewsData({ query, language }),
      fetchFromCurrents({ query, language }),
      fetchFromTheNewsAPI({ query, language }),
      fetchFromWorldNews({ query, language }),
    ]);

  return mergeAndRank([gnews, googleRSS, newscatcher, guardian, newsapi,
    newsdata, currents, thenews, worldnews], null).slice(0, 10);
}

module.exports = {
  fetchFromNewsAPI,
  fetchFromGNews,
  fetchFromMediaStack,
  fetchFromNewsCatcher,
  fetchFromGuardian,
  fetchFromNewsData,
  fetchFromCurrents,
  fetchFromTheNewsAPI,
  fetchFromWorldNews,
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
