import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './FilterPanel.module.css';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'te', label: 'Telugu' },
];

const AREAS_BY_LANG = {
  en: [
    { value: '', label: '-- All Areas --' },
    { value: 'national', label: 'National (All India)' },
    { value: 'international', label: 'International' },
    { label: '-- North India --', disabled: true },
    { value: 'delhi', label: 'New Delhi' },
    { value: 'noida', label: 'Noida' },
    { value: 'gurgaon', label: 'Gurgaon' },
    { value: 'lucknow', label: 'Lucknow' },
    { value: 'kanpur', label: 'Kanpur' },
    { value: 'varanasi', label: 'Varanasi' },
    { value: 'chandigarh', label: 'Chandigarh' },
    { value: 'amritsar', label: 'Amritsar' },
    { label: '-- South India --', disabled: true },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'chennai', label: 'Chennai' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'kochi', label: 'Kochi' },
    { label: '-- West India --', disabled: true },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'pune', label: 'Pune' },
    { value: 'ahmedabad', label: 'Ahmedabad' },
    { label: '-- East India --', disabled: true },
    { value: 'kolkata', label: 'Kolkata' },
    { value: 'patna', label: 'Patna' },
  ],
  hi: [
    { value: '', label: '-- All Areas --' },
    { value: 'national', label: 'National (All India)' },
    { label: '-- Uttar Pradesh --', disabled: true },
    { value: 'lucknow', label: 'Lucknow' },
    { value: 'kanpur', label: 'Kanpur' },
    { value: 'varanasi', label: 'Varanasi' },
    { value: 'agra', label: 'Agra' },
    { value: 'meerut', label: 'Meerut' },
    { label: '-- Rajasthan --', disabled: true },
    { value: 'jaipur', label: 'Jaipur' },
    { value: 'jodhpur', label: 'Jodhpur' },
    { value: 'udaipur', label: 'Udaipur' },
    { label: '-- Madhya Pradesh --', disabled: true },
    { value: 'bhopal', label: 'Bhopal' },
    { value: 'indore', label: 'Indore' },
    { label: '-- Delhi / NCR --', disabled: true },
    { value: 'delhi', label: 'New Delhi' },
    { value: 'noida', label: 'Noida' },
    { value: 'gurgaon', label: 'Gurgaon' },
    { label: '-- Bihar --', disabled: true },
    { value: 'patna', label: 'Patna' },
  ],
  te: [
    { value: '', label: '-- All Areas --' },
    { value: 'national', label: 'National (All India)' },
    { label: '-- Andhra Pradesh --', disabled: true },
    { value: 'vizag', label: 'Visakhapatnam (Vizag)' },
    { value: 'vijayawada', label: 'Vijayawada' },
    { value: 'guntur', label: 'Guntur' },
    { value: 'tirupati', label: 'Tirupati' },
    { value: 'kurnool', label: 'Kurnool' },
    { value: 'nellore', label: 'Nellore' },
    { value: 'rajahmundry', label: 'Rajahmundry' },
    { value: 'kakinada', label: 'Kakinada' },
    { value: 'eluru', label: 'Eluru' },
    { value: 'ongole', label: 'Ongole' },
    { value: 'kadapa', label: 'Kadapa' },
    { value: 'anantapur', label: 'Anantapur' },
    { value: 'srikakulam', label: 'Srikakulam' },
    { value: 'vizianagaram', label: 'Vizianagaram' },
    { label: '-- Telangana --', disabled: true },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'hyderabad_hitech', label: 'Hyderabad - HiTech City' },
    { value: 'hyderabad_secunderabad', label: 'Secunderabad' },
    { value: 'warangal', label: 'Warangal' },
    { value: 'karimnagar', label: 'Karimnagar' },
    { value: 'nizamabad', label: 'Nizamabad' },
    { value: 'khammam', label: 'Khammam' },
    { value: 'nalgonda', label: 'Nalgonda' },
    { value: 'adilabad', label: 'Adilabad' },
  ],
};

