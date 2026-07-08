import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import styles from './EpaperSection.module.css';

const EPAPERS = {
  Telugu: [
    { id: 'eenadu',            name: 'Eenadu'            },
    { id: 'sakshi',            name: 'Sakshi'             },
    { id: 'andhrajyothy',      name: 'Andhra Jyothy'      },
    { id: 'namaste_telangana', name: 'Namasthe Telangana' },
    { id: 'telangana_today',   name: 'Telangana Today'    },
    { id: 'vaartha',           name: 'Vaartha'            },
    { id: 'andhra_bhoomi',     name: 'Andhra Bhoomi'      },
    { id: 'prajasakti',        name: 'Prajasakti'         },
    { id: 'suryaa',            name: 'Suryaa'             },
    { id: 'visalaandhra',      name: 'Visalaandhra'       },
  ],
  Hindi: [
    { id: 'dainik_jagran',     name: 'Dainik Jagran'      },
    { id: 'dainik_bhaskar',    name: 'Dainik Bhaskar'     },
    { id: 'amar_ujala',        name: 'Amar Ujala'         },
    { id: 'hindustan_hindi',   name: 'Hindustan (Hindi)'  },
    { id: 'navbharat_times',   name: 'Navbharat Times'    },
    { id: 'rajasthan_patrika', name: 'Rajasthan Patrika'  },
    { id: 'nai_dunia',         name: 'Nai Dunia'          },
    { id: 'haribhoomi',        name: 'Haribhoomi'         },
    { id: 'punjab_kesari',     name: 'Punjab Kesari'      },
  ],
  English: [
    { id: 'times_of_india',     name: 'Times of India'    },
    { id: 'the_hindu',          name: 'The Hindu'          },
    { id: 'indian_express',     name: 'Indian Express'     },
    { id: 'hindustan_times',    name: 'Hindustan Times'    },
    { id: 'deccan_herald',      name: 'Deccan Herald'      },
    { id: 'new_indian_express', name: 'New Indian Express' },
    { id: 'economic_times',     name: 'Economic Times'     },
    { id: 'the_tribune',        name: 'The Tribune'        },
    { id: 'the_pioneer',        name: 'The Pioneer'        },
  ],
};

const LANG_META = {
  Telugu:  { icon: '🔵' },
  Hindi:   { icon: '🟠' },
  English: { icon: '🇬🇧' },
};

const todayStr = () => new Date().toISOString().split('T')[0];

const ZOOM_STEPS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 2.5, 3];
const DEFAULT_ZOOM = 2; // index → 1.0

function Skeleton() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonPage} />
      <div className={styles.skeletonThumbRow}>
        {[...Array(6)].map((_, i) => <div key={i} className={styles.skeletonThumb} />)}
      </div>
    </div>
  );
}

