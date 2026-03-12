import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import './CustomCursor.css';

const WIGGLE_FIRST_AFTER_MS = 1000;
const WIGGLE_REPEAT_EVERY_MS = 4000;

const CustomCursor = ({ cursorVariant, hoveredElement }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [elementBounds, setElementBounds] = useState(null);
  const [dotTarget, setDotTarget] = useState(null);
  const [wiggleTrigger, setWiggleTrigger] = useState(0);
  const projectHoverTimersRef = useRef({ first: null, repeat: null });
  
  // Smooth spring physics for organic cursor movement
  const springConfig = { stiffness: 400, damping: 28, mass: 0.5 };
  const cursorX = useSpring(0, springConfig);
  const cursorY = useSpring(0, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      // Update spring targets for smooth following
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible, cursorX, cursorY]);

  useEffect(() => {
    if (hoveredElement && cursorVariant === 'text') {
      const bounds = hoveredElement.getBoundingClientRect();
      setElementBounds(bounds);
    } else {
      setElementBounds(null);
    }
  }, [hoveredElement, cursorVariant]);

  // Handle navDot variant - extract dot position from hoveredElement
  useEffect(() => {
    if (cursorVariant === 'navDot' && hoveredElement?.dotPosition) {
      setDotTarget(hoveredElement.dotPosition);
    } else {
      setDotTarget(null);
    }
  }, [cursorVariant, hoveredElement]);

  // Wiggle pill: once after 1s, then again every 4s while hovering a case study
  useEffect(() => {
    if (cursorVariant === 'project') {
      const t = projectHoverTimersRef.current;
      t.first = window.setTimeout(() => {
        setWiggleTrigger((k) => k + 1);
        t.repeat = window.setInterval(() => {
          setWiggleTrigger((k) => k + 1);
        }, WIGGLE_REPEAT_EVERY_MS);
      }, WIGGLE_FIRST_AFTER_MS);
    } else {
      const t = projectHoverTimersRef.current;
      if (t.first) clearTimeout(t.first);
      if (t.repeat) clearInterval(t.repeat);
      t.first = null;
      t.repeat = null;
    }
    return () => {
      const t = projectHoverTimersRef.current;
      if (t.first) clearTimeout(t.first);
      if (t.repeat) clearInterval(t.repeat);
    };
  }, [cursorVariant]);

  const padding = 16;
  const isProjectVariant = cursorVariant === 'project';
  const isTextVariant = cursorVariant === 'text';
  const isNavDotVariant = cursorVariant === 'navDot';

  // When in navDot mode, cursor snaps fully to the dot position
  const getDotCursorPosition = () => {
    if (!isNavDotVariant || !dotTarget) {
      return { x: mousePosition.x - 4, y: mousePosition.y - 4 };
    }
    // Snap completely to dot position
    return {
      x: dotTarget.x - 4,
      y: dotTarget.y - 4,
    };
  };

  const dotCursorPos = getDotCursorPosition();

  // Pill floats just above the dot when hovering a case study
  const projectPillOffsetX = 6;
  const projectPillOffsetY = -28;
  const projectPillX = mousePosition.x + projectPillOffsetX;
  const projectPillY = mousePosition.y + projectPillOffsetY;

  return (
    <>
      {/* Default cursor dot - always visible (pill floats above it on project hover) */}
      <motion.div
        className={`custom-cursor ${isTextVariant ? 'cursor-hidden' : ''} ${isNavDotVariant ? 'nav-dot-cursor' : ''}`}
        animate={{
          x: dotCursorPos.x,
          y: dotCursorPos.y,
          width: 8,
          height: 8,
          opacity: isVisible ? 1 : 0,
          scale: isNavDotVariant ? 1.1 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: isNavDotVariant ? 300 : 400,
          damping: isNavDotVariant ? 22 : 30,
          mass: isNavDotVariant ? 0.6 : 0.8,
        }}
        style={{
          backgroundColor: 'var(--text-color)',
          borderRadius: '50%',
        }}
      />


      {/* Hover ring cursor */}
      <AnimatePresence>
        {cursorVariant === 'hover' && (
          <motion.div
            className="custom-cursor hover-cursor"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{
              x: mousePosition.x - 24,
              y: mousePosition.y - 24,
              width: 48,
              height: 48,
              opacity: 1,
              scale: 1,
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 30,
              mass: 0.8,
            }}
          />
        )}
      </AnimatePresence>

      {/* Text highlight cursor */}
      {isTextVariant && elementBounds && (
        <motion.div
          className="custom-cursor text-cursor"
          animate={{
            x: elementBounds.left - padding,
            y: elementBounds.top - padding,
            width: elementBounds.width + padding * 2,
            height: elementBounds.height + padding * 2,
          }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30,
            mass: 0.8,
          }}
        />
      )}

      {/* View project pill - floats diagonal top-right of dot when hovering a case study; pops in/out */}
      <AnimatePresence>
        {isProjectVariant && (
          <motion.div
            className="custom-cursor project-cursor"
            initial={{
              x: projectPillX,
              y: projectPillY,
              opacity: 0,
              scale: 0.5,
            }}
            animate={{
              x: projectPillX,
              y: projectPillY,
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.6,
            }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 24,
              mass: 0.6,
            }}
          >
            <motion.span
              key={wiggleTrigger}
              style={{ display: 'inline-block' }}
              initial={{ rotate: 0 }}
              animate={{ rotate: wiggleTrigger >= 1 ? [0, -5, 5, -2, 0] : 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
            >
              view project
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomCursor;
