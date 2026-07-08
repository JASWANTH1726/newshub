const router = require('express').Router();
const fetch = require('node-fetch');
const Parser = require('rss-parser');

// ── Telegram channels (verified working) ─────────────────────────────────────
const TELEGRAM_CHANNELS = {
  times_of_india:  ['toi_epaper'],
  hindustan_times: ['hindustantimesepaper', 'HindustanTimes', 'HTdaily'],
  deccan_herald:   ['deccanheraldnews'],
  economic_times:  ['EconomicTimesNews', 'economictimesnews'],
};

// ── Direct free epaper APIs (Telugu papers) ───────────────────────────────────
const DIRECT_EPAPER_URLS = {
  eenadu:          (dd, mm, yyyy) => `https://epaper.eenadu.net/Home/GetAllpages?editionid=1&editiondate=${dd}/${mm}/${yyyy}&IsMag=0`,
  sakshi:          (dd, mm, yyyy) => `https://epaper.sakshi.com/Home/GetDefaultFirstpagesListServiceDynamic?currenteditiondate=${dd}/${mm}/${yyyy}`,
  andhrajyothy:    (dd, mm, yyyy) => `https://epaper.andhrajyothy.com/Home/GetDefaultFirstpagesListServiceDynamic?currenteditiondate=${dd}/${mm}/${yyyy}`,
  visalaandhra:    (dd, mm, yyyy) => `https://epaper.visalaandhra.com/Home/GetDefaultFirstpagesListServiceDynamic?currenteditiondate=${dd}/${mm}/${yyyy}`,
};

// ── RSS feeds (for article-list papers) ──────────────────────────────────────
const PAPER_RSS = {
  namaste_telangana:  'https://www.namasttelangana.com/rss/top-news.xml',
  telangana_today:    'https://telanganatoday.com/feed',
  vaartha:            'https://www.vaartha.com/feed',
  andhra_bhoomi:      'https://www.andhrabhoomi.net/rss/news.xml',
  prajasakti:         'https://www.prajasakti.com/feed',
  suryaa:             'https://www.suryaa.com/feed',
  dainik_jagran:      'https://www.jagran.com/rss/news-national.xml',
  dainik_bhaskar:     'https://www.bhaskar.com/rss-feed/8491/',
  amar_ujala:         'https://www.amarujala.com/rss/breaking-news.xml',
  navbharat_times:    'https://navbharattimes.indiatimes.com/rssfeedstopstories.cms',
  hindustan_hindi:    'https://www.livehindustan.com/rss/national.xml',
  rajasthan_patrika:  'https://www.patrika.com/rss/national-news.xml',
  nai_dunia:          'https://www.naidunia.com/rss/news.xml',
  haribhoomi:         'https://www.haribhoomi.com/feed',
  punjab_kesari:      'https://www.punjabkesari.in/rss/news.xml',
  the_hindu:          'https://www.thehindu.com/news/feeder/default.rss',
  indian_express:     'https://indianexpress.com/feed/',
  new_indian_express: 'https://www.newindianexpress.com/rss/feeds/online/national.xml',
  the_tribune:        'https://www.tribuneindia.com/rss/feed',
  the_pioneer:        'https://www.dailypioneer.com/rss.xml',
};

const PAPER_EPAPER_URL = {
  eenadu:             'https://epaper.eenadu.net',
  sakshi:             'https://epaper.sakshi.com',
  andhrajyothy:       'https://epaper.andhrajyothy.com',
  namaste_telangana:  'https://epaper.namasttelangana.com',
  telangana_today:    'https://epaper.telanganatoday.com',
  vaartha:            'https://www.vaartha.com',
  andhra_bhoomi:      'https://epaper.andhrabhoomi.net',
  prajasakti:         'https://www.prajasakti.com',
  suryaa:             'https://www.suryaa.com',
  visalaandhra:       'https://epaper.visalaandhra.com',
  dainik_jagran:      'https://epaper.jagran.com',
  dainik_bhaskar:     'https://epaper.bhaskar.com',
  amar_ujala:         'https://epaper.amarujala.com',
  navbharat_times:    'https://epaper.navbharattimes.com',
  hindustan_hindi:    'https://epaper.livehindustan.com',
  rajasthan_patrika:  'https://epaper.patrika.com',
  nai_dunia:          'https://epaper.naidunia.com',
  haribhoomi:         'https://www.haribhoomi.com',
  punjab_kesari:      'https://epaper.punjabkesari.in',
  times_of_india:     'https://epaper.timesofindiagroup.com',
  the_hindu:          'https://epaper.thehindu.com',
  indian_express:     'https://epaper.indianexpress.com',
  hindustan_times:    'https://epaper.hindustantimes.com',
  deccan_herald:      'https://epaper.deccanherald.com',
  new_indian_express: 'https://epaper.newindianexpress.com',
  economic_times:     'https://epaper.economictimes.com',
  the_tribune:        'https://epaper.tribuneindia.com',
  the_pioneer:        'https://epaper.dailypioneer.com',
};

