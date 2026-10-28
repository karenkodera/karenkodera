import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import SiteLogo from './components/SiteLogo';
import SiteChrome from './components/SiteChrome';
// Pill menu (Header) temporarily removed — restore via .cursor/rules/pill-menu-restore.mdc
import Home from './pages/Home';
import Work from './pages/Work';
import Play from './pages/Play';
import About from './pages/About';
import Thesis from './pages/Thesis';
import Kroger from './pages/Kroger';
import HsaFsa from './pages/HsaFsa';
import DicksSportingGoods from './pages/DicksSportingGoods';
import { WORK_PROJECT_PATHS } from './data/workProjects';
import { SECTION_PATHS, pageDirRef, useSectionPager } from './hooks/useSectionPager';
import './App.css';

const PAGE_EASE = [0.76, 0, 0.24, 1];

/**
 * kind:
 * - section: vertical page between work/about/play
 * - project-in: work (etc) stays put/fades; case study scrolls up into view
 * - project-out: case study scrolls down away; destination fades in
 * - fade: everything else
 */
const pageVariants = {
  enter: (ctx) => {
    const kind = ctx?.kind ?? 'fade';
    const dir = ctx?.dir ?? 1;
    if (kind === 'section') {
      return { y: dir > 0 ? '40%' : '-40%', opacity: 0 };
    }
    if (kind === 'project-in') {
      return { y: '55%', opacity: 1 };
    }
    return { opacity: 0, y: 0 };
  },
  center: {
    y: 0,
    opacity: 1,
  },
  exit: (ctx) => {
    const kind = ctx?.kind ?? 'fade';
    const dir = ctx?.dir ?? 1;
    if (kind === 'section') {
      return { y: dir > 0 ? '-40%' : '40%', opacity: 0 };
    }
    if (kind === 'project-in') {
      // Leaving work: fade only — don't scroll the home page away
      return { opacity: 0, y: 0 };
    }
    if (kind === 'project-out') {
      // Leaving case study: scroll it back down
      return { y: '55%', opacity: 1 };
    }
    return { opacity: 0, y: 0 };
  },
};

const THEME_STORAGE_KEY = 'karenkodera-theme';

function getInitialTheme() {
  return 'light';
}

function transitionKind(fromPath, toPath) {
  const fromSection = SECTION_PATHS.includes(fromPath);
  const toSection = SECTION_PATHS.includes(toPath);
  const fromProject = WORK_PROJECT_PATHS.includes(fromPath);
  const toProject = WORK_PROJECT_PATHS.includes(toPath);

  if (fromSection && toSection) return 'section';
  if (toProject) return 'project-in';
  if (fromProject) return 'project-out';
  return 'fade';
}

function AppContent() {
  const location = useLocation();
  const [cursorVariant, setCursorVariant] = useState('default');
  const [hoveredElement, setHoveredElement] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const prevPathRef = useRef(location.pathname);

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

  const isTabPage = SECTION_PATHS.includes(location.pathname);
  const kind = transitionKind(prevPathRef.current, location.pathname);
  const transitionCustom = {
    kind,
    dir: location.state?.pageDir ?? pageDirRef.current,
  };

  useEffect(() => {
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    const lock = isTabPage;
    document.documentElement.style.overflow = lock ? 'hidden' : '';
    document.body.style.overflow = lock ? 'hidden' : 'auto';
    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [isTabPage]);

  useSectionPager();

  const handleCursorChange = useCallback((variant, element = null) => {
    setCursorVariant(variant);
    setHoveredElement(element);
  }, []);

  const isHome = location.pathname === '/';
  const showGrayBackground =
    isHome ||
    location.pathname === '/work' ||
    location.pathname === '/play' ||
    location.pathname === '/about';

  const transitionDuration = kind === 'section' ? 0.52 : kind === 'project-in' || kind === 'project-out' ? 0.58 : 0.28;

  return (
    <div className={`app${showGrayBackground ? ' app--gray' : ''}`}>
      {showGrayBackground && <div className="site-gray-bg" aria-hidden />}
      <SiteLogo setCursorVariant={setCursorVariant} />
      <SiteChrome setCursorVariant={setCursorVariant} />
      {!isMobile && <CustomCursor cursorVariant={cursorVariant} hoveredElement={hoveredElement} />}
      {/*
        Keep <main> class stable across routes. Swapping main--home / main--scrollable
        during AnimatePresence interrupts the exit animation, so the URL updates
        but the work page never unmounts (cards look like they don't link).
      */}
      <main className="main-shell">
        <AnimatePresence mode="wait" initial={false} custom={transitionCustom}>
          <motion.div
            key={location.pathname}
            className={`page-transition${isTabPage ? ' page-transition--home' : ' page-transition--scroll'}`}
            custom={transitionCustom}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: transitionDuration, ease: PAGE_EASE }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home setCursorVariant={setCursorVariant} handleCursorChange={handleCursorChange} theme={theme} setTheme={setTheme} />} />
              <Route path="/work" element={<Work setCursorVariant={setCursorVariant} />} />
              <Route path="/play" element={<Play setCursorVariant={setCursorVariant} />} />
              <Route path="/thesis" element={<Thesis setCursorVariant={setCursorVariant} />} />
              <Route path="/kroger" element={<Kroger setCursorVariant={setCursorVariant} />} />
              <Route path="/hsa-fsa" element={<HsaFsa setCursorVariant={setCursorVariant} />} />
              <Route path="/dsg" element={<DicksSportingGoods setCursorVariant={setCursorVariant} />} />
              <Route path="/about" element={<About setCursorVariant={setCursorVariant} />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
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
