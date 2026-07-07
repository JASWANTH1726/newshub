import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import styles from './Epapers.module.css';

// free: date URL works directly without login
// partial: needs login but date param is respected after login
// login: always redirects to login/home, date param ignored
const EPAPERS = {
  Telugu: [
    {
      name: 'Eenadu', logo: '📰', access: 'free',
      url: 'https://epaper.eenadu.net/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.eenadu.net/Home/Index?date=${dd}-${mm}-${yyyy}`,
      note: 'City editions available on site',
    },
    {
      name: 'Sakshi', logo: '📰', access: 'free',
      url: 'https://epaper.sakshi.com/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.sakshi.com/Home/Index?date=${dd}-${mm}-${yyyy}`,
      note: null,
    },
    {
      name: 'Andhra Jyothy', logo: '📰', access: 'free',
      url: 'https://epaper.andhrajyothy.com/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.andhrajyothy.com/Home/Index?date=${dd}-${mm}-${yyyy}`,
      note: null,
    },
    {
      name: 'Namasthe Telangana', logo: '📰', access: 'login',
      url: 'https://epaper.namasttelangana.com/',
      dateUrl: null, note: null,
    },
    {
      name: 'Vaartha', logo: '📰', access: 'login',
      url: 'https://epaper.vaartha.com/',
      dateUrl: null, note: null,
    },
    {
      name: 'Andhra Bhoomi', logo: '📰', access: 'login',
      url: 'https://epaper.andhrabhoomi.net/',
      dateUrl: null, note: null,
    },
  ],
  Hindi: [
    {
      name: 'Dainik Jagran', logo: '📰', access: 'partial',
      url: 'https://epaper.jagran.com/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.jagran.com/epaper/read.aspx?date=${yyyy}-${mm}-${dd}`,
      note: 'Login required, date respected after login',
    },
    {
      name: 'Dainik Bhaskar', logo: '📰', access: 'partial',
      url: 'https://epaper.bhaskar.com/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.bhaskar.com/epaper/read.aspx?date=${yyyy}-${mm}-${dd}`,
      note: 'Login required',
    },
    {
      name: 'Amar Ujala', logo: '📰', access: 'free',
      url: 'https://epaper.amarujala.com/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.amarujala.com/svww_index1.php?Iss_dt=${dd}-${mm}-${yyyy}`,
      note: null,
    },
    {
      name: 'Hindustan (Hindi)', logo: '📰', access: 'login',
      url: 'https://epaper.livehindustan.com/',
      dateUrl: null, note: null,
    },
    {
      name: 'Navbharat Times', logo: '📰', access: 'login',
      url: 'https://epaper.navbharattimes.indiatimes.com/',
      dateUrl: null, note: null,
    },
    {
      name: 'Rajasthan Patrika', logo: '📰', access: 'login',
      url: 'https://epaper.patrika.com/',
      dateUrl: null, note: null,
    },
  ],
  English: [
    {
      name: 'Times of India', logo: '🗞️', access: 'login',
      url: 'https://epaper.timesgroup.com/TOI/TimesOfIndia/Delhi/Home',
      dateUrl: null, note: 'Subscription required',
    },
    {
      name: 'The Hindu', logo: '🗞️', access: 'login',
      url: 'https://epaper.thehindu.com/',
      dateUrl: null, note: 'Subscription required',
    },
    {
      name: 'Indian Express', logo: '🗞️', access: 'login',
      url: 'https://epaper.indianexpress.com/',
      dateUrl: null, note: null,
    },
    {
      name: 'Hindustan Times', logo: '🗞️', access: 'login',
      url: 'https://epaper.hindustantimes.com/epaper/viewer.aspx',
      dateUrl: null, note: null,
    },
    {
      name: 'Deccan Herald', logo: '🗞️', access: 'login',
      url: 'https://epaper.deccanherald.com/',
      dateUrl: null, note: null,
    },
    {
      name: 'Deccan Chronicle', logo: '🗞️', access: 'login',
      url: 'https://epaper.deccanchronicle.com/',
      dateUrl: null, note: null,
    },
    {
      name: 'Economic Times', logo: '📊', access: 'login',
      url: 'https://epaper.economictimes.com/',
      dateUrl: null, note: null,
    },
    {
      name: 'Business Standard', logo: '📊', access: 'login',
      url: 'https://epaper.business-standard.com/',
      dateUrl: null, note: null,
    },
    {
      name: 'The Hans India', logo: '🗞️', access: 'free',
      url: 'https://www.thehansindia.com/epaper',
      dateUrl: null, note: 'Free access',
    },
  ],
  Tamil: [
    {
      name: 'Dina Thanthi', logo: '📰', access: 'free',
      url: 'https://epaper.dinathanthi.net/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.dinathanthi.net/Home/Index?date=${dd}-${mm}-${yyyy}`,
      note: null,
    },
    {
      name: 'Dinamalar', logo: '📰', access: 'free',
      url: 'https://epaper.dinamalar.com/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.dinamalar.com/epaper/index.php?date=${yyyy}-${mm}-${dd}`,
      note: null,
    },
    {
      name: 'Dinamani', logo: '📰', access: 'login',
      url: 'https://epaper.dinamani.com/',
      dateUrl: null, note: null,
    },
    {
      name: 'Maalai Malar', logo: '📰', access: 'login',
      url: 'https://epaper.maalaimalar.com/',
      dateUrl: null, note: null,
    },
  ],
  Kannada: [
    {
      name: 'Vijaya Karnataka', logo: '📰', access: 'login',
      url: 'https://epaper.vijaykarnataka.com/',
      dateUrl: null, note: null,
    },
    {
      name: 'Prajavani', logo: '📰', access: 'free',
      url: 'https://epaper.prajavani.net/',
      dateUrl: null, note: 'Free access',
    },
    {
      name: 'Vijayavani', logo: '📰', access: 'free',
      url: 'https://epaper.vijayavani.net/',
      dateUrl: null, note: 'Free access',
    },
    {
      name: 'Udayavani', logo: '📰', access: 'login',
      url: 'https://epaper.udayavani.com/',
      dateUrl: null, note: null,
    },
  ],
  Malayalam: [
    {
      name: 'Malayala Manorama', logo: '📰', access: 'login',
      url: 'https://epaper.manoramaonline.com/',
      dateUrl: null, note: 'Subscription required',
    },
    {
      name: 'Mathrubhumi', logo: '📰', access: 'login',
      url: 'https://epaper.mathrubhumi.com/',
      dateUrl: null, note: 'Subscription required',
    },
    {
      name: 'Deshabhimani', logo: '📰', access: 'free',
      url: 'https://epaper.deshabhimani.com/',
      dateUrl: null, note: 'Free access',
    },
    {
      name: 'Kerala Kaumudi', logo: '📰', access: 'free',
      url: 'https://epaper.keralakaumudi.com/',
      dateUrl: null, note: 'Free access',
    },
  ],
  Marathi: [
    {
      name: 'Lokmat', logo: '📰', access: 'free',
      url: 'https://epaper.lokmat.com/',
      dateUrl: null, note: 'Free access',
    },
    {
      name: 'Maharashtra Times', logo: '📰', access: 'login',
      url: 'https://epaper.maharashtratimes.com/',
      dateUrl: null, note: null,
    },
    {
      name: 'Sakal', logo: '📰', access: 'free',
      url: 'https://epaper.sakal.com/',
      dateUrl: null, note: 'Free access',
    },
    {
      name: 'Pudhari', logo: '📰', access: 'free',
      url: 'https://epaper.pudhari.news/',
      dateUrl: null, note: 'Free access',
    },
  ],
  Bengali: [
    {
      name: 'Anandabazar Patrika', logo: '📰', access: 'login',
      url: 'https://epaper.anandabazar.com/',
      dateUrl: null, note: 'Subscription required',
    },
    {
      name: 'Bartaman Patrika', logo: '📰', access: 'free',
      url: 'https://epaper.bartamanpatrika.com/',
      dateUrl: null, note: 'Free access',
    },
    {
      name: 'Sangbad Pratidin', logo: '📰', access: 'free',
      url: 'https://epaper.sangbadpratidin.in/',
      dateUrl: null, note: 'Free access',
    },
  ],
  Gujarati: [
    {
      name: 'Gujarat Samachar', logo: '📰', access: 'free',
      url: 'https://epaper.gujaratsamachar.com/',
      dateUrl: null, note: 'Free access',
    },
    {
      name: 'Divya Bhaskar', logo: '📰', access: 'partial',
      url: 'https://epaper.divyabhaskar.co.in/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.divyabhaskar.co.in/?date=${yyyy}-${mm}-${dd}`,
      note: 'Login required',
    },
    {
      name: 'Sandesh', logo: '📰', access: 'free',
      url: 'https://epaper.sandesh.com/',
      dateUrl: null, note: 'Free access',
    },
  ],
};

