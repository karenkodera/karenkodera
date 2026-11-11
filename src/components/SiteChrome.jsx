import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { CONTACT_LINKS, RESUME_URL } from './Hero';
import SiteClock from './SiteClock';
import ScrollRuler from './ScrollRuler';
import { navigateSection, sectionDirection } from '../hooks/useSectionPager';
import './SiteChrome.css';

const NAV_ITEMS = [
  { id: 'about', label: 'about', path: '/' },
  { id: 'work', label: 'work', path: '/work' },
  { id: 'play', label: 'play', path: '/play' },
];

/**
 * Pill nav + contacts — portaled to document.body so page transitions
 * never move them.
 */
const SiteChrome = ({ setCursorVariant }) => {
  const location = useLocation();
  const navigate = useNavigate();

  if (typeof document === 'undefined') return null;

  const activeId =
    location.pathname === '/play'
      ? 'play'
      : location.pathname === '/work'
        ? 'work'
        : location.pathname === '/' || location.pathname === '/about'
          ? 'about'
          : null;

  const handleNav = (item) => {
    if (item.id === 'work' && location.pathname === '/work') {
      document.querySelector('.home-scroller')?.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (item.path === location.pathname) return;
    const dir = sectionDirection(location.pathname, item.path);
    navigateSection(navigate, item.path, dir);
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