const NEWSPAPERS_BY_LANG = {
  en: [
    { value: '', label: '-- All Newspapers --' },
    { label: '-- National --', disabled: true },
    { value: 'times_of_india', label: 'Times of India' },
    { value: 'the_hindu', label: 'The Hindu' },
    { value: 'indian_express', label: 'The Indian Express' },
    { value: 'hindustan_times', label: 'Hindustan Times' },
    { value: 'deccan_herald', label: 'Deccan Herald' },
    { value: 'deccan_chronicle', label: 'Deccan Chronicle' },
    { value: 'new_indian_express', label: 'New Indian Express' },
    { value: 'economic_times', label: 'Economic Times' },
    { value: 'business_standard', label: 'Business Standard' },
    { label: '-- International --', disabled: true },
    { value: 'bbc', label: 'BBC News' },
    { value: 'reuters', label: 'Reuters' },
    { value: 'guardian', label: 'The Guardian' },
    { value: 'al_jazeera', label: 'Al Jazeera' },
    { value: 'cnn', label: 'CNN' },
  ],
  hi: [
    { value: '', label: '-- All Newspapers --' },
    { value: 'dainik_jagran', label: 'Dainik Jagran' },
    { value: 'dainik_bhaskar', label: 'Dainik Bhaskar' },
    { value: 'amar_ujala', label: 'Amar Ujala' },
    { value: 'hindustan_hindi', label: 'Hindustan (Hindi)' },
    { value: 'navbharat_times', label: 'Navbharat Times' },
    { value: 'rajasthan_patrika', label: 'Rajasthan Patrika' },
    { value: 'jansatta', label: 'Jansatta' },
    { value: 'nai_dunia', label: 'Nai Dunia' },
    { value: 'haribhoomi', label: 'Haribhoomi' },
    { value: 'punjab_kesari', label: 'Punjab Kesari' },
  ],
  te: [
    { value: '', label: '-- All Newspapers --' },
    { value: 'eenadu', label: 'Eenadu' },
    { value: 'sakshi', label: 'Sakshi' },
    { value: 'andhrajyothy', label: 'Andhra Jyothy' },
    { value: 'namaste_telangana', label: 'Namasthe Telangana' },
    { value: 'telangana_today', label: 'Telangana Today' },
    { value: 'vaartha', label: 'Vaartha' },
    { value: 'great_andhra', label: 'Great Andhra' },
    { value: 'andhra_bhoomi', label: 'Andhra Bhoomi' },
    { value: 'prajasakti', label: 'Prajasakti' },
    { value: 'suryaa', label: 'Suryaa' },
  ],
};

const NEWSPAPER_LABEL_MAP = {
  times_of_india: 'Times of India', the_hindu: 'The Hindu',
  indian_express: 'The Indian Express', hindustan_times: 'Hindustan Times',
  deccan_herald: 'Deccan Herald', deccan_chronicle: 'Deccan Chronicle',
  new_indian_express: 'New Indian Express', economic_times: 'Economic Times',
  business_standard: 'Business Standard', bbc: 'BBC News', reuters: 'Reuters',
  guardian: 'The Guardian', al_jazeera: 'Al Jazeera', cnn: 'CNN',
  dainik_jagran: 'Dainik Jagran', dainik_bhaskar: 'Dainik Bhaskar',
  amar_ujala: 'Amar Ujala', hindustan_hindi: 'Hindustan (Hindi)',
  navbharat_times: 'Navbharat Times', rajasthan_patrika: 'Rajasthan Patrika',
  jansatta: 'Jansatta', nai_dunia: 'Nai Dunia', haribhoomi: 'Haribhoomi',
  punjab_kesari: 'Punjab Kesari', eenadu: 'Eenadu', sakshi: 'Sakshi',
  andhrajyothy: 'Andhra Jyothy', namaste_telangana: 'Namasthe Telangana',
  telangana_today: 'Telangana Today', vaartha: 'Vaartha',
  great_andhra: 'Great Andhra', andhra_bhoomi: 'Andhra Bhoomi',
  prajasakti: 'Prajasakti', suryaa: 'Suryaa',
};

