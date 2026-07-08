import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styles from './EpaperSection.module.css';

const EPAPERS = {
  Telugu: [
    { id: 'eenadu',            name: 'Eenadu' },
    { id: 'sakshi',            name: 'Sakshi' },
    { id: 'andhrajyothy',      name: 'Andhra Jyothy' },
    { id: 'namaste_telangana', name: 'Namasthe Telangana' },
    { id: 'telangana_today',   name: 'Telangana Today' },
    { id: 'vaartha',           name: 'Vaartha' },
    { id: 'andhra_bhoomi',     name: 'Andhra Bhoomi' },
    { id: 'prajasakti',        name: 'Prajasakti' },
    { id: 'suryaa',            name: 'Suryaa' },
    { id: 'visalaandhra',      name: 'Visalaandhra' },
  ],
  Hindi: [
    { id: 'dainik_jagran',     name: 'Dainik Jagran' },
    { id: 'dainik_bhaskar',    name: 'Dainik Bhaskar' },
    { id: 'amar_ujala',        name: 'Amar Ujala' },
    { id: 'hindustan_hindi',   name: 'Hindustan (Hindi)' },
    { id: 'navbharat_times',   name: 'Navbharat Times' },
    { id: 'rajasthan_patrika', name: 'Rajasthan Patrika' },
    { id: 'nai_dunia',         name: 'Nai Dunia' },
    { id: 'haribhoomi',        name: 'Haribhoomi' },
    { id: 'punjab_kesari',     name: 'Punjab Kesari' },
  ],
  English: [
    { id: 'times_of_india',    name: 'Times of India' },
    { id: 'the_hindu',         name: 'The Hindu' },
    { id: 'indian_express',    name: 'Indian Express' },
    { id: 'hindustan_times',   name: 'Hindustan Times' },
    { id: 'deccan_herald',     name: 'Deccan Herald' },
    { id: 'new_indian_express',name: 'New Indian Express' },
    { id: 'economic_times',    name: 'Economic Times' },
    { id: 'the_tribune',       name: 'The Tribune' },
    { id: 'the_pioneer',       name: 'The Pioneer' },
  ],
};

const LANG_META = {
  Telugu:  { icon: '🔵' },
  Hindi:   { icon: '🟠' },
  English: { icon: '🇬🇧' },
};

