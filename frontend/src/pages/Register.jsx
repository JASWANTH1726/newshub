import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [showPasswords, setShowPasswords] = useState({ password: false, confirm: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'username', label: 'Username', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'confirm', label: 'Confirm Password', type: 'password' },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logo}>📰 NewsHub</div>
        <h2 className={styles.title}>Create account</h2>
        <form onSubmit={handleSubmit}>
          {fields.map(({ name, label, type }) => (
            <div className={styles.field} key={name}>
              <label>{label}</label>
              {type === 'password' ? (
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPasswords[name] ? 'text' : 'password'} required
                    value={form[name]}
                    onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPasswords(s => ({ ...s, [name]: !s[name] }))}
                  >
                    {showPasswords[name] ? 'Hide' : 'Show'}
                  </button>
                </div>
              ) : (
                <input
                  type={type} required
                  value={form[name]}
                  onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                />
              )}
            </div>
          ))}
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className={`btn-primary ${styles.submit}`} disabled={loading}>
            {loading ? 'Creating account…' : 'Register'}
          </button>
        </form>
        <p className={styles.switch}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
