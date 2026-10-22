import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CONTACT_LINKS, RESUME_URL } from '../components/Hero';
import IntroSplash from '../components/IntroSplash';
import ProjectCard from '../components/ProjectCard';
import PasswordGate from '../components/PasswordGate';
import ScrollRuler from '../components/ScrollRuler';
import { WORK_PROJECTS } from '../data/workProjects';
import './Home.css';

const NAV_SECTIONS = [
  { id: 'work', label: 'work', type: 'home' },
  { id: 'play', label: 'play', type: 'route', path: '/play' },
  { id: 'about', label: 'about', type: 'route', path: '/about' },
];

function buildWorkStream() {
  return WORK_PROJECTS.map((project, workIdx) => {
    const float =
      workIdx % 4 === 0
        ? 'float-up'
        : workIdx % 4 === 1
          ? 'float-down'
          : workIdx % 4 === 2
            ? 'float-mid-up'
            : 'float-mid-down';
    return {
      kind: 'work',
      key: project.id,
      project,
      float,
    };
  });
}

const WORK_STREAM = buildWorkStream();
const INTRO_SESSION_KEY = 'karenkodera-intro-done';

const Home = ({ setCursorVariant }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const scrollerRef = useRef(null);
  const [protectedPath, setProtectedPath] = useState(null);
  const [scrollEdge, setScrollEdge] = useState('start'); // start | middle | end
  const [introDone, setIntroDone] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      return sessionStorage.getItem(INTRO_SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });

  const handleIntroComplete = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    } catch {
      /* ignore */
    }
    setIntroDone(true);
  }, []);

  useEffect(() => {
    if (introDone) {
      setCursorVariant?.('default');
      document.documentElement.removeAttribute('data-intro');
      return undefined;
    }
    setCursorVariant?.('intro');
    document.documentElement.setAttribute('data-intro', '1');
    return () => {
      setCursorVariant?.('default');
      document.documentElement.removeAttribute('data-intro');
    };
  }, [introDone, setCursorVariant]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    let rafId = 0;
    let pendingDelta = 0;

    const flush = () => {
      rafId = 0;
      if (pendingDelta === 0) return;
      const next = scroller.scrollLeft + pendingDelta;
      pendingDelta = 0;
      scroller.scrollLeft = next;
    };

    const queueHorizontal = (delta) => {
      if (!delta) return;
      pendingDelta += delta;
      if (!rafId) rafId = requestAnimationFrame(flush);
    };

    const onWheel = (e) => {
      if (
        !introDone ||
        document.querySelector('.play-modal-overlay') ||
        document.querySelector('.password-gate')
      ) {
        return;
      }

      let delta = e.deltaY + e.deltaX;
      if (delta === 0) return;

      if (e.deltaMode === 1) delta *= 16;
      else if (e.deltaMode === 2) delta *= window.innerWidth;

      e.preventDefault();
      queueHorizontal(delta);
    };

    const onKeyDown = (e) => {
      if (
        !introDone ||
        document.querySelector('.play-modal-overlay') ||
        document.querySelector('.password-gate')
      ) {
        return;
      }
      const tag = e.target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) {
        return;
      }

      const page = Math.max(240, Math.floor(window.innerWidth * 0.55));
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        queueHorizontal(page);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        queueHorizontal(-page);
      } else if (e.key === 'Home') {
        e.preventDefault();
        scroller.scrollLeft = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        scroller.scrollLeft = scroller.scrollWidth;
      }
    };

    scroller.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    window.addEventListener('keydown', onKeyDown);
    return () => {
      scroller.removeEventListener('wheel', onWheel);
      window.removeEventListener('wheel', onWheel, { capture: true });
      window.removeEventListener('keydown', onKeyDown);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [introDone]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return undefined;

    const updateEdge = () => {
      const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
      const left = scroller.scrollLeft;
      const edge = Math.min(window.innerWidth * 0.45, max * 0.35);
      if (left < edge) setScrollEdge('start');
      else if (left > max - edge) setScrollEdge('end');
      else setScrollEdge('middle');
    };

    updateEdge();
    scroller.addEventListener('scroll', updateEdge, { passive: true });
    window.addEventListener('resize', updateEdge);
    return () => {
      scroller.removeEventListener('scroll', updateEdge);
      window.removeEventListener('resize', updateEdge);
    };
  }, []);

  // Legacy hashes: /#about → /about, /#play → /play, /#work → /
  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash === 'about') {
      navigate('/about', { replace: true });
      return;
    }
    if (hash === 'play') {
      navigate('/play', { replace: true });
      return;
    }
    if (hash === 'work' || hash) {
      if (window.history.replaceState) {
        window.history.replaceState(null, '', '/');
      }
    }
    scrollerRef.current?.scrollTo({ left: 0 });
  }, [location.hash, navigate]);

  const handleProtectedClick = (path) => {
    setProtectedPath(path);
  };

  const handlePasswordSuccess = () => {
    const path = protectedPath;
    setProtectedPath(null);
    if (path) navigate(path);
  };

  const goHome = () => {
    scrollerRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
    if (window.history.replaceState) {
      window.history.replaceState(null, '', '/');
    }
  };

  const handleNav = (item) => {
    if (item.type === 'route') {
      navigate(item.path);
      return;
    }
    goHome();
  };

  return (
    <div className={`home home--horizontal${introDone ? '' : ' home--intro'}`}>
      {!introDone && <IntroSplash onComplete={handleIntroComplete} />}

      <nav className="home-section-nav" aria-label="Sections">
        {NAV_SECTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="home-section-btn"
            aria-current={item.id === 'work' ? 'page' : undefined}
            onClick={() => handleNav(item)}
            onMouseEnter={() => setCursorVariant?.('hover')}
            onMouseLeave={() => setCursorVariant?.('default')}
          >
            {item.id === 'work' && <span className="home-section-dot" aria-hidden />}
            {item.label}
          </button>
        ))}
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="home-section-btn home-section-btn--resume"
          onMouseEnter={() => setCursorVariant?.('hover')}
          onMouseLeave={() => setCursorVariant?.('default')}
        >
          resume
          <span className="home-section-btn-arrow" aria-hidden>
            ↗
          </span>
        </a>
      </nav>

      <div className="home-contact-links" aria-label="Contact links">
        {CONTACT_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            {...(link.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            className="home-contact-link"
            onMouseEnter={() => setCursorVariant?.('hover')}
            onMouseLeave={() => setCursorVariant?.('default')}
          >
            {link.label}
            <span className="home-contact-link-arrow" aria-hidden>
              ↗
            </span>
          </a>
        ))}
      </div>

      <div
        className={`home-hero-chrome${scrollEdge === 'middle' || !introDone ? ' home-hero-chrome--hidden' : ''}`}
      >
        {scrollEdge === 'end' ? (
          <button
            type="button"
            className="home-scroll-hint home-scroll-hint--action"
            onClick={goHome}
            onMouseEnter={() => setCursorVariant?.('hover')}
            onMouseLeave={() => setCursorVariant?.('default')}
          >
            click to go back
          </button>
        ) : (
          <p className="home-scroll-hint" aria-hidden="true">
            scroll to side
          </p>
        )}
      </div>

      <div className="home-scroller" id="home-scroller" ref={scrollerRef}>
        {WORK_STREAM.map((item, index) => (
          <section
            key={item.key}
            className={`home-slide home-slide-card home-slide-${item.kind} ${item.float || ''}`}
          >
            <ProjectCard
              project={item.project}
              index={index}
              setCursorVariant={setCursorVariant}
              onProtectedClick={handleProtectedClick}
            />
          </section>
        ))}
      </div>

      <ScrollRuler scrollerRef={scrollerRef} setCursorVariant={setCursorVariant} />

      <PasswordGate
        password="karenkodera"
        isOpen={Boolean(protectedPath)}
        onClose={() => setProtectedPath(null)}
        onSuccess={handlePasswordSuccess}
      />
    </div>
  );
};

export default Home;
