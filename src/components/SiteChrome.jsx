import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { CONTACT_LINKS, RESUME_URL } from './Hero';
import SiteClock from './SiteClock';
import ScrollRuler from './ScrollRuler';
import { navigateSection, pageDirRef, sectionDirection } from '../hooks/useSectionPager';
import './SiteChrome.css';

const NAV_ITEMS = [
  { id: 'about', label: 'about', path: '/', scrollTo: 'about' },
  { id: 'work', label: 'work', path: '/', scrollTo: 'work' },
  { id: 'play', label: 'play', path: '/play' },
];

function scrollLandingTo(scrollTo) {
  const scroller = document.getElementById('home-scroller');
  if (!scroller) return;
  if (scrollTo === 'work') {
    const work = document.getElementById('work');
    if (work) {
      scroller.scrollTo({ top: work.offsetTop, behavior: 'smooth' });
      return;
    }
  }
  scroller.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Pill nav + contacts — portaled to document.body so page transitions
 * never move them.
 */
const SiteChrome = ({ setCursorVariant }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [homeTab, setHomeTab] = useState('about');

  useEffect(() => {
    if (location.pathname !== '/') {
      setHomeTab('about');
      return undefined;
    }

    const scroller = document.getElementById('home-scroller');
    if (!scroller) return undefined;

    const update = () => {
      const work = document.getElementById('work');
      if (!work) {
        setHomeTab('about');
        return;
      }
      const threshold = work.offsetTop - scroller.clientHeight * 0.35;
      setHomeTab(scroller.scrollTop >= threshold ? 'work' : 'about');
    };

    update();
    scroller.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      scroller.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [location.pathname]);

  if (typeof document === 'undefined') return null;

  const activeId =
    location.pathname === '/play'
      ? 'play'
      : location.pathname === '/' || location.pathname === '/about' || location.pathname === '/work'
        ? homeTab
        : null;

  const handleNav = (item) => {
    if (item.path === '/play') {
      if (location.pathname === '/play') return;
      const dir = sectionDirection(location.pathname === '/work' ? '/' : location.pathname, '/play');
      navigateSection(navigate, '/play', dir);
      return;
    }

    // about / work — same landing page
    if (location.pathname === '/') {
      scrollLandingTo(item.scrollTo);
      return;
    }

    const from = location.pathname === '/work' ? '/' : location.pathname;
    const dir = sectionDirection(from, '/');
    pageDirRef.current = dir;
    navigate('/', { state: { pageDir: dir, scrollTo: item.scrollTo } });
  };

  return createPortal(
    <>
      <nav className="site-chrome-nav" aria-label="Sections">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="site-chrome-btn"
            aria-current={item.id === activeId ? 'page' : undefined}
            onClick={() => handleNav(item)}
            onMouseEnter={() => setCursorVariant?.('hover')}
            onMouseLeave={() => setCursorVariant?.('default')}
          >
            {item.id === activeId && <span className="site-chrome-dot" aria-hidden />}
            {item.label}
          </button>
        ))}
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="site-chrome-btn site-chrome-btn--resume"
          onMouseEnter={() => setCursorVariant?.('hover')}
          onMouseLeave={() => setCursorVariant?.('default')}
        >
          resume
          <span className="site-chrome-btn-arrow" aria-hidden>
            ↗
          </span>
        </a>
      </nav>

      <div className="site-chrome-contacts" aria-label="Contact links">
        {CONTACT_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            {...(link.external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            className="site-chrome-contact"
            onMouseEnter={() => setCursorVariant?.('hover')}
            onMouseLeave={() => setCursorVariant?.('default')}
          >
            {link.label}
            <span className="site-chrome-contact-arrow" aria-hidden>
              ↗
            </span>
          </a>
        ))}
      </div>

      <SiteClock />
      <ScrollRuler setCursorVariant={setCursorVariant} />
    </>,
    document.body
  );
};

export default SiteChrome;
