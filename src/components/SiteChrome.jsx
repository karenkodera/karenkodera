import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { CONTACT_LINKS, RESUME_URL } from './Hero';
import SiteClock from './SiteClock';
import './SiteChrome.css';

const NAV_ITEMS = [
  { id: 'work', label: 'work', path: '/' },
  { id: 'play', label: 'play', path: '/play' },
  { id: 'about', label: 'about', path: '/about' },
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
      : location.pathname === '/about'
        ? 'about'
        : location.pathname === '/' || location.pathname === '/work'
          ? 'work'
          : null;

  const handleNav = (item) => {
    if (item.id === 'work') {
      if (location.pathname === '/') {
        document.querySelector('.home-scroller')?.scrollTo({ left: 0, behavior: 'smooth' });
        if (window.history.replaceState) {
          window.history.replaceState(null, '', '/');
        }
      } else {
        navigate('/');
      }
      return;
    }
    navigate(item.path);
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
    </>,
    document.body
  );
};

export default SiteChrome;
