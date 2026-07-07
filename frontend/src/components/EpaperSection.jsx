import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styles from './EpaperSection.module.css';

const EPAPERS = {
  Telugu: [
    { id: 'eenadu',            name: 'Eenadu',             access: 'free' },
    { id: 'sakshi',            name: 'Sakshi',              access: 'free' },
    { id: 'andhrajyothy',      name: 'Andhra Jyothy',       access: 'free' },
    { id: 'namaste_telangana', name: 'Namasthe Telangana',  access: 'free' },
    { id: 'telangana_today',   name: 'Telangana Today',     access: 'free' },
    { id: 'vaartha',           name: 'Vaartha',             access: 'free' },
    { id: 'andhra_bhoomi',     name: 'Andhra Bhoomi',       access: 'free' },
    { id: 'prajasakti',        name: 'Prajasakti',          access: 'free' },
    { id: 'suryaa',            name: 'Suryaa',              access: 'free' },
    { id: 'visalaandhra',      name: 'Visalaandhra',        access: 'free' },
  ],
  Hindi: [
    { id: 'dainik_jagran',     name: 'Dainik Jagran',       access: 'free' },
    { id: 'dainik_bhaskar',    name: 'Dainik Bhaskar',      access: 'free' },
    { id: 'amar_ujala',        name: 'Amar Ujala',          access: 'free' },
    { id: 'hindustan_hindi',   name: 'Hindustan (Hindi)',   access: 'free' },
    { id: 'navbharat_times',   name: 'Navbharat Times',     access: 'free' },
    { id: 'rajasthan_patrika', name: 'Rajasthan Patrika',   access: 'free' },
    { id: 'nai_dunia',         name: 'Nai Dunia',           access: 'free' },
    { id: 'haribhoomi',        name: 'Haribhoomi',          access: 'free' },
    { id: 'punjab_kesari',     name: 'Punjab Kesari',       access: 'free' },
  ],
  English: [
    { id: 'times_of_india',    name: 'Times of India',      access: 'free' },
    { id: 'the_hindu',         name: 'The Hindu',           access: 'free' },
    { id: 'indian_express',    name: 'Indian Express',      access: 'free' },
    { id: 'hindustan_times',   name: 'Hindustan Times',     access: 'free' },
    { id: 'deccan_herald',     name: 'Deccan Herald',       access: 'free' },
    { id: 'new_indian_express',name: 'New Indian Express',  access: 'free' },
    { id: 'economic_times',    name: 'Economic Times',      access: 'free' },
    { id: 'the_tribune',       name: 'The Tribune',         access: 'free' },
    { id: 'the_pioneer',       name: 'The Pioneer',         access: 'free' },
  ],
};

const LANG_META = {
  Telugu:  { icon: '🔵' },
  Hindi:   { icon: '🟠' },
  English: { icon: '🇬🇧' },
};

const todayStr = () => new Date().toISOString().split('T')[0];

function PaperViewer({ paper, date, onClose }) {
  const [images, setImages] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/epaper/${paper.id}?date=${date}&paperName=${encodeURIComponent(paper.name)}`)
      .then(res => {
        setData(res.data);
        setImages(res.data.images || []);
        setActiveImg(0);
      })
      .catch(() => { setImages([]); setData(null); })
      .finally(() => setLoading(false));
  }, [paper.id, date]);

  return (
    <div className={styles.viewerOverlay} onClick={onClose}>
      <div className={styles.viewer} onClick={e => e.stopPropagation()}>
        <div className={styles.viewerHeader}>
          <h3>📄 {paper.name} — {date}</h3>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {loading ? (
          <div className={styles.viewerLoading}>⏳ Fetching epaper pages from all sources...</div>
        ) : images.length > 0 ? (
          <>
            <div className={styles.viewerSource}>📡 Source: {data?.source}</div>
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
                    key={i}
                    src={img}
                    alt={`Page ${i + 1}`}
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
        ) : data?.articles?.length > 0 ? (
          <div className={styles.viewerArticles}>
            <p className={styles.viewerHint}>📰 No page images found — showing related articles from {data.source}:</p>
            {data.articles.map((a, i) => (
              <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className={styles.articleLink}>
                {a.image && <img src={a.image} alt={a.title} className={styles.articleThumb} onError={e => e.target.style.display='none'} />}
                <span>{a.title}</span>
              </a>
            ))}
          </div>
        ) : (
          <div className={styles.viewerEmpty}>
            <p>📭 No epaper pages found for this date.</p>
            <p className={styles.viewerHint}>Try a different date or check the Telegram channel directly.</p>
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

    // If specific newspaper selected, open viewer directly
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
      {/* Header */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h2>📄 E-Papers</h2>
          <p>Read today's newspaper editions — fetched from free public sources</p>
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

      {/* Language tabs */}
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

      {/* Cards */}
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
                <span className={`${styles.badge} ${styles.badgeFree}`}>✅ Free</span>
              </div>
              <span className={styles.cardArrow}>📖 Read E-Paper</span>
            </button>
          ))}
        </div>
      )}

      {/* Inline viewer */}
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
