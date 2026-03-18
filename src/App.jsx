import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import CustomCursor from './components/CustomCursor';
import Header from './components/Header';
import Footer from './components/Footer';
import DottedGridBackground from './components/DottedGridBackground';
import Home from './pages/Home';
import Thesis from './pages/Thesis';
import Kroger from './pages/Kroger';
import HsaFsa from './pages/HsaFsa';
import DicksSportingGoods from './pages/DicksSportingGoods';
import Play from './pages/Play';
import About from './pages/About';
import './App.css';

const THEME_STORAGE_KEY = 'karenkodera-theme';

function getInitialTheme() {
  return 'light';
}

const EMAIL_HIDE_SCROLL_THRESHOLD = 60;

function AppContent() {
  const location = useLocation();
  const [cursorVariant, setCursorVariant] = useState('default');
  const [hoveredElement, setHoveredElement] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [emailLinkHidden, setEmailLinkHidden] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (_) {}
  }, [theme]);

  // Reset cursor to dot when navigating (e.g. after clicking a case study)
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
    const onScroll = () => {
      setEmailLinkHidden(window.scrollY > EMAIL_HIDE_SCROLL_THRESHOLD);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleCursorChange = useCallback((variant, element = null) => {
    setCursorVariant(variant);
    setHoveredElement(element);
  }, []);

  const showDotBackground = location.pathname === '/' || location.pathname === '/about';

  return (
    <div className="app">
      {showDotBackground && <DottedGridBackground />}
      {!isMobile && <CustomCursor cursorVariant={cursorVariant} hoveredElement={hoveredElement} />}
      <Header setCursorVariant={setCursorVariant} handleCursorChange={handleCursorChange} />
      <a
        href="mailto:karen@kodera.us"
        className={`app-email-link${emailLinkHidden ? ' app-email-link--hidden' : ''}`}
        onMouseEnter={() => setCursorVariant('hover')}
        onMouseLeave={() => setCursorVariant('default')}
        aria-label="Email karen@kodera.us"
      >
        <svg className="app-email-icon" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
        </svg>
        karen@kodera.us
      </a>
      <main>
        <Routes>
          <Route path="/" element={<Home setCursorVariant={setCursorVariant} handleCursorChange={handleCursorChange} theme={theme} setTheme={setTheme} />} />
          <Route path="/thesis" element={<Thesis setCursorVariant={setCursorVariant} />} />
          <Route path="/kroger" element={<Kroger setCursorVariant={setCursorVariant} />} />
          <Route path="/hsa-fsa" element={<HsaFsa setCursorVariant={setCursorVariant} />} />
          <Route path="/dsg" element={<DicksSportingGoods setCursorVariant={setCursorVariant} />} />
          <Route path="/play" element={<Play setCursorVariant={setCursorVariant} handleCursorChange={handleCursorChange} />} />
          <Route path="/about" element={<About setCursorVariant={setCursorVariant} handleCursorChange={handleCursorChange} />} />
        </Routes>
      </main>
      <Footer setCursorVariant={setCursorVariant} />
    </div>
  );
}

// Match Vite base path for GitHub Pages (e.g. /karenkodera); empty string for local / custom domain
const basename = import.meta.env.BASE_URL !== '/' ? import.meta.env.BASE_URL.replace(/\/$/, '') : ''

function App() {
  return (
    <Router basename={basename}>
      <AppContent />
    </Router>
  );
}

export default App;