const LANG_FLAGS = {
  Telugu: '🔵', Hindi: '🇮🇳', English: '🇬🇧', Tamil: '🟠',
  Kannada: '🟡', Malayalam: '🟢', Marathi: '🟣', Bengali: '🔴', Gujarati: '🟤',
};

const LANG_CODE_MAP = {
  en: 'English', hi: 'Hindi', te: 'Telugu', ta: 'Tamil',
  kn: 'Kannada', ml: 'Malayalam', mr: 'Marathi', bn: 'Bengali', gu: 'Gujarati',
};

function toDateParts(dateStr) {
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = String(d.getFullYear());
  return { dd, mm, yyyy };
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

function AccessBadge({ paper, dd, mm, yyyy }) {
  if (paper.access === 'free' && paper.dateUrl)
    return <div className={styles.dateBadge}>✅ Date: {dd}/{mm}/{yyyy}</div>;
  if (paper.access === 'free')
    return <div className={styles.freeBadge}>✅ Free Access</div>;
  if (paper.access === 'partial')
    return <div className={styles.partialBadge}>🔑 Login → Date Works</div>;
  return <div className={styles.loginBadge}>🔐 Login / Subscription</div>;
}

export default function Epapers() {
  const { user } = useAuth();
  const prefLang = LANG_CODE_MAP[user?.preferences?.newsLanguage] || 'Telugu';
  const [selected, setSelected] = useState(prefLang);
  const [date, setDate] = useState(todayStr());

  const languages = Object.keys(EPAPERS);
  const papers = EPAPERS[selected] || [];
  const { dd, mm, yyyy } = toDateParts(date);

  const getUrl = paper => paper.dateUrl ? paper.dateUrl(dd, mm, yyyy) : paper.url;

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>📄 E-Papers</h1>
          <p>Click any card to open the e-paper. ✅ = free &amp; date-aware &nbsp;|&nbsp; 🔑 = login then date works &nbsp;|&nbsp; 🔐 = subscription required</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.datePicker}>
            <label>📅 Edition Date</label>
            <input
              type="date"
              value={date}
              max={todayStr()}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.tabs}>
          {languages.map(lang => (
            <button
              key={lang}
              className={`${styles.tab} ${selected === lang ? styles.activeTab : ''}`}
              onClick={() => setSelected(lang)}
            >
              {LANG_FLAGS[lang]} {lang}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {papers.map(paper => (
            <a
              key={paper.name}
              href={getUrl(paper)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <div className={styles.cardLogo}>{paper.logo}</div>
              <div className={styles.cardName}>{paper.name}</div>
              <AccessBadge paper={paper} dd={dd} mm={mm} yyyy={yyyy} />
              {paper.note && <div className={styles.cardNote}>{paper.note}</div>}
              <div className={styles.cardAction}>Open E-Paper →</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// dateUrl: function(dd, mm, yyyy) => url with date, or null if not supported
const EPAPERS = {
  English: [
    {
      name: 'Times of India', logo: '🗞️',
      url: 'https://epaper.timesgroup.com/TOI/TimesOfIndia/Delhi/Home',
      dateUrl: null,
    },
    {
      name: 'The Hindu', logo: '🗞️',
      url: 'https://epaper.thehindu.com/',
      dateUrl: null,
    },
    {
      name: 'Indian Express', logo: '🗞️',
      url: 'https://epaper.indianexpress.com/',
      dateUrl: null,
    },
    {
      name: 'Hindustan Times', logo: '🗞️',
      url: 'https://epaper.hindustantimes.com/epaper/viewer.aspx',
      dateUrl: null,
    },
    {
      name: 'Deccan Herald', logo: '🗞️',
      url: 'https://epaper.deccanherald.com/',
      dateUrl: null,
    },
    {
      name: 'Deccan Chronicle', logo: '🗞️',
      url: 'https://epaper.deccanchronicle.com/',
      dateUrl: null,
    },
    {
      name: 'Economic Times', logo: '📊',
      url: 'https://epaper.economictimes.com/',
      dateUrl: null,
    },
    {
      name: 'Business Standard', logo: '📊',
      url: 'https://epaper.business-standard.com/',
      dateUrl: null,
    },
    {
      name: 'The Hans India', logo: '🗞️',
      url: 'https://www.thehansindia.com/epaper',
      dateUrl: null,
    },
  ],
  Telugu: [
    {
      name: 'Eenadu', logo: '📰',
      url: 'https://epaper.eenadu.net/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.eenadu.net/Home/Index?date=${dd}-${mm}-${yyyy}`,
    },
    {
      name: 'Sakshi', logo: '📰',
      url: 'https://epaper.sakshi.com/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.sakshi.com/Home/Index?date=${dd}-${mm}-${yyyy}`,
    },
    {
      name: 'Andhra Jyothy', logo: '📰',
      url: 'https://epaper.andhrajyothy.com/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.andhrajyothy.com/Home/Index?date=${dd}-${mm}-${yyyy}`,
    },
    {
      name: 'Namasthe Telangana', logo: '📰',
      url: 'https://epaper.namasttelangana.com/',
      dateUrl: null,
    },
    {
      name: 'Vaartha', logo: '📰',
      url: 'https://epaper.vaartha.com/',
      dateUrl: null,
    },
    {
      name: 'Andhra Bhoomi', logo: '📰',
      url: 'https://epaper.andhrabhoomi.net/',
      dateUrl: null,
    },
  ],
  Hindi: [
    {
      name: 'Dainik Jagran', logo: '📰',
      url: 'https://epaper.jagran.com/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.jagran.com/epaper/read.aspx?date=${yyyy}-${mm}-${dd}`,
    },
    {
      name: 'Dainik Bhaskar', logo: '📰',
      url: 'https://epaper.bhaskar.com/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.bhaskar.com/epaper/read.aspx?date=${yyyy}-${mm}-${dd}`,
    },
    {
      name: 'Amar Ujala', logo: '📰',
      url: 'https://epaper.amarujala.com/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.amarujala.com/svww_index1.php?Iss_dt=${dd}-${mm}-${yyyy}`,
    },
    {
      name: 'Hindustan (Hindi)', logo: '📰',
      url: 'https://epaper.livehindustan.com/',
      dateUrl: null,
    },
    {
      name: 'Navbharat Times', logo: '📰',
      url: 'https://epaper.navbharattimes.indiatimes.com/',
      dateUrl: null,
    },
    {
      name: 'Rajasthan Patrika', logo: '📰',
      url: 'https://epaper.patrika.com/',
      dateUrl: null,
    },
  ],
  Tamil: [
    {
      name: 'Dina Thanthi', logo: '📰',
      url: 'https://epaper.dinathanthi.net/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.dinathanthi.net/Home/Index?date=${dd}-${mm}-${yyyy}`,
    },
    {
      name: 'Dinamalar', logo: '📰',
      url: 'https://epaper.dinamalar.com/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.dinamalar.com/epaper/index.php?date=${yyyy}-${mm}-${dd}`,
    },
    {
      name: 'Dinamani', logo: '📰',
      url: 'https://epaper.dinamani.com/',
      dateUrl: null,
    },
    {
      name: 'Maalai Malar', logo: '📰',
      url: 'https://epaper.maalaimalar.com/',
      dateUrl: null,
    },
  ],
  Kannada: [
    {
      name: 'Vijaya Karnataka', logo: '📰',
      url: 'https://epaper.vijaykarnataka.com/',
      dateUrl: null,
    },
    {
      name: 'Prajavani', logo: '📰',
      url: 'https://epaper.prajavani.net/',
      dateUrl: null,
    },
    {
      name: 'Vijayavani', logo: '📰',
      url: 'https://epaper.vijayavani.net/',
      dateUrl: null,
    },
    {
      name: 'Udayavani', logo: '📰',
      url: 'https://epaper.udayavani.com/',
      dateUrl: null,
    },
  ],
  Malayalam: [
    {
      name: 'Malayala Manorama', logo: '📰',
      url: 'https://epaper.manoramaonline.com/',
      dateUrl: null,
    },
    {
      name: 'Mathrubhumi', logo: '📰',
      url: 'https://epaper.mathrubhumi.com/',
      dateUrl: null,
    },
    {
      name: 'Deshabhimani', logo: '📰',
      url: 'https://epaper.deshabhimani.com/',
      dateUrl: null,
    },
    {
      name: 'Kerala Kaumudi', logo: '📰',
      url: 'https://epaper.keralakaumudi.com/',
      dateUrl: null,
    },
  ],
  Marathi: [
    {
      name: 'Lokmat', logo: '📰',
      url: 'https://epaper.lokmat.com/',
      dateUrl: null,
    },
    {
      name: 'Maharashtra Times', logo: '📰',
      url: 'https://epaper.maharashtratimes.com/',
      dateUrl: null,
    },
    {
      name: 'Sakal', logo: '📰',
      url: 'https://epaper.sakal.com/',
      dateUrl: null,
    },
    {
      name: 'Pudhari', logo: '📰',
      url: 'https://epaper.pudhari.news/',
      dateUrl: null,
    },
  ],
  Bengali: [
    {
      name: 'Anandabazar Patrika', logo: '📰',
      url: 'https://epaper.anandabazar.com/',
      dateUrl: null,
    },
    {
      name: 'Bartaman Patrika', logo: '📰',
      url: 'https://epaper.bartamanpatrika.com/',
      dateUrl: null,
    },
    {
      name: 'Sangbad Pratidin', logo: '📰',
      url: 'https://epaper.sangbadpratidin.in/',
      dateUrl: null,
    },
  ],
  Gujarati: [
    {
      name: 'Gujarat Samachar', logo: '📰',
      url: 'https://epaper.gujaratsamachar.com/',
      dateUrl: null,
    },
    {
      name: 'Divya Bhaskar', logo: '📰',
      url: 'https://epaper.divyabhaskar.co.in/',
      dateUrl: (dd, mm, yyyy) => `https://epaper.divyabhaskar.co.in/?date=${yyyy}-${mm}-${dd}`,
    },
    {
      name: 'Sandesh', logo: '📰',
      url: 'https://epaper.sandesh.com/',
      dateUrl: null,
    },
  ],
};

const LANG_FLAGS = {
  English: '🇬🇧', Telugu: '🔵', Hindi: '🇮🇳', Tamil: '🟠',
  Kannada: '🟡', Malayalam: '🟢', Marathi: '🟣', Bengali: '🔴', Gujarati: '🟤',
};

const LANG_CODE_MAP = {
  en: 'English', hi: 'Hindi', te: 'Telugu', ta: 'Tamil',
  kn: 'Kannada', ml: 'Malayalam', mr: 'Marathi', bn: 'Bengali', gu: 'Gujarati',
};

function toDateParts(dateStr) {
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = String(d.getFullYear());
  return { dd, mm, yyyy };
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export default function Epapers() {
  const { user } = useAuth();
  const prefLang = LANG_CODE_MAP[user?.preferences?.newsLanguage] || 'English';
  const [selected, setSelected] = useState(prefLang);
  const [date, setDate] = useState(todayStr());

  const languages = Object.keys(EPAPERS);
  const papers = EPAPERS[selected] || [];
  const { dd, mm, yyyy } = toDateParts(date);

  const getUrl = paper => {
    if (paper.dateUrl) return paper.dateUrl(dd, mm, yyyy);
    return paper.url;
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.heading}>
          <h1>📄 E-Papers</h1>
          <p>Opens based on your language preference — select a date to load that edition</p>
        </div>

        {/* Date picker + language tabs row */}
        <div className={styles.controls}>
          <div className={styles.datePicker}>
            <label>📅 Edition Date</label>
            <input
              type="date"
              value={date}
              max={todayStr()}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Language tabs */}
        <div className={styles.tabs}>
          {languages.map(lang => (
            <button
              key={lang}
              className={`${styles.tab} ${selected === lang ? styles.activeTab : ''}`}
              onClick={() => setSelected(lang)}
            >
              {LANG_FLAGS[lang]} {lang}
            </button>
          ))}
        </div>

        {/* Papers grid */}
        <div className={styles.grid}>
          {papers.map(paper => (
            <a
              key={paper.name}
              href={getUrl(paper)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
            >
              <div className={styles.cardLogo}>{paper.logo}</div>
              <div className={styles.cardName}>{paper.name}</div>
              {paper.dateUrl
                ? <div className={styles.dateBadge}>📅 {dd}/{mm}/{yyyy}</div>
                : <div className={styles.loginBadge}>🔐 Login on site</div>
              }
              <div className={styles.cardAction}>Open E-Paper →</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
