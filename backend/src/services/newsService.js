const fetch = require('node-fetch');
const Parser = require('rss-parser');
const { scrapeGoogleNews } = require('./scraperService');
const rssParser = new Parser({ timeout: 8000 });

// ── Area query map (English names for API queries) ──────────────────────────
const AREA_QUERY_MAP = {
  // Andhra Pradesh
  vizag: 'Visakhapatnam', vijayawada: 'Vijayawada', guntur: 'Guntur',
  tirupati: 'Tirupati', kurnool: 'Kurnool', nellore: 'Nellore',
  rajahmundry: 'Rajahmundry', kakinada: 'Kakinada', eluru: 'Eluru',
  ongole: 'Ongole', kadapa: 'Kadapa', anantapur: 'Anantapur',
  srikakulam: 'Srikakulam', vizianagaram: 'Vizianagaram',
  // Telangana
  hyderabad: 'Hyderabad', hyderabad_hitech: 'HiTech City Hyderabad',
  hyderabad_secunderabad: 'Secunderabad Hyderabad',
  warangal: 'Warangal', karimnagar: 'Karimnagar', nizamabad: 'Nizamabad',
  khammam: 'Khammam', nalgonda: 'Nalgonda', adilabad: 'Adilabad',
  // Hindi belt
  delhi: 'New Delhi', noida: 'Noida', gurgaon: 'Gurgaon', faridabad: 'Faridabad',
  lucknow: 'Lucknow', kanpur: 'Kanpur', varanasi: 'Varanasi',
  agra: 'Agra', meerut: 'Meerut',
  jaipur: 'Jaipur', jodhpur: 'Jodhpur', udaipur: 'Udaipur',
  bhopal: 'Bhopal', indore: 'Indore',
  patna: 'Patna', chandigarh: 'Chandigarh', amritsar: 'Amritsar',
  // English metros
  bangalore: 'Bangalore', chennai: 'Chennai', kochi: 'Kochi',
  mumbai: 'Mumbai', pune: 'Pune', ahmedabad: 'Ahmedabad',
  kolkata: 'Kolkata',
  // National / International
  national: 'India', international: 'World',
};

// ── Direct RSS feeds ─────────────────────────────────────────────────────────
const NEWSPAPER_RSS = {
  // English - National
  times_of_india:    'https://timesofindia.indiatimes.com/rssfeedstopstories.cms',
  the_hindu:         'https://www.thehindu.com/news/feeder/default.rss',
  indian_express:    'https://indianexpress.com/feed/',
  hindustan_times:   'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml',
  deccan_herald:     'https://www.deccanherald.com/rss-feed/national.rss',
  deccan_chronicle:  'https://www.deccanchronicle.com/rss_feed/',
  new_indian_express:'https://www.newindianexpress.com/rss/feeds/online/national.xml',
  economic_times:    'https://economictimes.indiatimes.com/rssfeedstopstories.cms',
  business_standard: 'https://www.business-standard.com/rss/home_page_top_stories.rss',
  // English - International
  bbc:               'https://feeds.bbci.co.uk/news/world/rss.xml',
  reuters:           'https://feeds.reuters.com/reuters/topNews',
  guardian:          'https://www.theguardian.com/world/rss',
  al_jazeera:        'https://www.aljazeera.com/xml/rss/all.xml',
  cnn:               'http://rss.cnn.com/rss/edition.rss',
  // Telugu
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
  // Hindi
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
  // English
  times_of_india: 'Times of India', the_hindu: 'The Hindu',
  indian_express: 'The Indian Express', hindustan_times: 'Hindustan Times',
  deccan_herald: 'Deccan Herald', deccan_chronicle: 'Deccan Chronicle',
  new_indian_express: 'New Indian Express',
  economic_times: 'Economic Times', business_standard: 'Business Standard',
  bbc: 'BBC News', reuters: 'Reuters', guardian: 'The Guardian',
  al_jazeera: 'Al Jazeera', cnn: 'CNN',
  // Telugu
  eenadu: 'Eenadu', sakshi: 'Sakshi', andhrajyothy: 'Andhra Jyothy',
  namaste_telangana: 'Namasthe Telangana', telangana_today: 'Telangana Today',
  vaartha: 'Vaartha', great_andhra: 'Great Andhra',
  andhra_bhoomi: 'Andhra Bhoomi', prajasakti: 'Prajasakti', suryaa: 'Suryaa',
  // Hindi
  dainik_jagran: 'Dainik Jagran', dainik_bhaskar: 'Dainik Bhaskar',
  amar_ujala: 'Amar Ujala', hindustan_hindi: 'Hindustan (Hindi)',
  navbharat_times: 'Navbharat Times', rajasthan_patrika: 'Rajasthan Patrika',
  jansatta: 'Jansatta', nai_dunia: 'Nai Dunia',
  haribhoomi: 'Haribhoomi', punjab_kesari: 'Punjab Kesari',
};

