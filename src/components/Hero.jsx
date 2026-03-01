import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Hero.css';

const RESUME_URL = 'https://drive.google.com/file/d/1Y3znbP0TRkg7HWIuc0sueCin9TuKyWom/view?usp=sharing';

const Hero = ({ setCursorVariant, handleCursorChange, theme, setTheme }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <section className="hero">
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="hero-avatar-container" variants={itemVariants}>
          <motion.img
            src="https://framerusercontent.com/images/CTmSY8MITcYG5EkE8CeIlxzGbSM.png?scale-down-to=512"
            alt="Karen Kodera"
            className="hero-avatar"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          />
        </motion.div>

        <motion.h1
          className="hero-title"
          variants={itemVariants}
        >
          Hi, I'm Karen Kodera.
        </motion.h1>

        <motion.p
          className="hero-description"
          variants={itemVariants}
        >
          A product designer with a background in architecture, turning complex problems into intuitive, human-centered solutions.
        </motion.p>

        <motion.nav className="hero-nav" variants={itemVariants} aria-label="Main">
          {setTheme && (
            <button
              type="button"
              className="theme-switch"
              onClick={() => setTheme((t) => (t === 'light' ? 'dark' : 'light'))}
              onMouseEnter={() => setCursorVariant('hover')}
              onMouseLeave={() => setCursorVariant('default')}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              <span className="theme-switch-track">
                <span className="theme-switch-thumb" data-theme={theme} />
                <span className="theme-switch-icon theme-switch-sun" aria-hidden>☀️</span>
                <span className="theme-switch-icon theme-switch-moon" aria-hidden>🌙</span>
              </span>
            </button>
          )}
          <Link
            to="/"
            className="hero-nav-link"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            work
          </Link>
          <span className="hero-nav-sep" aria-hidden>|</span>
          <Link
            to="/about"
            className="hero-nav-link"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            about
          </Link>
          <span className="hero-nav-sep" aria-hidden>|</span>
          <a
            href={RESUME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hero-nav-link hero-nav-resume"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            resume
            <svg className="hero-nav-external" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </motion.nav>
      </motion.div>
    </section>
  );
};

export default Hero;
