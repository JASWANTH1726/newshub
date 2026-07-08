import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className={styles.nav}>
      <div className={styles.container}>
        <Link to="/dashboard" className={styles.logo}>📰 NewsHub</Link>
        <div className={styles.right}>
          <span className={styles.username}>👤 {user?.username}</span>
          <Link to="/account" className={`btn-secondary ${styles.btn}`}>⚙️ Account</Link>
          <button onClick={logout} className={`btn-secondary ${styles.btn}`}>🚪 Logout</button>
        </div>
      </div>
    </nav>
  );
}
