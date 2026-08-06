import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import FilterPanel from '../components/FilterPanel';
import EpaperSection from '../components/EpaperSection';
import api from '../services/api';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [mode, setMode]               = useState('epaper');
  const [articles, setArticles]       = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading]         = useState(false);
  const [query, setQuery]             = useState('');
  const [activeNewspaper, setActiveNewspaper] = useState('');
  const [appliedFilters, setAppliedFilters]   = useState({});
  const [epaperDate, setEpaperDate]   = useState('');
  const [epaperLang, setEpaperLang]   = useState('Telugu');
  const [epaperSearch, setEpaperSearch] = useState('');

  // Ref holds latest filters so effects never go stale
  const filtersRef = useRef({});

  const fetchNews = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const pref = user?.preferences || {};
      const params = new URLSearchParams();
      params.set('language', filters.language || pref.newsLanguage || 'en');
      params.set('area',     filters.area     || pref.area         || 'national');
      params.set('newspaper',filters.newspaper|| pref.newspaper    || '');
      params.set('keywords', filters.keywords || pref.keywords     || '');
      if (filters.date)  params.set('fromDate', filters.date);
      if (filters.query) params.set('query',    filters.query);

      const [feedRes, recRes] = await Promise.all([
        api.get(`/api/news/feed?${params}`),
        api.get('/api/news/recommendations'),
      ]);
      setArticles(feedRes.data.articles || []);
      setActiveNewspaper(feedRes.data.activeNewspaper || '');
      setRecommendations(recRes.data.articles || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // When switching to news mode, use latest filters from ref
  useEffect(() => {
    if (mode === 'news') fetchNews(filtersRef.current);
  }, [mode, fetchNews]);

  const handleSearch = e => {
    e.preventDefault();
    if (!query.trim()) return;
    const f = { ...filtersRef.current, query: query.trim() };
    setMode('news');
    fetchNews(f);
  };

  const handleFilter = filters => {
    filtersRef.current = filters;
    setAppliedFilters(filters);
    // Sync epaper date/lang/search from filter panel
    if (filters.date !== undefined) setEpaperDate(filters.date || '');
    if (filters.epaperLang)         setEpaperLang(filters.epaperLang);
    if (filters.epaperSearch !== undefined) setEpaperSearch(filters.epaperSearch || '');
    // Fetch digital news with the new filters
    fetchNews(filters);
  };

  const epaperFilters = { date: epaperDate, language: epaperLang, search: epaperSearch };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>

        <form onSubmit={handleSearch} className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search news across all sources..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary">🔍 Search</button>
        </form>

        <FilterPanel
          onFilter={handleFilter}
          mode={mode}
          onModeChange={setMode}
        />

        {mode === 'epaper' && <EpaperSection epaperFilters={epaperFilters} />}

        {mode === 'news' && (
          <>
            {loading ? (
              <div className={styles.loading}>
                <span className={styles.spinner} />
                Loading articles from all sources...
              </div>
            ) : (
              <>
                {activeNewspaper && <p className={styles.activeSource}>📰 {activeNewspaper}</p>}
                <div className="section-heading">
                  🌐 Digital News
                  {appliedFilters.date && (
                    <span style={{ fontSize: '0.78rem', fontWeight: 400, marginLeft: 10, color: '#f59e0b' }}>
                      📅 {appliedFilters.date}
                    </span>
                  )}
                </div>
                {articles.length > 0 ? (
                  <div className="news-grid">
                    {articles.map((article, i) => <NewsCard key={i} article={article} />)}
                  </div>
                ) : (
                  <div className="no-results">
                    <span className="icon">🔍</span>
                    <p>No articles found. Try different keywords or filters.</p>
                  </div>
                )}

                {/* Show E-Paper section below digital news when a date is selected */}
                {appliedFilters.date && (
                  <>
                    <div className="section-heading" style={{ marginTop: '2rem' }}>
                      📄 E-Paper Editions
                      <span style={{ fontSize: '0.78rem', fontWeight: 400, marginLeft: 10, color: '#f59e0b' }}>
                        📅 {appliedFilters.date}
                      </span>
                    </div>
                    <EpaperSection epaperFilters={epaperFilters} />
                  </>
                )}

                {recommendations.length > 0 && (
                  <>
                    <div className="section-heading">⭐ Recommended For You</div>
                    <div className="news-grid">
                      {recommendations.map((article, i) => <NewsCard key={i} article={article} />)}
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
