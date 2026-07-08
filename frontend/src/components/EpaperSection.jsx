import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styles from './EpaperSection.module.css';

const EPAPERS = {
  Telugu: [
    { id: 'eenadu',            name: 'Eenadu',            mode: 'images' },
    { id: 'sakshi',            name: 'Sakshi',             mode: 'images' },
    { id: 'andhrajyothy',      name: 'Andhra Jyothy',      mode: 'images' },
    { id: 'visalaandhra',      name: 'Visalaandhra',       mode: 'images' },
    { id: 'namaste_telangana', name: 'Namasthe Telangana', mode: 'articles' },
    { id: 'telangana_today',   name: 'Telangana Today',    mode: 'articles' },
    { id: 'vaartha',           name: 'Vaartha',            mode: 'articles' },
    { id: 'andhra_bhoomi',     name: 'Andhra Bhoomi',      mode: 'articles' },
    { id: 'prajasakti',        name: 'Prajasakti',         mode: 'articles' },
    { id: 'suryaa',            name: 'Suryaa',             mode: 'articles' },
  ],
  Hindi: [
    { id: 'dainik_jagran',     name: 'Dainik Jagran',      mode: 'articles' },
    { id: 'dainik_bhaskar',    name: 'Dainik Bhaskar',     mode: 'articles' },
    { id: 'amar_ujala',        name: 'Amar Ujala',         mode: 'articles' },
    { id: 'hindustan_hindi',   name: 'Hindustan (Hindi)',  mode: 'articles' },
    { id: 'navbharat_times',   name: 'Navbharat Times',    mode: 'articles' },
    { id: 'rajasthan_patrika', name: 'Rajasthan Patrika',  mode: 'articles' },
    { id: 'nai_dunia',         name: 'Nai Dunia',          mode: 'articles' },
    { id: 'haribhoomi',        name: 'Haribhoomi',         mode: 'articles' },
    { id: 'punjab_kesari',     name: 'Punjab Kesari',      mode: 'articles' },
  ],
  English: [
    { id: 'times_of_india',    name: 'Times of India',     mode: 'images' },
    { id: 'hindustan_times',   name: 'Hindustan Times',    mode: 'images' },
    { id: 'deccan_herald',     name: 'Deccan Herald',      mode: 'images' },
    { id: 'economic_times',    name: 'Economic Times',     mode: 'images' },
    { id: 'the_hindu',         name: 'The Hindu',          mode: 'articles' },
    { id: 'indian_express',    name: 'Indian Express',     mode: 'articles' },
    { id: 'new_indian_express',name: 'New Indian Express', mode: 'articles' },
    { id: 'the_tribune',       name: 'The Tribune',        mode: 'articles' },
    { id: 'the_pioneer',       name: 'The Pioneer',        mode: 'articles' },
  ],
};

const LANG_META = { Telugu: { icon: '🔵' }, Hindi: { icon: '🟠' }, English: { icon: '🇬🇧' } };
const todayStr = () => new Date().toISOString().split('T')[0];

