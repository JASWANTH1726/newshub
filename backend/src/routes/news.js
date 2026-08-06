const router = require('express').Router();
const auth = require('../middleware/auth');
const newsService = require('../services/newsService');
const {
  fetchFromNewsAPI,
  fetchFromGNews,
  fetchFromGuardian,
  fetchFromNewsCatcher,
  fetchFromMediaStack,
  fetchByNewspaper,
  fetchByAreaAndLanguage,
  fetchRecommendations,
  filterByDate,
  deduplicateArticles,
  AREA_QUERY_MAP,
  NEWSPAPER_NAME_MAP,
} = newsService;

// GET /api/news/feed
router.get('/feed', auth, async (req, res) => {
  try {
    const pref = req.user.preferences;
    const {
      query,
      newspaper = pref.newspaper || '',
      area      = pref.area || 'national',
      language  = pref.newsLanguage || 'en',
      fromDate,
      keywords  = pref.keywords || '',
    } = req.query;

    const keywordList = keywords
      ? keywords.split(',').map(k => k.trim()).filter(Boolean)
      : [];

    let articles = [];

    if (query && query.trim()) {
      // Search: query ALL APIs in parallel, merge and deduplicate
      const areaName = AREA_QUERY_MAP[area] || 'India';
      const searchQuery = `${query.trim()} ${areaName}`;
      const msLang = language === 'te' ? 'te' : language === 'hi' ? 'hi' : 'en';

      const [gnews, newsapi, guardian, newscatcher, mediastack] = await Promise.all([
        fetchFromGNews({ query: searchQuery, language, max: 20, fromDate }),
        fetchFromNewsAPI({ query: searchQuery, language, fromDate }),
        language === 'en' ? fetchFromGuardian({ query: searchQuery, pageSize: 20, fromDate }) : Promise.resolve([]),
        fetchFromNewsCatcher({ query: searchQuery, language, pageSize: 20, fromDate }),
        fetchFromMediaStack({ keywords: searchQuery, languages: msLang, limit: 20, fromDate }),
      ]);

      const filter = arr => fromDate ? filterByDate(arr, fromDate) : arr;
      articles = deduplicateArticles(
        [].concat(filter(gnews), filter(newsapi), filter(guardian), filter(newscatcher), filter(mediastack))
      ).slice(0, 30);
    } else if (newspaper) {
      // Specific newspaper: RSS → Google News RSS → GNews → NewsAPI
      articles = await fetchByNewspaper(newspaper, area, language, fromDate);
    } else {
      // Area + language + keywords: full aggregation chain
      articles = await fetchByAreaAndLanguage(area, language, keywordList, fromDate);
    }

    res.json({
      articles,
      activeNewspaper: NEWSPAPER_NAME_MAP[newspaper] || '',
      totalResults: articles.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/news/recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const pref = req.user.preferences;
    const keywords = pref.keywords
      ? pref.keywords.split(',').map(k => k.trim()).filter(Boolean)
      : [];
    if (!keywords.length) return res.json({ articles: [] });
    const articles = await fetchRecommendations(keywords, pref.area, pref.newsLanguage);
    res.json({ articles });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/news/meta
router.get('/meta', (req, res) => {
  res.json({ AREA_QUERY_MAP, NEWSPAPER_NAME_MAP });
});

module.exports = router;
