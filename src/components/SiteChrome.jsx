import { useLocation, useNavigate } from 'react-router-dom';
import { CONTACT_LINKS, RESUME_URL } from './Hero';
import '../pages/Home.css';

const NAV_ITEMS = [
  { id: 'work', label: 'work', path: '/' },
  { id: 'play', label: 'play', path: '/play' },
  { id: 'about', label: 'about', path: '/about' },
];

const TAB_PATHS = new Set(['/', '/play', '/about']);

/**
 * Fixed pill nav + contact links — lives outside page transitions.
 */
const SiteChrome = ({ setCursorVariant }) => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!TAB_PATHS.has(location.pathname)) return null;

  const activeId =
    location.pathname === '/play'
      ? 'play'
      : location.pathname === '/about'
        ? 'about'
        : 'work';

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

  return (
    <>
      <nav className="home-section-nav" aria-label="Sections">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className="home-section-btn"
            aria-current={item.id === activeId ? 'page' : undefined}
            onClick={() => handleNav(item)}
            onMouseEnter={() => setCursorVariant?.('hover')}
            onMouseLeave={() => setCursorVariant?.('default')}
          >
            {item.id === activeId && <span className="home-section-dot" aria-hidden />}
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
    </>
  );
};

export default SiteChrome;