// Native script area names for RSS article filtering
const AREA_NATIVE_NAMES = {
  // Telugu
  vizag:         ['విశాఖపట్నం', 'విశాఖ', 'వైజాగ్'],
  vijayawada:    ['విజయవాడ'],
  guntur:        ['గుంటూరు'],
  tirupati:      ['తిరుపతి'],
  kurnool:       ['కర్నూలు'],
  nellore:       ['నెల్లూరు'],
  rajahmundry:   ['రాజమహేంద్రవరం', 'రాజమండ్రి'],
  kakinada:      ['కాకినాడ'],
  eluru:         ['ఏలూరు'],
  ongole:        ['ఒంగోలు'],
  kadapa:        ['కడప'],
  anantapur:     ['అనంతపురం'],
  srikakulam:    ['శ్రీకాకుళం'],
  vizianagaram:  ['విజయనగరం'],
  hyderabad:     ['హైదరాబాద్', 'హైదరాబాద'],
  warangal:      ['వరంగల్'],
  karimnagar:    ['కరీంనగర్'],
  nizamabad:     ['నిజామాబాద్'],
  khammam:       ['ఖమ్మం'],
  nalgonda:      ['నల్గొండ'],
  adilabad:      ['ఆదిలాబాద్'],
  // Hindi
  delhi:         ['दिल्ली', 'नई दिल्ली'],
  noida:         ['नोएडा'],
  gurgaon:       ['गुरुग्राम', 'गुड़गांव'],
  lucknow:       ['लखनऊ'],
  kanpur:        ['कानपुर'],
  varanasi:      ['वाराणसी', 'बनारस'],
  agra:          ['आगरा'],
  meerut:        ['मेरठ'],
  jaipur:        ['जयपुर'],
  jodhpur:       ['जोधपुर'],
  udaipur:       ['उदयपुर'],
  bhopal:        ['भोपाल'],
  indore:        ['इंदौर'],
  patna:         ['पटना'],
  mumbai:        ['मुंबई'],
  pune:          ['पुणे'],
};

// ── Google News RSS (free, no key needed) ────────────────────────────────────
function googleNewsRSS(query, lang = 'en') {
  const encoded = encodeURIComponent(query);
  return `https://news.google.com/rss/search?q=${encoded}&hl=${lang}-IN&gl=IN&ceid=IN:${lang}`;
}

const GOOGLE_LANG = { en: 'en', hi: 'hi', te: 'te' };

const NEWSPAPER_GOOGLE_QUERY = {
  // Telugu
  eenadu: 'Eenadu', sakshi: 'Sakshi', andhrajyothy: 'Andhra Jyothy',
  namaste_telangana: 'Namasthe Telangana', telangana_today: 'Telangana Today',
  vaartha: 'Vaartha', great_andhra: 'Great Andhra',
  andhra_bhoomi: 'Andhra Bhoomi', prajasakti: 'Prajasakti', suryaa: 'Suryaa',
  // Hindi
  dainik_jagran: 'Dainik Jagran', dainik_bhaskar: 'Dainik Bhaskar',
  amar_ujala: 'Amar Ujala', hindustan_hindi: 'Hindustan',
  navbharat_times: 'Navbharat Times', rajasthan_patrika: 'Rajasthan Patrika',
  jansatta: 'Jansatta', nai_dunia: 'Nai Dunia',
  haribhoomi: 'Haribhoomi', punjab_kesari: 'Punjab Kesari',
  // English
  times_of_india: 'Times of India', the_hindu: 'The Hindu',
  indian_express: 'Indian Express', hindustan_times: 'Hindustan Times',
  deccan_herald: 'Deccan Herald', deccan_chronicle: 'Deccan Chronicle',
  new_indian_express: 'New Indian Express',
  economic_times: 'Economic Times', business_standard: 'Business Standard',
  bbc: 'BBC News', reuters: 'Reuters', guardian: 'The Guardian',
  al_jazeera: 'Al Jazeera', cnn: 'CNN',
};

// ── GNews API (100 req/day free) ─────────────────────────────────────────────
async function fetchFromGNews({ query, language = 'en', country = 'in', max = 10 } = {}) {
  if (!process.env.GNEWS_API_KEY) return [];
  try {
    const params = new URLSearchParams({
      q: query || 'India',
      lang: language,
      country,
      max: String(max),
      apikey: process.env.GNEWS_API_KEY,
    });
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
  } catch {
    return [];
  }
}

