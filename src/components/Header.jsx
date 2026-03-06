import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';
import './Header.css';

const Header = ({ setCursorVariant, handleCursorChange }) => {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [hoveredCompactIndex, setHoveredCompactIndex] = useState(null);
  const navRefs = useRef([]);
  const compactNavRefs = useRef([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 100;
      setIsCompact(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get dot position for cursor morphing
  const getDotPosition = useCallback((element, isCompactMenu = false) => {
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    
    // Calculate exact dot center position based on CSS:
    // nav-link: padding 16px left, dot 6px wide -> center at 16 + 3 = 19px
    // bubble-compact-link: padding 12px left, dot 5px wide -> center at 12 + 2.5 = 14.5px
    const dotCenterX = isCompactMenu ? 14.5 : 19;
    const dotSize = isCompactMenu ? 5 : 6;
    
    return {
      x: rect.left + dotCenterX,
      y: rect.top + rect.height / 2,
      width: dotSize,
      height: dotSize,
    };
  }, []);

  const handleNavMouseEnter = (index, isCompactMenu = false) => {
    if (isCompactMenu) {
      setHoveredCompactIndex(index);
      // Morph cursor to dot for all nav items
      if (handleCursorChange) {
        const element = compactNavRefs.current[index];
        const dotPos = getDotPosition(element, true);
        if (dotPos) {
          handleCursorChange('navDot', { dotPosition: dotPos, element });
        }
      } else {
        setCursorVariant('hover');
      }
    } else {
      setHoveredIndex(index);
      // Morph cursor to dot for all nav items
      if (handleCursorChange) {
        const element = navRefs.current[index];
        const dotPos = getDotPosition(element, false);
        if (dotPos) {
          handleCursorChange('navDot', { dotPosition: dotPos, element });
        }
      } else {
        setCursorVariant('hover');
      }
    }
  };

  const handleNavMouseLeave = (isCompact = false) => {
    if (isCompact) {
      setHoveredCompactIndex(null);
    } else {
      setHoveredIndex(null);
    }
    setCursorVariant('default');
  };

  const handleOtherMouseEnter = () => setCursorVariant('hover');
  const handleOtherMouseLeave = () => setCursorVariant('default');

  const handleNavClick = () => {
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { path: '/', label: 'work' },
    { path: '/about', label: 'about' },
  ];

  // Active index is ONLY based on current route (not hover)
  const activeIndex = navItems.findIndex(item => item.path === location.pathname);
  const activeCompactIndex = activeIndex;

  return (
    <>
      {/* Compact Bubble Menu only - visible when scrolled */}
      <AnimatePresence>
        {isCompact && (
          <motion.nav
            className="bubble-menu-compact"
            initial={{ y: -50, opacity: 0, scale: 0.8 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                ref={el => compactNavRefs.current[index] = el}
                to={item.path}
                className={`bubble-compact-link ${activeCompactIndex === index ? 'active' : ''}`}
                onMouseEnter={() => handleNavMouseEnter(index, true)}
                onMouseLeave={() => handleNavMouseLeave(true)}
                onClick={handleNavClick}
              >
                {/* Animated dot - shows for active item always, and for any item on hover */}
                <AnimatePresence mode="wait">
                  {(activeCompactIndex === index && hoveredCompactIndex !== index) || hoveredCompactIndex === index ? (
                    <motion.span
                      className="bubble-compact-dot"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 25,
                      }}
                    />
                  ) : (
                    <span className="bubble-compact-dot-placeholder" />
                  )}
                </AnimatePresence>
                <span className="bubble-compact-label">{item.label}</span>
              </Link>
            ))}
            <span className="bubble-separator">|</span>
            <a
              href="https://drive.google.com/file/d/1Y3znbP0TRkg7HWIuc0sueCin9TuKyWom/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="bubble-compact-link bubble-compact-resume"
              onMouseEnter={handleOtherMouseEnter}
              onMouseLeave={handleOtherMouseLeave}
            >
              resume
              <svg className="external-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
