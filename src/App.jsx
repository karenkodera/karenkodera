import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CustomCursor from './components/CustomCursor';
import SiteLogo from './components/SiteLogo';
import SiteChrome from './components/SiteChrome';
import BounceCurtain from './components/BounceCurtain';
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
 * - project-in / project-out: Skiper8 bounce curtain (tan↔white); pages swap under it
 * - fade: everything else
 */
const pageVariants = {
  enter: (ctx) => {
    const kind = ctx?.kind ?? 'fade';
    const dir = ctx?.dir ?? 1;
    if (kind === 'section') {
      return { y: dir > 0 ? '40%' : '-40%', opacity: 0 };
    }
    // Project transitions: content is ready under the bounce curtain
    if (kind === 'project-in' || kind === 'project-out') {
      return { opacity: 1, y: 0 };
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
    if (kind === 'project-in' || kind === 'project-out') {
      return { opacity: 1, y: 0 };
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
  // Work (section) → case study: tan grid bounces away
  if (fromSection && toProject) return 'project-in';
  // Case study → work: white bounces away
  if (fromProject && toSection) return 'project-out';
  return 'fade';
}

function AppContent() {
  const location = useLocation();
  const [cursorVariant, setCursorVariant] = useState('default');
  const [hoveredElement, setHoveredElement] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [curtain, setCurtain] = useState(null); // { tone, key } | null
  // path tracked so we can derive kind synchronously on the navigating render
  const [navMeta, setNavMeta] = useState(() => ({
    path: location.pathname,
    kind: 'fade',
    dir: 1,
  }));

  // Adjust transition meta during render when the route changes (covers first paint)
  if (navMeta.path !== location.pathname) {
    const nextKind = transitionKind(navMeta.path, location.pathname);
    const nextDir = location.state?.pageDir ?? pageDirRef.current;
    setNavMeta({ path: location.pathname, kind: nextKind, dir: nextDir });
    if (nextKind === 'project-in') {
      setCurtain({ tone: 'tan', key: location.key });
    } else if (nextKind === 'project-out') {
      setCurtain({ tone: 'white', key: location.key });
    }
  }

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
  const kind = navMeta.kind;
  const transitionCustom = { kind: navMeta.kind, dir: navMeta.dir };

  const clearCurtain = useCallback(() => {
    setCurtain(null);
  }, []);

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

  const transitionDuration =
    kind === 'section' ? 0.52 : kind === 'project-in' || kind === 'project-out' ? 0.01 : 0.28;

  return (
    <div className={`app${showGrayBackground ? ' app--gray' : ''}`}>
      {showGrayBackground && <div className="site-gray-bg" aria-hidden />}
      <SiteLogo setCursorVariant={setCursorVariant} />
      <SiteChrome setCursorVariant={setCursorVariant} />
      {!isMobile && <CustomCursor cursorVariant={cursorVariant} hoveredElement={hoveredElement} />}
      {curtain && (
        <BounceCurtain
          tone={curtain.tone}
          animKey={curtain.key}
          onComplete={clearCurtain}
        />
      )}
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