function formatDate(str) {
  if (!str) return '';
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// ── Image viewer (Eenadu/Sakshi/TOI/HT style) ────────────────────────────────
function ImageViewer({ paper, date, onClose }) {
  const [images, setImages] = useState([]);
  const [epaperUrl, setEpaperUrl] = useState('#');
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/epaper/${paper.id}?date=${date}`)
      .then(res => {
        setImages(res.data.images || []);
        setEpaperUrl(res.data.epaperUrl || '#');
        setActiveImg(0);
      })
      .catch(() => setImages([]))
      .finally(() => setLoading(false));
  }, [paper.id, date]);

  return (
    <div className={styles.viewerOverlay} onClick={onClose}>
      <div className={styles.viewer} onClick={e => e.stopPropagation()}>
        <div className={styles.viewerHeader}>
          <div className={styles.viewerTitle}>
            <span>📄 {paper.name}</span>
            <span className={styles.viewerDate}>📅 {date}</span>
          </div>
          <div className={styles.viewerActions}>
            <a href={epaperUrl} target="_blank" rel="noopener noreferrer" className={styles.visitBtn}>🌐 Visit E-Paper</a>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {loading ? (
          <div className={styles.viewerLoading}>⏳ Fetching e-paper pages...</div>
        ) : images.length > 0 ? (
          <>
            <div className={styles.viewerMain}>
              <img
                src={images[activeImg]}
                alt={`${paper.name} page ${activeImg + 1}`}
                className={styles.viewerImg}
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
            {images.length > 1 && (
              <div className={styles.viewerThumbs}>
                {images.map((img, i) => (
                  <img
                    key={i} src={img} alt={`Page ${i + 1}`}
                    className={`${styles.thumb} ${activeImg === i ? styles.thumbActive : ''}`}
                    onClick={() => setActiveImg(i)}
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                ))}
              </div>
            )}
            <div className={styles.viewerNav}>
              <button disabled={activeImg === 0} onClick={() => setActiveImg(i => i - 1)}>◀ Prev</button>
              <span>Page {activeImg + 1} / {images.length}</span>
              <button disabled={activeImg === images.length - 1} onClick={() => setActiveImg(i => i + 1)}>Next ▶</button>
            </div>
          </>
        ) : (
          <div className={styles.viewerEmpty}>
            <p>📭 No e-paper pages found for this date.</p>
            <p className={styles.viewerHint}>Try a different date or visit the e-paper site directly.</p>
            <a href={epaperUrl} target="_blank" rel="noopener noreferrer" className={styles.visitBtn} style={{ marginTop: 16, display: 'inline-block' }}>
              🌐 Open {paper.name} E-Paper
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Article list viewer (RSS-based) ──────────────────────────────────────────
function ArticleViewer({ paper, date, onClose }) {
  const [articles, setArticles] = useState([]);
  const [epaperUrl, setEpaperUrl] = useState('#');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/epaper/${paper.id}/articles?date=${date}`)
      .then(res => {
        setArticles(res.data.articles || []);
        setEpaperUrl(res.data.epaperUrl || '#');
      })
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, [paper.id, date]);

  return (
    <div className={styles.viewerOverlay} onClick={onClose}>
      <div className={styles.viewer} onClick={e => e.stopPropagation()}>
        <div className={styles.viewerHeader}>
          <div className={styles.viewerTitle}>
            <span>📄 {paper.name}</span>
            <span className={styles.viewerDate}>📅 {date}</span>
          </div>
          <div className={styles.viewerActions}>
            <a href={epaperUrl} target="_blank" rel="noopener noreferrer" className={styles.visitBtn}>🌐 Visit E-Paper</a>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {loading ? (
          <div className={styles.viewerLoading}>⏳ Loading articles...</div>
        ) : articles.length > 0 ? (
          <div className={styles.articleList}>
            <p className={styles.articleCount}>📰 {articles.length} articles from {paper.name}</p>
            {articles.map((a, i) => (
              <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className={styles.articleItem}>
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
            <p>📭 No articles found for this date.</p>
            <p className={styles.viewerHint}>Try a different date or visit the e-paper site directly.</p>
            <a href={epaperUrl} target="_blank" rel="noopener noreferrer" className={styles.visitBtn} style={{ marginTop: 16, display: 'inline-block' }}>
              🌐 Open {paper.name} E-Paper
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
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
  const filtered = search.trim() ? papers.filter(p => p.name.toLowerCase().includes(search.toLowerCase())) : papers;

  return (
    <div className={styles.section}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h2>📄 E-Papers</h2>
          <p>Read today's newspaper editions — full e-paper pages or latest articles</p>
        </div>
        <div className={styles.heroControls}>
          <div className={styles.dateRow}>
            <label>📅 Edition Date</label>
            <input type="date" className={styles.datePicker} value={date} max={todayStr()} onChange={e => setDate(e.target.value)} />
          </div>
          <input type="text" className={styles.search} placeholder="Search newspaper..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      <div className={styles.langTabs}>
        {Object.keys(EPAPERS).map(lang => (
          <button key={lang} className={`${styles.langTab} ${activeLang === lang ? styles.langActive : ''}`} onClick={() => { setActiveLang(lang); setSearch(''); }}>
            {LANG_META[lang].icon} {lang}
            <span className={styles.count}>{EPAPERS[lang].length}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="no-results"><span className="icon">🔍</span><p>No newspapers found{search ? ` for "${search}"` : ''}.</p></div>
      ) : (
        <div className={styles.grid}>
          {filtered.map(paper => (
            <button key={paper.id} className={styles.card} onClick={() => setSelectedPaper(paper)}>
              <div className={styles.cardTop}>
                <span className={styles.cardName}>{paper.name}</span>
                <span className={styles.badge}>{paper.mode === 'images' ? '📰 E-Paper' : '📋 Articles'}</span>
              </div>
              <span className={styles.cardArrow}>{paper.mode === 'images' ? '📖 Read E-Paper' : '📋 Browse Articles'}</span>
            </button>
          ))}
        </div>
      )}

      {selectedPaper && selectedPaper.mode === 'images' && (
        <ImageViewer paper={selectedPaper} date={date} onClose={() => setSelectedPaper(null)} />
      )}
      {selectedPaper && selectedPaper.mode === 'articles' && (
        <ArticleViewer paper={selectedPaper} date={date} onClose={() => setSelectedPaper(null)} />
      )}
    </div>
  );
}