// ── MediaStack API (500 req/month free) ──────────────────────────────────────
async function fetchFromMediaStack({ keywords, languages = 'en', countries = 'in', limit = 10 } = {}) {
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
  } catch {
    return [];
  }
}

// ── NewsCatcher API (100 req/day free) ──────────────────────────────────────
async function fetchFromNewsCatcher({ query, language = 'en', countries = 'IN', pageSize = 10 } = {}) {
  if (!process.env.NEWSCATCHER_API_KEY) return [];
  try {
    const params = new URLSearchParams({
      q: query || 'India',
      lang: language,
      countries,
      page_size: String(pageSize),
      sort_by: 'date',
    });
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
  } catch {
    return [];
  }
}

// ── The Guardian API (500 req/day free) ───────────────────────────────────────
async function fetchFromGuardian({ query, pageSize = 10 } = {}) {
  if (!process.env.GUARDIAN_API_KEY) return [];
  try {
    const params = new URLSearchParams({
      q: query || 'India',
      'page-size': String(pageSize),
      'order-by': 'newest',
      'show-fields': 'trailText,thumbnail',
      'api-key': process.env.GUARDIAN_API_KEY,
    });
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
  } catch {
    return [];
  }
}

// ── NewsAPI.org ───────────────────────────────────────────────────────────────
async function fetchFromNewsAPI({ query, language = 'en', fromDate } = {}) {
  if (!process.env.NEWS_API_KEY) return [];
  try {
    const params = new URLSearchParams({
      q: query || 'India',
      sortBy: 'publishedAt',
      pageSize: '20',
      apiKey: process.env.NEWS_API_KEY,
    });
    // NewsAPI supports: en, ar, de, es, fr, it, nl, no, pt, ru, sv, zh
    const supported = ['en', 'ar', 'de', 'es', 'fr', 'it', 'nl', 'no', 'pt', 'ru', 'sv', 'zh'];
    if (supported.includes(language)) params.set('language', language);
    if (fromDate) params.set('from', fromDate);

    const res = await fetch(`https://newsapi.org/v2/everything?${params}`);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.articles || []).filter(a => a.title && a.title !== '[Removed]');
  } catch {
    return [];
  }
}

// ── Google News RSS fetch ─────────────────────────────────────────────────────
async function fetchFromGoogleNews(newspaper, area, language) {
  const paperQuery = NEWSPAPER_GOOGLE_QUERY[newspaper];
  if (!paperQuery) return [];
  const areaName = area && area !== 'national' && area !== 'international' && AREA_QUERY_MAP[area]
    ? ` ${AREA_QUERY_MAP[area]}` : '';
  const lang = GOOGLE_LANG[language] || 'en';
  const url = googleNewsRSS(`${paperQuery}${areaName}`, lang);
  try {
    const feed = await rssParser.parseURL(url);
    return feed.items.slice(0, 20).map(item => ({
      title: item.title?.replace(/ - [^-]+$/, '') || '',
      description: item.contentSnippet || item.summary || '',
      url: item.link || '',
      urlToImage: null,
      publishedAt: item.pubDate || item.isoDate || '',
      source: { name: NEWSPAPER_NAME_MAP[newspaper] || paperQuery },
    }));
  } catch {
    return [];
  }
}

// ── Direct RSS fetch ──────────────────────────────────────────────────────────
async function fetchFromRSS(newspaper, area) {
  const url = NEWSPAPER_RSS[newspaper];
  if (!url) return [];
  try {
    const feed = await rssParser.parseURL(url);
    let items = feed.items.slice(0, 50).map(item => ({
      title: item.title || '',
      description: item.contentSnippet || item.summary || '',
      url: item.link || '',
      urlToImage: item.enclosure?.url || item['media:content']?.['$']?.url || null,
      publishedAt: item.pubDate || item.isoDate || '',
      source: { name: NEWSPAPER_NAME_MAP[newspaper] || newspaper },
    }));

    // Filter by area if specific area selected
    const areaName = area && AREA_QUERY_MAP[area];
    if (areaName && area !== 'national' && area !== 'international') {
      const searchTerms = [areaName.toLowerCase(), ...(AREA_NATIVE_NAMES[area] || [])];
      const filtered = items.filter(a => {
        const text = (a.title + ' ' + a.description).toLowerCase();
        return searchTerms.some(term => text.includes(term.toLowerCase()));
      });
      if (filtered.length > 0) items = filtered;
    }

    return items.slice(0, 20);
  } catch {
    return [];
  }
}