const LANG_LABEL = { en: 'English', hi: 'Hindi', te: 'Telugu' };

const KEYWORD_SUGGESTIONS = {
  'Politics':   ['Politics', 'Election', 'Parliament', 'Government', 'BJP', 'Congress'],
  'Business':   ['Business', 'Economy', 'Stock Market', 'Finance', 'Budget', 'RBI'],
  'Technology': ['Technology', 'AI', 'Startup', 'Mobile', 'Cyber', 'Space'],
  'Sports':     ['Cricket', 'Football', 'IPL', 'Olympics', 'Tennis', 'Kabaddi'],
  'Health':     ['Health', 'COVID', 'Hospital', 'Medicine', 'Fitness', 'Mental Health'],
  'Education':  ['Education', 'UPSC', 'JEE', 'NEET', 'University', 'School'],
  'Crime':      ['Crime', 'Police', 'Court', 'Arrest', 'Fraud', 'Scam'],
  'Weather':    ['Weather', 'Flood', 'Cyclone', 'Rain', 'Drought', 'Earthquake'],
};

export default function FilterPanel({ onFilter, mode, onModeChange }) {
  const { user } = useAuth();
  const pref = user?.preferences || {};
  const [open, setOpen] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [activeSuggestionGroup, setActiveSuggestionGroup] = useState(null);
  const [filters, setFilters] = useState({
    language: pref.newsLanguage || 'en',
    area: pref.area || 'national',
    newspaper: pref.newspaper || '',
    fromDate: '',
    keywords: pref.keywords || '',
  });

  useEffect(() => {
    setFilters(f => ({ ...f, area: 'national', newspaper: '' }));
  }, [filters.language]);

  useEffect(() => {
    if (pref.keywords) setFilters(f => ({ ...f, keywords: pref.keywords }));
  }, [pref.keywords]);

  const areas = AREAS_BY_LANG[filters.language] || AREAS_BY_LANG.en;
  const newspapers = NEWSPAPERS_BY_LANG[filters.language] || NEWSPAPERS_BY_LANG.en;
  const keywordList = filters.keywords
    ? filters.keywords.split(',').map(k => k.trim()).filter(Boolean)
    : [];

  const addKeyword = kw => {
    const trimmed = kw.trim();
    if (!trimmed || keywordList.includes(trimmed)) return;
    setFilters(f => ({ ...f, keywords: [...keywordList, trimmed].join(', ') }));
    setKeywordInput('');
  };

  const removeKeyword = kw =>
    setFilters(f => ({ ...f, keywords: keywordList.filter(k => k !== kw).join(', ') }));

  const handleKeywordKeyDown = e => {
    if (e.key === 'Enter') { e.preventDefault(); addKeyword(keywordInput); }
    if (e.key === ',')     { e.preventDefault(); addKeyword(keywordInput); }
  };

  const handleSubmit = e => {
    e.preventDefault();
    // For epaper mode: pass language + newspaper name as search + freeOnly from keywords
    const epaperSearch = filters.newspaper ? NEWSPAPER_LABEL_MAP[filters.newspaper] || '' : '';
    onFilter({ ...filters, epaperLang: LANG_LABEL[filters.language], epaperSearch });
    setOpen(false);
  };

  const handleReset = () => {
    const reset = {
      language: pref.newsLanguage || 'en',
      area: pref.area || 'national',
      newspaper: pref.newspaper || '',
      fromDate: '',
      keywords: pref.keywords || '',
    };
    setFilters(reset);
    onFilter({ ...reset, epaperLang: LANG_LABEL[reset.language], epaperSearch: '' });
  };

  return (
    <div className={styles.panel}>
      {/* Mode toggle + filter toggle */}
      <div className={styles.modeBar}>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === 'epaper' ? styles.modeActive : ''}`}
          onClick={() => onModeChange('epaper')}
        >
          📄 E-Paper
        </button>
        <button
          type="button"
          className={`${styles.modeBtn} ${mode === 'news' ? styles.modeActive : ''}`}
          onClick={() => onModeChange('news')}
        >
          🌐 Digital News
        </button>
        <button
          type="button"
          className={styles.filterToggleBtn}
          onClick={() => setOpen(o => !o)}
        >
          🎛️ Filters {open ? '▲' : '▼'}
        </button>
      </div>

      {open && (
        <div className={styles.body}>
          <form onSubmit={handleSubmit}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>📰 Language</label>
                <select value={filters.language} onChange={e => setFilters(f => ({ ...f, language: e.target.value }))}>
                  {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label>📍 Area</label>
                <select value={filters.area} onChange={e => setFilters(f => ({ ...f, area: e.target.value }))}>
                  {areas.map((a, i) => a.disabled
                    ? <option key={i} disabled>{a.label}</option>
                    : <option key={a.value} value={a.value}>{a.label}</option>
                  )}
                </select>
              </div>
              <div className={styles.field}>
                <label>🗞️ Newspaper</label>
                <select value={filters.newspaper} onChange={e => setFilters(f => ({ ...f, newspaper: e.target.value }))}>
                  {newspapers.map((n, i) => n.disabled
                    ? <option key={i} disabled>{n.label}</option>
                    : <option key={n.value} value={n.value}>{n.label}</option>
                  )}
                </select>
              </div>
              <div className={styles.field}>
                <label>📅 From Date</label>
                <input type="date" value={filters.fromDate} onChange={e => setFilters(f => ({ ...f, fromDate: e.target.value }))} />
              </div>
            </div>

            {/* Keyword filter */}
            <div className={styles.keywordSection}>
              <label>🔖 Keywords</label>
              <div className={styles.keywordInputRow}>
                <input
                  type="text"
                  className={styles.keywordInput}
                  placeholder="Type keyword and press Enter or comma..."
                  value={keywordInput}
                  onChange={e => setKeywordInput(e.target.value)}
                  onKeyDown={handleKeywordKeyDown}
                />
                <button type="button" className={styles.addBtn} onClick={() => addKeyword(keywordInput)}>+ Add</button>
              </div>
              {keywordList.length > 0 && (
                <div className={styles.tags}>
                  {keywordList.map(k => (
                    <span key={k} className={styles.tag}>
                      {k}
                      <button type="button" onClick={() => removeKeyword(k)}>×</button>
                    </span>
                  ))}
                </div>
              )}
              <div className={styles.suggestions}>
                <span className={styles.suggestLabel}>Quick add:</span>
                {Object.keys(KEYWORD_SUGGESTIONS).map(group => (
                  <div key={group} className={styles.suggestionGroup}>
                    <button
                      type="button"
                      className={`${styles.groupBtn} ${activeSuggestionGroup === group ? styles.groupActive : ''}`}
                      onClick={() => setActiveSuggestionGroup(g => g === group ? null : group)}
                    >
                      {group}
                    </button>
                    {activeSuggestionGroup === group && (
                      <div className={styles.suggestionChips}>
                        {KEYWORD_SUGGESTIONS[group].map(kw => (
                          <button
                            key={kw}
                            type="button"
                            className={`${styles.chip} ${keywordList.includes(kw) ? styles.chipActive : ''}`}
                            onClick={() => keywordList.includes(kw) ? removeKeyword(kw) : addKeyword(kw)}
                          >
                            {keywordList.includes(kw) ? '✓ ' : '+ '}{kw}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.actions}>
              <button type="submit" className="btn-primary">🔍 Apply</button>
              <button type="button" className="btn-secondary" onClick={handleReset}>Reset</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
