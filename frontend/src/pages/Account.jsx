import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../services/api';
import styles from './Account.module.css';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'te', label: 'Telugu' },
];

const AREAS = [
  { value: 'national', label: 'National (All India)' },
  { value: 'international', label: 'International' },
  { label: '-- Andhra Pradesh --', disabled: true },
  { value: 'vizag', label: 'Vizag (Visakhapatnam)' },
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
  { label: '-- Delhi / NCR --', disabled: true },
  { value: 'delhi', label: 'New Delhi' },
  { value: 'noida', label: 'Noida' },
  { value: 'gurgaon', label: 'Gurgaon' },
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
  { label: '-- Bihar --', disabled: true },
  { value: 'patna', label: 'Patna' },
  { label: '-- Other Cities --', disabled: true },
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'pune', label: 'Pune' },
  { value: 'bangalore', label: 'Bangalore' },
  { value: 'chennai', label: 'Chennai' },
  { value: 'kolkata', label: 'Kolkata' },
  { value: 'ahmedabad', label: 'Ahmedabad' },
  { value: 'chandigarh', label: 'Chandigarh' },
  { value: 'amritsar', label: 'Amritsar' },
];

const NEWSPAPERS_BY_LANG = {
  en: [
    { value: '', label: '-- No preference --' },
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
    { value: '', label: '-- No preference --' },
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
    { value: '', label: '-- No preference --' },
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

export default function Account() {
  const { user, updateUser } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [showPw, setShowPw] = useState({ old: false, new: false, confirm: false });
  const [prefs, setPrefs] = useState(user?.preferences || {});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPrefs(p => ({ ...p, newspaper: '' }));
  }, [prefs.newsLanguage]);

  const newspapers = NEWSPAPERS_BY_LANG[prefs.newsLanguage || 'en'] || NEWSPAPERS_BY_LANG['en'];

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleUpdateProfile = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/api/user/profile', { email });
      updateUser(res.data.user);
      showMsg('success', 'Profile updated successfully!');
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const handleChangePassword = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/api/user/password', {
        oldPassword: passwords.old,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm,
      });
      setPasswords({ old: '', new: '', confirm: '' });
      showMsg('success', 'Password changed successfully!');
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Password change failed');
    } finally { setLoading(false); }
  };

  const handleUpdatePreferences = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/api/user/preferences', prefs);
      updateUser({ preferences: res.data.preferences });
      showMsg('success', 'Preferences saved!');
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Save failed');
    } finally { setLoading(false); }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>Account Settings</h1>

        {message.text && (
          <div className={`${styles.alert} ${message.type === 'success' ? styles.success : styles.error}`}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        {/* Profile */}
        <section className={styles.section}>
          <h2>👤 Profile</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className={styles.field}>
              <label>Username</label>
              <input type="text" value={user?.username || ''} disabled />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              Update Profile
            </button>
          </form>
        </section>

        {/* Change Password */}
        <section className={styles.section}>
          <h2>🔒 Change Password</h2>
          <form onSubmit={handleChangePassword}>
            {[
              { key: 'old', label: 'Current Password' },
              { key: 'new', label: 'New Password' },
              { key: 'confirm', label: 'Confirm New Password' },
            ].map(({ key, label }) => (
              <div className={styles.field} key={key}>
                <label>{label}</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPw[key] ? 'text' : 'password'}
                    value={passwords[key]}
                    onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPw(s => ({ ...s, [key]: !s[key] }))}
                  >
                    {showPw[key] ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            ))}
            <button type="submit" className="btn-primary" disabled={loading}>
              Change Password
            </button>
          </form>
        </section>

        {/* Preferences */}
        <section className={styles.section}>
          <h2>📰 Preferences</h2>
          <form onSubmit={handleUpdatePreferences}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>🌐 UI Language</label>
                <select
                  value={prefs.uiLanguage || 'en'}
                  onChange={e => setPrefs(p => ({ ...p, uiLanguage: e.target.value }))}
                >
                  {LANGUAGES.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>📰 News Language</label>
                <select
                  value={prefs.newsLanguage || 'en'}
                  onChange={e => setPrefs(p => ({ ...p, newsLanguage: e.target.value }))}
                >
                  {LANGUAGES.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>📍 Default Area</label>
                <select
                  value={prefs.area || 'national'}
                  onChange={e => setPrefs(p => ({ ...p, area: e.target.value }))}
                >
                  {AREAS.map((a, i) =>
                    a.disabled
                      ? <option key={i} disabled>{a.label}</option>
                      : <option key={a.value} value={a.value}>{a.label}</option>
                  )}
                </select>
              </div>
              <div className={styles.field}>
                <label>🗞️ Default Newspaper</label>
                <select
                  value={prefs.newspaper || ''}
                  onChange={e => setPrefs(p => ({ ...p, newspaper: e.target.value }))}
                >
                  {newspapers.map((n, i) =>
                    n.disabled
                      ? <option key={i} disabled>{n.label}</option>
                      : <option key={n.value} value={n.value}>{n.label}</option>
                  )}
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label>🔖 Default Keywords (comma-separated)</label>
              <textarea
                rows={3}
                placeholder="e.g. technology, cricket, politics"
                value={prefs.keywords || ''}
                onChange={e => setPrefs(p => ({ ...p, keywords: e.target.value }))}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              Save Preferences
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