const todayStr = () => new Date().toISOString().split('T')[0];

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function PaperViewer({ paper, date, onClose }) {
  const [articles, setArticles] = useState([]);
  const [epaperUrl, setEpaperUrl] = useState('#');
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [inputVal, setInputVal] = useState('');
  const debounceRef = useRef(null);

  const load = (kw) => {
    setLoading(true);
    const params = new URLSearchParams({ date, keyword: kw || '' });
    api.get(`/api/epaper/${paper.id}/articles?${params}`)
      .then(res => {
        setArticles(res.data.articles || []);
        setEpaperUrl(res.data.epaperUrl || '#');
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(keyword); }, [paper.id, date, keyword]);

  const handleKeywordChange = (e) => {
    const val = e.target.value;
    setInputVal(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setKeyword(val), 500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { clearTimeout(debounceRef.current); setKeyword(inputVal); }
  };

  return (
    <div className={styles.viewerOverlay} onClick={onClose}>
      <div className={styles.viewer} onClick={e => e.stopPropagation()}>
        <div className={styles.viewerHeader}>
          <div className={styles.viewerTitle}>
            <span>📄 {paper.name}</span>
            <span className={styles.viewerDate}>📅 {date}</span>
          </div>
          <div className={styles.viewerActions}>
            <a href={epaperUrl} target="_blank" rel="noopener noreferrer" className={styles.visitBtn}>
              🌐 Visit E-Paper Site
            </a>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        <div className={styles.viewerSearch}>
          <input
            type="text"
            placeholder="Search keywords e.g. ukku, steel plant, ukkunagaram..."
            value={inputVal}
            onChange={handleKeywordChange}
            onKeyDown={handleKeyDown}
            className={styles.keywordInput}
            autoFocus
          />
          {inputVal && (
            <button className={styles.clearBtn} onClick={() => { setInputVal(''); setKeyword(''); }}>✕</button>
          )}
        </div>

        {loading ? (
          <div className={styles.viewerLoading}>⏳ Loading articles...</div>
        ) : articles.length > 0 ? (
          <div className={styles.articleList}>
            {keyword && <p className={styles.resultCount}>🔍 {articles.length} result{articles.length !== 1 ? 's' : ''} for "{keyword}"</p>}
            {articles.map((a, i) => (
              <a
                key={i}
                href={a.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.articleItem}
              >
                <div className={styles.articleMeta}>
                  <span className={styles.articleSource}>{paper.name}</span>
                  <span className={styles.articleDate}>{formatDate(a.publishedAt)}</span>
                </div>
                <div className={styles.articleTitle}>{a.title}</div>
                {a.snippet && <div className={styles.articleSnippet}>{a.snippet.slice(0, 160)}{a.snippet.length > 160 ? '…' : ''}</div>}
                <span className={styles.readMore}>Read full article →</span>
              </a>
            ))}
          </div>
        ) : (
          <div className={styles.viewerEmpty}>
            <p>📭 {keyword ? `No articles found for "${keyword}"` : 'No articles found for this date.'}</p>
            <p className={styles.viewerHint}>Try a different date or keyword, or visit the e-paper site directly.</p>
            <a href={epaperUrl} target="_blank" rel="noopener noreferrer" className={styles.visitBtn} style={{ marginTop: 12, display: 'inline-block' }}>
              🌐 Open {paper.name} E-Paper
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function EpaperSection({ epaperFilters }) {
  const { user } = useAuth();
  const langMap = { en: 'English', hi: 'Hindi', te: 'Telugu' };
  const prefLang = langMap[user?.preferences?.newsLanguage] || 'Telugu';

  const [activeLang, setActiveLang] = useState(prefLang);
  const [date, setDate] = useState(todayStr());
  const [search, setSearch] = useState('');
  const [selectedPaper, setSelectedPaper] = useState(null);

  useEffect(() => {
    if (!epaperFilters) return;
    if (epaperFilters.language) setActiveLang(epaperFilters.language);
    if (epaperFilters.date) setDate(epaperFilters.date);
    if (epaperFilters.search !== undefined) setSearch(epaperFilters.search);
    if (epaperFilters.search) {
      const lang = epaperFilters.language || activeLang;
      const papers = EPAPERS[lang] || [];
      const exact = papers.find(p => p.name.toLowerCase() === epaperFilters.search.toLowerCase());
      if (exact) setSelectedPaper(exact);
    }
  }, [epaperFilters]);

  const papers = EPAPERS[activeLang] || [];
  const filtered = search.trim()
    ? papers.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : papers;

  return (
    <div className={styles.section}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h2>📄 E-Papers</h2>
          <p>Browse articles from today's newspaper editions — click any article to read on the newspaper's website</p>
        </div>
        <div className={styles.heroControls}>
          <div className={styles.dateRow}>
            <label>📅 Edition Date</label>
            <input
              type="date"
              className={styles.datePicker}
              value={date}
              max={todayStr()}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <input
            type="text"
            className={styles.search}
            placeholder="Search newspaper..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.langTabs}>
        {Object.keys(EPAPERS).map(lang => (
          <button
            key={lang}
            className={`${styles.langTab} ${activeLang === lang ? styles.langActive : ''}`}
            onClick={() => { setActiveLang(lang); setSearch(''); }}
          >
            {LANG_META[lang].icon} {lang}
            <span className={styles.count}>{EPAPERS[lang].length}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="no-results">
          <span className="icon">🔍</span>
          <p>No newspapers found{search ? ` for "${search}"` : ''}.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(paper => (
            <button
              key={paper.id}
              className={styles.card}
              onClick={() => setSelectedPaper(paper)}
            >
              <div className={styles.cardTop}>
                <span className={styles.cardName}>{paper.name}</span>
                <span className={styles.badge}>✅ Free</span>
              </div>
              <span className={styles.cardArrow}>📰 Browse Articles</span>
            </button>
          ))}
        </div>
      )}

      {selectedPaper && (
        <PaperViewer
          paper={selectedPaper}
          date={date}
          onClose={() => setSelectedPaper(null)}
        />
      )}
    </div>
  );
}
