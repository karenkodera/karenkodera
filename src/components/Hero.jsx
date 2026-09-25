import { motion } from 'framer-motion';
import { scrollHomeTo } from '../utils/scrollHome';
import './Hero.css';

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
        <motion.p
          className="hero-description"
          initial={{ opacity: 1, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          iterating and iterating and iterating and iterating...
        </motion.p>

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
          aria-label="Karen Kodera — click to learn more about me"
          onMouseEnter={handleEnter}
          onMouseLeave={handleLeave}
        >
          <span className="hero-title-line">
            <span className="hero-title-word">KAREN</span>
            <span className="hero-title-photo-slot" aria-hidden="true">
              <img
                className="hero-title-photo"
                src="/about-photo.png"
                alt=""
              />
            </span>
          </span>
          <span className="hero-title-line">
            <span className="hero-title-word">KODERA</span>
          </span>
          <span className="hero-title-hint" aria-hidden="true">
            click to learn more about me
          </span>
        </motion.h1>
      </div>
    </section>
  );
};

export default Hero;
