import { motion } from 'framer-motion';
import { scrollHomeTo } from '../utils/scrollHome';
import './Hero.css';

const RESUME_URL = 'https://drive.google.com/file/d/1hH56x_vKd1yI-vyyi-ExBk-bYQnbQq60/view?usp=sharing';

const CONTACT_LINKS = [
  { href: 'https://linkedin.com', label: 'LinkedIn', external: true },
  { href: 'mailto:karen@kodera.us', label: 'Email', external: false },
];

const Hero = ({ setCursorVariant }) => {
  const handleEnter = () => setCursorVariant?.('hover');
  const handleLeave = () => setCursorVariant?.('default');

  const goToAbout = () => {
    scrollHomeTo('about');
    if (window.history.replaceState) {
      window.history.replaceState(null, '', '/#about');
    }
  };

  return (
    <section className="hero" aria-label="Introduction">
      <div className="hero-content">
        <motion.h1
          className="hero-title"
          initial={{ opacity: 1, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={goToAbout}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              goToAbout();
            }
          }}
          role="link"
          tabIndex={0}
          aria-label="Karen Kodera - go to about"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <span className="hero-title-line">
            <span className="hero-title-word">KAREN</span>
          </span>
          <span className="hero-title-line">
            <span className="hero-title-word hero-title-word--kodera">
              <span className="hero-title-letter">K</span>
              <span className="hero-title-o-slot" aria-hidden="true">
                <span className="hero-title-letter hero-title-o">O</span>
                <span className="hero-title-photo-slot">
                  <img
                    className="hero-title-photo"
                    src="/about-photo.png"
                    alt=""
                  />
                </span>
              </span>
              <span className="hero-title-letter">D</span>
              <span className="hero-title-letter">E</span>
              <span className="hero-title-letter">R</span>
              <span className="hero-title-letter">A</span>
            </span>
          </span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 1, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          a multidisciplinary designer who loves iteration
        </motion.p>
      </div>
    </section>
  );
};

export default Hero;

export { RESUME_URL, CONTACT_LINKS };
