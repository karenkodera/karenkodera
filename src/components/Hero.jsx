import { motion } from 'framer-motion';
import { scrollHomeTo } from '../utils/scrollHome';
import { RollingChar } from './RollingText';
import './RollingText.css';
import './Hero.css';

const RESUME_URL = 'https://drive.google.com/file/d/1hH56x_vKd1yI-vyyi-ExBk-bYQnbQq60/view?usp=sharing';

const CONTACT_LINKS = [
  { href: 'https://linkedin.com', label: 'LinkedIn', external: true },
  { href: 'mailto:karen@kodera.us', label: 'Email', external: false },
];

const ROLL_SPEED = 0.05;
const ROLL_DURATION = 3.2;
function RollingWord({ text, className = '', specialO = false }) {
  const chars = Array.from(text);
  const total = chars.length;

  return (
    <span className={`hero-title-word rolling-text ${className}`.trim()}>
      <span className="sr-only">{text}</span>
      {chars.map((char, index) => {
        if (specialO && char === 'O') {
          return (
            <span key={`o-${index}`} className="hero-title-o-slot" aria-hidden="true">
              <RollingChar
                char="O"
                index={index}
                total={total}
                speed={ROLL_SPEED}
                duration={ROLL_DURATION}
                itemHeightEm={0.86}
                className="hero-title-o"
              />
              <span className="hero-title-photo-slot">
                <img className="hero-title-photo" src="/about-photo.png" alt="" />
              </span>
            </span>
          );
        }
        return (
          <RollingChar
            key={`${char}-${index}`}
            char={char}
            index={index}
            total={total}
            speed={ROLL_SPEED}
            duration={ROLL_DURATION}
            itemHeightEm={0.86}
            className="hero-title-letter"
          />
        );
      })}
    </span>
  );
}

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
          className="hero-subtitle"
          initial={{ opacity: 1, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.06, ease: [0.25, 0.1, 0.25, 1] }}
        >
          multidisciplinary designer currently based in new york city
        </motion.p>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 1, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
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
            <RollingWord text="KAREN" />
          </span>
          <span className="hero-title-line">
            <RollingWord text="KODERA" className="hero-title-word--kodera" specialO />
          </span>
        </motion.h1>
      </div>
    </section>
  );
};

export default Hero;

export { RESUME_URL, CONTACT_LINKS };
