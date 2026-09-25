import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import CustomCursor from './components/CustomCursor';
// Pill menu (Header) temporarily removed — restore via .cursor/rules/pill-menu-restore.mdc
import Home, { AboutRedirect } from './pages/Home';
import Work from './pages/Work';
import Play from './pages/Play';
import Thesis from './pages/Thesis';
import Kroger from './pages/Kroger';
import HsaFsa from './pages/HsaFsa';
import DicksSportingGoods from './pages/DicksSportingGoods';
import './App.css';

const THEME_STORAGE_KEY = 'karenkodera-theme';

function getInitialTheme() {
  return 'light';
}

function AppContent() {
  const location = useLocation();
  const [cursorVariant, setCursorVariant] = useState('default');
  const [hoveredElement, setHoveredElement] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (_) {}
  }, [theme]);

  useEffect(() => {
    setCursorVariant('default');
    setHoveredElement(null);
  }, [location.pathname]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const lock = location.pathname === '/';
    document.documentElement.style.overflow = lock ? 'hidden' : '';
    document.body.style.overflow = lock ? 'hidden' : 'auto';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [location.pathname]);

  const handleCursorChange = useCallback((variant, element = null) => {
    setCursorVariant(variant);
    setHoveredElement(element);
  }, []);

  const isHome = location.pathname === '/';
  const showGrayBackground =
    isHome || location.pathname === '/work' || location.pathname === '/play';

  return (
    <div className={`app${showGrayBackground ? ' app--gray' : ''}`}>
      {showGrayBackground && <div className="site-gray-bg" aria-hidden />}
      {!isMobile && <CustomCursor cursorVariant={cursorVariant} hoveredElement={hoveredElement} />}
      <main className={isHome ? undefined : 'main--scrollable'}>
        <Routes>
          <Route path="/" element={<Home setCursorVariant={setCursorVariant} handleCursorChange={handleCursorChange} theme={theme} setTheme={setTheme} />} />
          <Route path="/work" element={<Work setCursorVariant={setCursorVariant} />} />
          <Route path="/play" element={<Play setCursorVariant={setCursorVariant} />} />
          <Route path="/thesis" element={<Thesis setCursorVariant={setCursorVariant} />} />
          <Route path="/kroger" element={<Kroger setCursorVariant={setCursorVariant} />} />
          <Route path="/hsa-fsa" element={<HsaFsa setCursorVariant={setCursorVariant} />} />
          <Route path="/dsg" element={<DicksSportingGoods setCursorVariant={setCursorVariant} />} />
          <Route path="/about" element={<AboutRedirect />} />
        </Routes>
      </main>
    </div>
  );
}

const basename = import.meta.env.BASE_URL !== '/' ? import.meta.env.BASE_URL.replace(/\/$/, '') : '';

function App() {
  return (
    <Router basename={basename}>
      <AppContent />
    </Router>
  );
}

export default App;
