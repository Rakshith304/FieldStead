import { useEffect, useState } from 'react';
import { BrowserRouter, Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { ArrowRight, Boxes, Leaf, LogOut, MapPin, MessageCircle, Tractor } from 'lucide-react';
import Equipment from './pages/Equipment.jsx';
import EquipmentDetail from './pages/EquipmentDetail.jsx';
import Login from './pages/Login.jsx';
import Rentals from './pages/Rentals.jsx';

function readSession() {
  try {
    const session = JSON.parse(localStorage.getItem('user') || 'null');
    if (session?.token && session?.id && session?.role) return session;
  } catch {
    localStorage.removeItem('user');
  }
  return null;
}

function Guard({ user, role, children }) {
  const location = useLocation();
  if (!user?.token) return <Navigate to="/login" replace state={{ from: location }} />;
  if (role && user.role !== role) return <Navigate to="/catalog" replace />;
  return children;
}

function AppFrame({ user, onLogout }) {
  const location = useLocation();
  const onCatalog = location.pathname === '/catalog' || location.pathname.startsWith('/equipment/');
  return (
    <div className="app-frame">
      <header className="site-header">
        <Link className="brand" to="/catalog" aria-label="Fieldstead home">
          <span className="brand-mark"><Tractor size={21} strokeWidth={1.8} /></span>
          <span><strong>Fieldstead</strong><small>Equipment exchange</small></span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link className={onCatalog ? 'nav-link active' : 'nav-link'} to="/catalog"><Boxes size={16} /> Equipment</Link>
          {user && <Link className={location.pathname === '/rentals' ? 'nav-link active' : 'nav-link'} to="/rentals"><Leaf size={16} /> {user.role === 'ADMIN' ? 'Rental desk' : 'My rentals'}</Link>}
          <Link className="nav-link" to="/catalog#contact"><MessageCircle size={15} /> Contact</Link>
          <Link className="nav-link nav-location" to="/catalog#location"><MapPin size={15} /> Location</Link>
        </nav>
        <div className="header-account">
          {user ? <>
            <span className="account-name"><span className="online-dot" />{user.name}</span>
            <button className="icon-button" type="button" onClick={onLogout} aria-label="Sign out" title="Sign out"><LogOut size={17} /></button>
          </> : <Link className="header-login" to="/login">Sign in <ArrowRight size={15} /></Link>}
        </div>
      </header>
      <main className="main-content"><Outlet /></main>
      <footer className="site-footer">
        <div className="footer-brand">
          <Link className="brand footer-logo" to="/catalog"><span className="brand-mark"><Tractor size={19} /></span><span><strong>Fieldstead</strong><small>Equipment exchange</small></span></Link>
          <p>Good equipment, shared locally.<br />More time for the work that matters.</p>
          <span className="footer-demo-note">Demo contact details — replace before launch.</span>
        </div>
        <div className="footer-links"><strong>Explore</strong><Link to="/catalog">Browse equipment</Link>{user && <Link to="/rentals">{user.role === 'ADMIN' ? 'Rental desk' : 'My rentals'}</Link>}<Link to="/catalog#contact">Contact us</Link></div>
        <div className="footer-contact" id="location"><strong>Find us</strong><a href="mailto:hello@fieldstead.example">hello@fieldstead.example</a><a href="tel:+910000000000">+91 00000 00000 <span>(demo)</span></a><a href="https://www.google.com/maps/search/?api=1&query=Demo+Farm+Bengaluru+India" target="_blank" rel="noreferrer">Demo farm · Bengaluru, India <MapPin size={14} /></a></div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} Fieldstead <span className="footer-dot">/</span> Built for working farms</span><span>Plan well. Work the land.</span></div>
      </footer>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(readSession);
  useEffect(() => {
    const expireSession = () => { localStorage.removeItem('user'); setUser(null); };
    window.addEventListener('auth:expired', expireSession);
    return () => window.removeEventListener('auth:expired', expireSession);
  }, []);

  function login(session) {
    localStorage.setItem('user', JSON.stringify(session));
    setUser(session);
  }

  function logout() {
    localStorage.removeItem('user');
    setUser(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppFrame user={user} onLogout={logout} />}>
          <Route index element={<Navigate to="/catalog" replace />} />
          <Route path="catalog" element={<Equipment user={user} />} />
          <Route path="equipment/:id" element={<EquipmentDetail user={user} />} />
          <Route path="login" element={user ? <Navigate to="/catalog" replace /> : <Login onLogin={login} />} />
          <Route path="rentals" element={<Guard user={user}><Rentals user={user} /></Guard>} />
          <Route path="*" element={<Navigate to="/catalog" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