// ─── Full-screen reader ───────────────────────────────────────────────────────
function PaperViewer({ paper, date, onClose }) {
  const [images, setImages]       = useState([]);
  const [data, setData]           = useState(null);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(false);
  const [page, setPage]           = useState(0);
  const [zoomIdx, setZoomIdx]     = useState(DEFAULT_ZOOM);
  const [readMode, setReadMode]   = useState('single'); // 'single' | 'double' | 'scroll'
  const [isFS, setIsFS]           = useState(false);
  const [imgErrors, setImgErrors] = useState({});
  const [jumpOpen, setJumpOpen]   = useState(false);
  const [jumpVal, setJumpVal]     = useState('');

  const readerRef  = useRef(null);
  const mainRef    = useRef(null);
  const touchX     = useRef(null);
  const preloaded  = useRef({});

  const zoom  = ZOOM_STEPS[zoomIdx];
  const total = images.length;

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchData = useCallback(() => {
    setLoading(true); setError(false);
    setImages([]); setData(null); setPage(0);
    setZoomIdx(DEFAULT_ZOOM); setImgErrors({});
    api.get(`/api/epaper/${paper.id}?date=${date}&paperName=${encodeURIComponent(paper.name)}`)
      .then(res => { setData(res.data); setImages(res.data.images || []); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [paper.id, paper.name, date]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Preload adjacent pages ────────────────────────────────────────────────
  useEffect(() => {
    if (!images.length) return;
    [page - 1, page, page + 1, page + 2].forEach(i => {
      if (i < 0 || i >= total || preloaded.current[i]) return;
      const img = new Image();
      img.src = images[i];
      img.onload = () => { preloaded.current[i] = true; };
    });
  }, [page, images, total]);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const step = readMode === 'double' ? 2 : 1;
    const handle = e => {
      if (jumpOpen) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  { e.preventDefault(); setPage(p => Math.min(p + step, total - 1)); }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')    { e.preventDefault(); setPage(p => Math.max(p - step, 0)); }
      if (e.key === 'Home')  { e.preventDefault(); setPage(0); }
      if (e.key === 'End')   { e.preventDefault(); setPage(Math.max(0, total - 1)); }
      if (e.key === '+' || e.key === '=') { e.preventDefault(); setZoomIdx(i => Math.min(i + 1, ZOOM_STEPS.length - 1)); }
      if (e.key === '-')     { e.preventDefault(); setZoomIdx(i => Math.max(i - 1, 0)); }
      if (e.key === '0')     { e.preventDefault(); setZoomIdx(DEFAULT_ZOOM); }
      if (e.key === 'Escape'){ e.preventDefault(); onClose(); }
      if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFS(); }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [total, readMode, jumpOpen]);

  // ── Fullscreen API ────────────────────────────────────────────────────────
  useEffect(() => {
    const cb = () => setIsFS(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', cb);
    return () => document.removeEventListener('fullscreenchange', cb);
  }, []);

  const toggleFS = () => {
    if (!document.fullscreenElement) readerRef.current?.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  // ── Ctrl+wheel zoom ───────────────────────────────────────────────────────
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onWheel = e => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      if (e.deltaY < 0) setZoomIdx(i => Math.min(i + 1, ZOOM_STEPS.length - 1));
      else              setZoomIdx(i => Math.max(i - 1, 0));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // ── Swipe ─────────────────────────────────────────────────────────────────
  const onTouchStart = e => { if (e.touches.length === 1) touchX.current = e.touches[0].clientX; };
  const onTouchEnd   = e => {
    if (touchX.current === null || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    const step = readMode === 'double' ? 2 : 1;
    if (Math.abs(dx) > 50) {
      if (dx < 0) setPage(p => Math.min(p + step, total - 1));
      else        setPage(p => Math.max(p - step, 0));
    }
    touchX.current = null;
  };

  // ── Jump to page ──────────────────────────────────────────────────────────
  const handleJump = e => {
    e.preventDefault();
    const n = parseInt(jumpVal, 10);
    if (!isNaN(n) && n >= 1 && n <= total) { setPage(n - 1); setJumpOpen(false); setJumpVal(''); }
  };

  // ── Share ─────────────────────────────────────────────────────────────────
  const handleShare = () => {
    const text = `${paper.name} e-paper — ${date}`;
    if (navigator.share) navigator.share({ title: paper.name, text, url: window.location.href });
    else navigator.clipboard?.writeText(window.location.href);
  };

  // ── Page rendering ────────────────────────────────────────────────────────
  const imgStyle = { transform: `scale(${zoom})`, transformOrigin: 'top center' };

  const renderSingle = () => imgErrors[page] ? (
    <div className={styles.imgError}>
      <p>⚠ Page {page + 1} could not be loaded.</p>
      <button className={styles.retryBtn} onClick={() => setImgErrors(e => { const n={...e}; delete n[page]; return n; })}>↺ Retry</button>
    </div>
  ) : (
    <img src={images[page]} alt={`${paper.name} page ${page + 1}`}
      className={styles.mainImg} style={imgStyle} draggable={false}
      onError={() => setImgErrors(e => ({ ...e, [page]: true }))} />
  );

  const renderDouble = () => (
    <div className={styles.doubleSpread}>
      {[images[page], images[page + 1]].map((src, idx) => {
        const pi = page + idx;
        if (!src) return <div key={idx} className={styles.spreadBlank} />;
        return imgErrors[pi] ? (
          <div key={idx} className={styles.imgError}>⚠ Page {pi + 1} failed</div>
        ) : (
          <img key={idx} src={src} alt={`${paper.name} page ${pi + 1}`}
            className={styles.spreadImg} style={imgStyle} draggable={false}
            onError={() => setImgErrors(e => ({ ...e, [pi]: true }))} />
        );
      })}
    </div>
  );

  const renderScroll = () => (
    <div className={styles.scrollPages}>
      {images.map((src, i) => (
        <div key={i} className={styles.scrollPageWrap}>
          <span className={styles.scrollPageNum}>Page {i + 1}</span>
          {imgErrors[i] ? (
            <div className={styles.imgError}>⚠ Page {i + 1} failed to load</div>
          ) : (
            <img src={src} alt={`${paper.name} page ${i + 1}`}
              className={styles.scrollImg} style={imgStyle} loading="lazy"
              onError={() => setImgErrors(e => ({ ...e, [i]: true }))} />
          )}
        </div>
      ))}
    </div>
  );

  const step = readMode === 'double' ? 2 : 1;
  const pageLabel = readMode === 'double'
    ? `${page + 1}–${Math.min(page + 2, total)} / ${total}`
    : `${page + 1} / ${total}`;

  return (
    <div className={styles.readerOverlay} ref={readerRef}>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.tbLeft}>
          <button className={styles.tbBtn} onClick={onClose} title="Close (Esc)">✕</button>
          <div className={styles.tbTitle}>
            <span className={styles.tbPaper}>{paper.name}</span>
            <span className={styles.tbDate}>{date}</span>
          </div>
        </div>

        <div className={styles.tbCenter}>
          <button className={styles.tbBtn} onClick={() => setPage(0)}
            disabled={page === 0 || loading} title="First page">⏮</button>
          <button className={styles.tbBtn} onClick={() => setPage(p => Math.max(p - step, 0))}
            disabled={page === 0 || loading} title="Previous (←)">◀</button>
          <button className={styles.pageCounter} onClick={() => { setJumpOpen(o => !o); setJumpVal(''); }}
            disabled={!total} title="Jump to page">
            {total ? pageLabel : '—'}
          </button>
          <button className={styles.tbBtn} onClick={() => setPage(p => Math.min(p + step, total - 1))}
            disabled={page >= total - 1 || loading} title="Next (→)">▶</button>
          <button className={styles.tbBtn} onClick={() => setPage(total - 1)}
            disabled={page >= total - 1 || loading} title="Last page">⏭</button>
        </div>

        <div className={styles.tbRight}>
          <button className={styles.tbBtn} onClick={() => setZoomIdx(i => Math.max(i - 1, 0))}
            disabled={zoomIdx === 0} title="Zoom out (-)">−</button>
          <span className={styles.zoomLabel}>{Math.round(zoom * 100)}%</span>
          <button className={styles.tbBtn} onClick={() => setZoomIdx(i => Math.min(i + 1, ZOOM_STEPS.length - 1))}
            disabled={zoomIdx === ZOOM_STEPS.length - 1} title="Zoom in (+)">+</button>
          <button className={styles.tbBtn} onClick={() => setZoomIdx(DEFAULT_ZOOM)} title="Reset zoom (0)">⊡</button>

          <select className={styles.modeSelect} value={readMode}
            onChange={e => { setReadMode(e.target.value); setPage(0); }} title="Reading mode">
            <option value="single">Single</option>
            <option value="double">Spread</option>
            <option value="scroll">Scroll</option>
          </select>

          <button className={styles.tbBtn} onClick={toggleFS} title="Fullscreen (F)">
            {isFS ? '⛶' : '⛶'}
          </button>
          <button className={styles.tbBtn} onClick={handleShare} title="Share">⬆</button>
        </div>
      </div>

      {/* ── Jump popover ── */}
      {jumpOpen && (
        <div className={styles.jumpPopover}>
          <form onSubmit={handleJump} className={styles.jumpForm}>
            <input autoFocus type="number" min={1} max={total}
              value={jumpVal} onChange={e => setJumpVal(e.target.value)}
              placeholder={`1–${total}`} className={styles.jumpInput} />
            <button type="submit" className={styles.jumpGo}>Go</button>
            <button type="button" className={styles.jumpCancel} onClick={() => setJumpOpen(false)}>✕</button>
          </form>
        </div>
      )}

      {/* ── Source badge ── */}
      {data?.source && !loading && (
        <div className={styles.sourceBadge}>📡 {data.source}</div>
      )}

      {/* ── Reading area ── */}
      <div
        className={`${styles.readerMain} ${readMode === 'scroll' ? styles.readerScroll : ''}`}
        ref={mainRef}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {loading ? <Skeleton /> :
         error ? (
          <div className={styles.errorState}>
            <p className={styles.errorIcon}>⚠</p>
            <p>Failed to load e-paper pages.</p>
            <div className={styles.errorBtns}>
              <button className={styles.retryBtn} onClick={fetchData}>↺ Retry</button>
              <button className={styles.retryBtn} onClick={onClose}>← Back</button>
            </div>
          </div>
         ) :
         images.length > 0 ? (
           readMode === 'scroll'  ? renderScroll() :
           readMode === 'double'  ? renderDouble() :
           renderSingle()
         ) :
         data?.articles?.length > 0 ? (
          <div className={styles.articleFallback}>
            <p className={styles.fallbackHint}>📰 No page images — showing articles from {data.source}:</p>
            {data.articles.map((a, i) => (
              <a key={i} href={a.url} target="_blank" rel="noopener noreferrer" className={styles.articleLink}>
                {a.image && <img src={a.image} alt={a.title} className={styles.articleThumb}
                  onError={e => e.target.style.display='none'} />}
                <span>{a.title}</span>
              </a>
            ))}
          </div>
         ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyIcon}>📭</p>
            <p>No e-paper pages found for this date.</p>
            <p className={styles.emptyHint}>Try a different date.</p>
          </div>
         )}
      </div>

      {/* ── Thumbnail strip ── */}
      {images.length > 1 && !loading && readMode !== 'scroll' && (
        <div className={styles.thumbStrip}>
          {images.map((src, i) => (
            <button key={i}
              className={`${styles.thumbBtn} ${
                i === page || (readMode === 'double' && i === page + 1) ? styles.thumbActive : ''
              }`}
              onClick={() => setPage(i)} title={`Page ${i + 1}`}>
              {imgErrors[i] ? (
                <span className={styles.thumbErr}>⚠</span>
              ) : (
                <img src={src} alt={`Page ${i + 1}`} className={styles.thumbImg}
                  loading="lazy" onError={() => setImgErrors(e => ({ ...e, [i]: true }))} />
              )}
              <span className={styles.thumbNum}>{i + 1}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Section (paper picker) ───────────────────────────────────────────────────
export default function EpaperSection({ epaperFilters }) {
  const { user } = useAuth();
  const langMap  = { en: 'English', hi: 'Hindi', te: 'Telugu' };
  const prefLang = langMap[user?.preferences?.newsLanguage] || 'Telugu';

  const [activeLang, setActiveLang]       = useState(prefLang);
  const [date, setDate]                   = useState(todayStr());
  const [search, setSearch]               = useState('');
  const [selectedPaper, setSelectedPaper] = useState(null);

  useEffect(() => {
    if (!epaperFilters) return;
    if (epaperFilters.language) setActiveLang(epaperFilters.language);
    if (epaperFilters.date)     setDate(epaperFilters.date);
    if (epaperFilters.search !== undefined) setSearch(epaperFilters.search);
    if (epaperFilters.search) {
      const lang  = epaperFilters.language || activeLang;
      const exact = (EPAPERS[lang] || []).find(
        p => p.name.toLowerCase() === epaperFilters.search.toLowerCase()
      );
      if (exact) setSelectedPaper(exact);
    }
  }, [epaperFilters]);

  // Lock body scroll while reader is open
  useEffect(() => {
    document.body.style.overflow = selectedPaper ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [selectedPaper]);

  const papers   = EPAPERS[activeLang] || [];
  const filtered = search.trim()
    ? papers.filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    : papers;

  return (
    <div className={styles.section}>
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h2>📄 E-Papers</h2>
          <p>Read today's newspaper editions — fetched from free public sources</p>
        </div>
        <div className={styles.heroControls}>
          <div className={styles.dateRow}>
            <label>📅 Edition Date</label>
            <input type="date" className={styles.datePicker}
              value={date} max={todayStr()} onChange={e => setDate(e.target.value)} />
          </div>
          <input type="text" className={styles.search}
            placeholder="Search newspaper..." value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Language tabs */}
      <div className={styles.langTabs}>
        {Object.keys(EPAPERS).map(lang => (
          <button key={lang}
            className={`${styles.langTab} ${activeLang === lang ? styles.langActive : ''}`}
            onClick={() => { setActiveLang(lang); setSearch(''); }}>
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
            <button key={paper.id} className={styles.card} onClick={() => setSelectedPaper(paper)}>
              <div className={styles.cardTop}>
                <span className={styles.cardName}>{paper.name}</span>
                <span className={`${styles.badge} ${styles.badgeFree}`}>✅ Free</span>
              </div>
              <span className={styles.cardArrow}>📖 Read E-Paper</span>
            </button>
          ))}
        </div>
      )}

      {selectedPaper && (
        <PaperViewer paper={selectedPaper} date={date} onClose={() => setSelectedPaper(null)} />
      )}
    </div>
  );
}
