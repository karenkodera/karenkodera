import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './SectionHeader.css';

const RESUME_URL = 'https://drive.google.com/file/d/1Y3znbP0TRkg7HWIuc0sueCin9TuKyWom/view?usp=sharing';

const navItems = [
  { path: '/', label: 'work' },
  { path: '/about', label: 'about' },
];

export default function SectionHeader({ setCursorVariant }) {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const activeIndex = navItems.findIndex((item) => item.path === location.pathname);

  return (
    <header className="section-header" aria-label="Navigation">
      <nav className="section-header-nav">
        {navItems.map((item, index) => (
          <Link
            key={item.path}
            to={item.path}
            className={`section-header-link ${activeIndex === index ? 'active' : ''}`}
            onMouseEnter={() => {
              setHoveredIndex(index);
              setCursorVariant('hover');
            }}
            onMouseLeave={() => {
              setHoveredIndex(null);
              setCursorVariant('default');
            }}
            onClick={() => window.scrollTo(0, 0)}
          >
            <AnimatePresence mode="wait">
              {(activeIndex === index && hoveredIndex !== index) || hoveredIndex === index ? (
                <motion.span
                  className="section-header-dot"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                />
              ) : (
                <span className="section-header-dot-placeholder" />
              )}
            </AnimatePresence>
            <span className="section-header-label">{item.label}</span>
          </Link>
        ))}
        <span className="section-header-sep" aria-hidden>|</span>
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="section-header-link section-header-resume"
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          resume
          <svg className="section-header-external" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </nav>
    </header>
  );
}
