import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import CustomCursor from './components/CustomCursor';
import Header from './components/Header';
import Footer from './components/Footer';
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
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  } catch (_) {}
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

  const handleCursorChange = useCallback((variant, element = null) => {
    setCursorVariant(variant);
    setHoveredElement(element);
  }, []);

  return (
    <div className="app">
      {!isMobile && <CustomCursor cursorVariant={cursorVariant} hoveredElement={hoveredElement} />}
      <Header setCursorVariant={setCursorVariant} handleCursorChange={handleCursorChange} hoveredElement={hoveredElement} />
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

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
