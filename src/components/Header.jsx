import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useCallback } from 'react';
import { scrollHomeTo } from '../utils/scrollHome';
import './Header.css';

const RESUME_URL = 'https://drive.google.com/file/d/1hH56x_vKd1yI-vyyi-ExBk-bYQnbQq60/view?usp=sharing';

const Header = ({ setCursorVariant, handleCursorChange }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const navRefs = useRef([]);

  const getDotPosition = useCallback((element) => {
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    return {
      x: rect.left + 14.5,
      y: rect.top + rect.height / 2,
      width: 5,
      height: 5,
    };
  }, []);

  const handleNavMouseEnter = (index) => {
    setHoveredIndex(index);
    if (handleCursorChange) {
      const element = navRefs.current[index];
      const dotPos = getDotPosition(element);
      if (dotPos) {
        handleCursorChange('navDot', { dotPosition: dotPos, element });
      }
    } else {
      setCursorVariant('hover');
    }
  };

  const handleNavMouseLeave = () => {
    setHoveredIndex(null);
    setCursorVariant('default');
  };

  const handleOtherMouseEnter = () => setCursorVariant('hover');
  const handleOtherMouseLeave = () => setCursorVariant('default');

  const navItems = [
    { id: 'work', label: 'work' },
    { id: 'play', label: 'play' },
    { id: 'about', label: 'about' },
  ];

  const hash = location.hash.replace('#', '');
  const activeIndex = navItems.findIndex((item) => item.id === hash);

  const handleNavClick = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    scrollHomeTo(id);
    if (window.history.replaceState) {
      window.history.replaceState(null, '', `/#${id}`);
    }
  };

  return (
    <nav className="site-nav" aria-label="Primary">
      {navItems.map((item, index) => (
        <button
          key={item.id}
          type="button"
          ref={(el) => {
            navRefs.current[index] = el;
          }}
          className={`site-nav-link${activeIndex === index ? ' active' : ''}`}
          onMouseEnter={() => handleNavMouseEnter(index)}
          onMouseLeave={handleNavMouseLeave}
          onClick={() => handleNavClick(item.id)}
        >
          <AnimatePresence mode="wait">
            {(activeIndex === index && hoveredIndex !== index) || hoveredIndex === index ? (
              <motion.span
                className="site-nav-dot"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              />
            ) : (
              <span className="site-nav-dot-placeholder" />
            )}
          </AnimatePresence>
          <span className="site-nav-label">{item.label}</span>
        </button>
      ))}
      <span className="site-nav-sep" aria-hidden>
        |
      </span>
      <a
        href={RESUME_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="site-nav-link site-nav-resume"
        onMouseEnter={handleOtherMouseEnter}
        onMouseLeave={handleOtherMouseLeave}
      >
        resume
        <svg className="site-nav-external" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </nav>
  );
};

export default Header;
