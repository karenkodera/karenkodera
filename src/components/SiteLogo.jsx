import './SiteLogo.css';

const homeHref = import.meta.env.BASE_URL || '/';

/**
 * Top-left KK mark — full reload to home so the intro plays again.
 */
const SiteLogo = ({ setCursorVariant }) => {
  const handleClick = (e) => {
    e.preventDefault();
    try {
      sessionStorage.removeItem('karenkodera-intro-done');
    } catch {
      /* ignore */
    }
    window.location.assign(homeHref);
  };

  return (
    <a
      href={homeHref}
      className="site-logo"
      aria-label="Karen Kodera — reload home"
      onClick={handleClick}
      onMouseEnter={() => setCursorVariant?.('hover')}
      onMouseLeave={() =>
        setCursorVariant?.(
          document.documentElement.getAttribute('data-intro') === '1' ? 'intro' : 'default'
        )
      }
    >
      KK
    </a>
  );
};

export default SiteLogo;
