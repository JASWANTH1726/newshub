import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import FilterPanel from '../components/FilterPanel';
import EpaperSection from '../components/EpaperSection';
import api from '../services/api';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [mode, setMode] = useState('epaper'); // 'epaper' | 'news'
  const [articles, setArticles] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [activeNewspaper, setActiveNewspaper] = useState('');
  const [epaperFilters, setEpaperFilters] = useState({ language: 'Telugu', search: '', freeOnly: false });

  const fetchNews = async (filters = {}) => {
    setLoading(true);
    try {
      const pref = user?.preferences || {};
      const merged = {
        language: pref.newsLanguage || 'en',
        area: pref.area || 'national',
        newspaper: pref.newspaper || '',
        keywords: pref.keywords || '',
        ...filters,
      };
      const params = new URLSearchParams(merged);
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
  };

  // Fetch news when switching to news mode
  useEffect(() => {
    if (mode === 'news' && articles.length === 0) fetchNews();
  }, [mode]);

  const handleSearch = e => {
    e.preventDefault();
    if (!query.trim()) return;
    setMode('news');
    fetchNews({ query: query.trim() });
  };

  const handleModeChange = newMode => {
    setMode(newMode);
  };

  const handleFilter = filters => {
    // Update epaper filters from unified filter
    setEpaperFilters({
      language: filters.epaperLang || 'Telugu',
      search: filters.epaperSearch || '',
      freeOnly: false,
    });
    if (mode === 'news') fetchNews(filters);
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>

        {/* Search bar */}
        <form onSubmit={handleSearch} className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search news across all sources..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary">🔍 Search</button>
        </form>

        {/* Filter panel with mode toggle */}
        <FilterPanel
          onFilter={handleFilter}
          mode={mode}
          onModeChange={handleModeChange}
        />

        {/* ── E-Paper Mode (primary) ── */}
        {mode === 'epaper' && <EpaperSection epaperFilters={epaperFilters} />}

        {/* ── Digital News Mode ── */}
        {mode === 'news' && (
          <>
            {loading ? (
              <div className={styles.loading}>
                <span className={styles.spinner} />
                Loading articles...
              </div>
            ) : (
              <>
                {activeNewspaper && (
                  <p className={styles.activeSource}>📰 {activeNewspaper}</p>
                )}
                <div className="section-heading">🌐 Digital News</div>
                {articles.length > 0 ? (
                  <div className="news-grid">
                    {articles.map((article, i) => (
                      <NewsCard key={i} article={article} />
                    ))}
                  </div>
                ) : (
                  <div className="no-results">
                    <span className="icon">🔍</span>
                    <p>No articles found. Try different keywords or filters.</p>
                  </div>
                )}

                {recommendations.length > 0 && (
                  <>
                    <div className="section-heading">⭐ Recommended For You</div>
                    <div className="news-grid">
                      {recommendations.map((article, i) => (
                        <NewsCard key={i} article={article} />
                      ))}
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