// ── Aggregation: newspaper feed ───────────────────────────────────────────────
// Priority: Direct RSS → Google News RSS → GNews API → NewsAPI
async function fetchByNewspaper(newspaper, area, language, fromDate) {
  // 1. Direct RSS
  const rss = await fetchFromRSS(newspaper, area);
  if (rss.length > 0) return rss;

  // 2. Google News RSS (free, no key)
  const google = await fetchFromGoogleNews(newspaper, area, language);
  if (google.length > 0) return google;

  // 3. GNews API (100/day free)
  const paperName = NEWSPAPER_NAME_MAP[newspaper] || newspaper;
  const areaName = AREA_QUERY_MAP[area] || 'India';
  const gnews = await fetchFromGNews({ query: `${paperName} ${areaName}`, language, max: 10 });
  if (gnews.length > 0) return gnews;

  // 4. NewsAPI fallback
  return fetchByAreaAndLanguage(area, language, [], fromDate);
}

// ── Aggregation: area + language + keywords ───────────────────────────────────
// Priority: Google News RSS (for hi/te) → GNews API → MediaStack → NewsAPI
async function fetchByAreaAndLanguage(area, language, keywords, fromDate) {
  const areaName = AREA_QUERY_MAP[area] || 'India';
  const query = keywords && keywords.length > 0
    ? `(${keywords.slice(0, 3).join(' OR ')}) ${areaName}`
    : areaName;

  // For Hindi and Telugu use Google News RSS first (better vernacular coverage)
  if (language === 'hi' || language === 'te') {
    const lang = GOOGLE_LANG[language];
    try {
      const feed = await rssParser.parseURL(googleNewsRSS(query, lang));
      const items = feed.items.slice(0, 20).map(item => ({
        title: item.title?.replace(/ - [^-]+$/, '') || '',
        description: item.contentSnippet || item.summary || '',
        url: item.link || '',
        urlToImage: null,
        publishedAt: item.pubDate || item.isoDate || '',
        source: { name: item.source?.title || 'Google News' },
      }));
      if (items.length > 0) return items;
    } catch { /* fall through */ }
  }

  // GNews API (supports hi, te via lang param)
  const langMap = { en: 'en', hi: 'hi', te: 'te' };
  const gnews = await fetchFromGNews({ query, language: langMap[language] || 'en', max: 20 });
  if (gnews.length > 0) return gnews;

  // MediaStack (good for regional/vernacular)
  const msLang = language === 'te' ? 'te' : language === 'hi' ? 'hi' : 'en';
  const mediastack = await fetchFromMediaStack({ keywords: query, languages: msLang, limit: 20 });
  if (mediastack.length > 0) return mediastack;

  // NewsCatcher (60,000+ sources, country+language filtering)
  const newscatcher = await fetchFromNewsCatcher({ query, language, pageSize: 20 });
  if (newscatcher.length > 0) return newscatcher;

  // The Guardian (English high-quality fallback)
  if (language === 'en') {
    const guardian = await fetchFromGuardian({ query, pageSize: 20 });
    if (guardian.length > 0) return guardian;
  }

  // NewsAPI (English only effectively)
  const newsapi = await fetchFromNewsAPI({ query, language, fromDate });
  if (newsapi.length > 0) return newsapi;

  // Final fallback: Puppeteer scraping
  return scrapeGoogleNews(query, 20);
}

// ── Recommendations ───────────────────────────────────────────────────────────
async function fetchRecommendations(keywords, area, language) {
  if (!keywords || keywords.length === 0) return [];
  const areaName = AREA_QUERY_MAP[area] || 'India';
  const query = `(${keywords.slice(0, 3).join(' OR ')}) ${areaName}`;

  // Try GNews first (best quality free tier)
  const gnews = await fetchFromGNews({ query, language, max: 10 });
  if (gnews.length > 0) return gnews;

  // Google News RSS fallback
  const lang = GOOGLE_LANG[language] || 'en';
  try {
    const feed = await rssParser.parseURL(googleNewsRSS(query, lang));
    const items = feed.items.slice(0, 20).map(item => ({
      title: item.title?.replace(/ - [^-]+$/, '') || '',
      description: item.contentSnippet || '',
      url: item.link || '',
      urlToImage: null,
      publishedAt: item.pubDate || item.isoDate || '',
      source: { name: item.source?.title || 'Google News' },
    }));
    if (items.length > 0) return items;
  } catch { /* fall through */ }

  // NewsCatcher fallback
  const nc = await fetchFromNewsCatcher({ query, language, pageSize: 10 });
  if (nc.length > 0) return nc;

  // Guardian fallback (English only)
  if (language === 'en') {
    const guardian = await fetchFromGuardian({ query, pageSize: 10 });
    if (guardian.length > 0) return guardian;
  }

  const newsapi = await fetchFromNewsAPI({ query, language });
  if (newsapi.length > 0) return newsapi;

  // Final fallback: Puppeteer scraping
  return scrapeGoogleNews(query, 10);
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
  AREA_QUERY_MAP,
  NEWSPAPER_NAME_MAP,
};
