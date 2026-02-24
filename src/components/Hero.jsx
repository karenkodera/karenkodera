import { motion, useMotionValue, animate } from 'framer-motion';
import { useCallback, useRef } from 'react';
import './Hero.css';

const Hero = ({ setCursorVariant, handleCursorChange, theme, setTheme }) => {
  const rotation = useMotionValue(0);
  const isHoveredRef = useRef(false);
  const spinStopRef = useRef(null);

  const startSpin = useCallback(() => {
    if (!isHoveredRef.current) return;
    spinStopRef.current = animate(rotation, rotation.get() + 360, {
      duration: 1.2,
      ease: 'linear',
      onComplete: () => {
        if (isHoveredRef.current) startSpin();
      },
    });
  }, [rotation]);

  const handleTextEnter = useCallback((e) => {
    isHoveredRef.current = true;
    if (spinStopRef.current) spinStopRef.current.stop();
    if (handleCursorChange) {
      handleCursorChange('text', e.currentTarget);
    } else {
      setCursorVariant('text');
    }
    startSpin();
  }, [handleCursorChange, setCursorVariant, startSpin]);

  const handleTextLeave = useCallback(() => {
    if (handleCursorChange) {
      handleCursorChange('default', null);
    } else {
      setCursorVariant('default');
    }
    isHoveredRef.current = false;
    if (spinStopRef.current) spinStopRef.current.stop();
    spinStopRef.current = animate(rotation, rotation.get() + 360, {
      duration: 2,
      ease: [0.22, 0, 0.36, 1],
    });
  }, [handleCursorChange, setCursorVariant, rotation]);

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

        <motion.div className="hero-actions" variants={itemVariants}>
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
          <motion.a
            href="/karengpt"
            className="karengpt-btn"
            data-cursor-text
            onMouseEnter={handleTextEnter}
            onMouseLeave={handleTextLeave}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.span
              className="karengpt-icon"
              style={{ rotate: rotation }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0L13.5 9L22 7L15 12L22 17L13.5 15L12 24L10.5 15L2 17L9 12L2 7L10.5 9L12 0Z" fill="currentColor"/>
              </svg>
            </motion.span>
            ask karengpt
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