function parseDateParts(date) {
  const d = date ? new Date(date) : new Date();
  return {
    dd:   String(d.getDate()).padStart(2, '0'),
    mm:   String(d.getMonth() + 1).padStart(2, '0'),
    yyyy: String(d.getFullYear()),
    iso:  d.toISOString().split('T')[0],
  };
}

// ── Fetch images from Telegram public channel ─────────────────────────────────
async function fetchTelegram(channels, date) {
  const { iso } = parseDateParts(date);
  const dateVariants = [iso, iso.replace(/-/g, ''), iso.replace(/-/g, '.')];

  for (const channel of channels) {
    try {
      const res = await fetch(`https://t.me/s/${channel}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
        timeout: 12000,
      });
      if (!res.ok) continue;
      const html = await res.text();

      const imgs = new Set();
      const bgRe = /background-image:\s*url\(['"]?(https:\/\/cdn\d*\.telesco\.pe\/file\/[^'")\s]+)['"]?\)/g;
      const srcRe = /<img[^>]+src=["'](https:\/\/cdn\d*\.telesco\.pe\/file\/[^"']+)["']/g;
      let m;
      while ((m = bgRe.exec(html)) !== null) imgs.add(m[1]);
      while ((m = srcRe.exec(html)) !== null) imgs.add(m[1]);

      if (!imgs.size) continue;

      const all = [...imgs];
      const dated = all.filter(u => dateVariants.some(v => u.includes(v)));
      // Return dated images if found, otherwise latest 10
      return { images: (dated.length > 0 ? dated : all).slice(-10), source: `Telegram @${channel}` };
    } catch { continue; }
  }
  return null;
}

// ── Fetch page images from direct epaper API (Eenadu/Sakshi style) ────────────
async function fetchDirectEpaper(paperId, date) {
  const urlFn = DIRECT_EPAPER_URLS[paperId];
  if (!urlFn) return null;
  const { dd, mm, yyyy } = parseDateParts(date);
  try {
    const url = urlFn(dd, mm, yyyy);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': `https://epaper.${paperId.replace('_', '')}.net/`,
      },
      timeout: 12000,
    });
    if (!res.ok) return null;
    const data = await res.json();
    const pages = Array.isArray(data) ? data : Object.values(data).flat();
    const images = pages.map(p =>
      p.HighResolution || p.PageImage || p.ImageUrl || p.highResolution ||
      p.Highresolution || p.HighestResolution || p.HDImage || p.hdimage
    ).filter(Boolean);
    if (!images.length) return null;
    return { images: images.slice(0, 12), source: 'Direct Epaper API' };
  } catch { return null; }
}

// ── GET /api/epaper/:paperId — returns images (for Eenadu-style viewer) ───────
router.get('/:paperId', async (req, res) => {
  const { paperId } = req.params;
  const { date } = req.query;
  const epaperUrl = PAPER_EPAPER_URL[paperId] || '#';

  // 1. Try direct API (Telugu papers)
  const direct = await fetchDirectEpaper(paperId, date);
  if (direct) return res.json({ ...direct, epaperUrl, articles: [] });

  // 2. Try Telegram (TOI, HT, DH, ET)
  const tgChannels = TELEGRAM_CHANNELS[paperId];
  if (tgChannels) {
    const tg = await fetchTelegram(tgChannels, date);
    if (tg) return res.json({ ...tg, epaperUrl, articles: [] });
  }

  res.json({ images: [], articles: [], source: null, epaperUrl });
});

// ── GET /api/epaper/:paperId/articles — returns article list (RSS-based) ──────
router.get('/:paperId/articles', async (req, res) => {
  const { paperId } = req.params;
  const { date } = req.query;
  const rssUrl = PAPER_RSS[paperId];
  const epaperUrl = PAPER_EPAPER_URL[paperId] || '#';

  if (!rssUrl) return res.json({ articles: [], epaperUrl });

  try {
    const rssParser = new Parser({ timeout: 10000 });
    const feed = await rssParser.parseURL(rssUrl);

    let items = feed.items.map(item => ({
      title:       item.title || '',
      url:         item.link || item.guid || '',
      publishedAt: item.pubDate || item.isoDate || '',
      snippet:     item.contentSnippet || item.summary || '',
    })).filter(a => a.title && a.url);

    if (date) {
      const target = date.slice(0, 10);
      const dated = items.filter(a => a.publishedAt && a.publishedAt.slice(0, 10) === target);
      if (dated.length > 0) items = dated;
    }

    res.json({ articles: items.slice(0, 30), epaperUrl });
  } catch {
    res.json({ articles: [], epaperUrl });
  }
});

module.exports = router;
